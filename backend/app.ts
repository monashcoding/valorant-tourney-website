import "dotenv/config";

import express, { Request, Response } from "express";
import cors from "cors";
import { MongoClient, Collection, UpdateResult } from "mongodb";
import { LRUCache } from "lru-cache";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://valorant.monashcoding.com"],
  })
);
app.use(express.json());

const PORT = 3000;
const MONGO_URI = process.env.MONGODB_URI;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

if (!MONGO_URI || !AUTH_TOKEN) {
  console.error(
    "Missing required environment variables: MONGODB_URI and AUTH_TOKEN"
  );
  process.exit(1);
}

let db: Collection<any>;
const cache = new LRUCache<string, any>({ max: 1 });

async function connectDB(): Promise<void> {
  const client = new MongoClient(MONGO_URI as string);
  await client.connect();
  db = client.db("valorant_tourney").collection("data");
  console.log("Connected to MongoDB");
}

connectDB().catch((err: unknown) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

// POST /api/data - Store JSON with authorization
app.post("/api/data", async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const jsonData = req.body;
    const result: UpdateResult = await db.updateOne(
      {},
      { $set: { json: jsonData } },
      { upsert: true }
    );
    cache.set("current", jsonData);
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "Pragma": "no-cache",
      "Expires": "0",
    });
    res.json({ success: true });
  } catch (err: unknown) {
    console.error("Error storing data:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/data - Retrieve JSON from cache or DB
app.get("/api/data", async (req: Request, res: Response) => {
  try {
    let data = cache.get("current");
    if (!data) {
      const doc = await db.findOne({});
      data = doc ? doc.json : {};
      cache.set("current", data);
    }
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "Pragma": "no-cache",
      "Expires": "0",
    });
    res.json(data);
  } catch (err: unknown) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
