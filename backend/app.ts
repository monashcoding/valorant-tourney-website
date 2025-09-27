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
  try {
    console.info("Attempting to connect to MongoDB...");
    const client = new MongoClient(MONGO_URI as string);
    await client.connect();
    db = client.db("valorant_tourney").collection("data");
    console.info("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

connectDB().catch((err: unknown) => {
  console.error("Fatal connection error:", err);
  process.exit(1);
});

// Middleware for request logging
app.use((req: Request, res: Response, next: any) => {
  console.info(`${req.method} ${req.path} - from ${req.ip}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.info(`Request body keys: ${Object.keys(req.body).join(", ")}`);
  }
  next();
});

// POST /api/data - Store JSON with authorization
app.post("/api/data", async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  console.info("POST /api/data - Auth header present:", !!auth);

  if (auth !== `Bearer ${AUTH_TOKEN}`) {
    console.warn("Unauthorized POST request - invalid token");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const jsonData = req.body;
    console.info(
      "Saving data to MongoDB - keys:",
      Object.keys(jsonData).join(", ")
    );
    const result: UpdateResult = await db.updateOne(
      {},
      { $set: { json: jsonData } },
      { upsert: true }
    );
    console.info(
      `MongoDB update result: matched=${result.matchedCount}, modified=${
        result.modifiedCount
      }, upserted=${!!result.upsertedId}`
    );
    cache.set("current", jsonData);
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "Pragma": "no-cache",
      "Expires": "0",
    });
    res.json({ success: true });
    console.info("Data saved successfully");
  } catch (err: unknown) {
    console.error("Error storing data:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/data - Retrieve JSON from cache or DB
app.get("/api/data", async (req: Request, res: Response) => {
  console.info("GET /api/data request");
  try {
    let data = cache.get("current");
    if (data) {
      console.info("Data served from cache");
    } else {
      console.info("Fetching data from MongoDB...");
      const doc = await db.findOne({});
      data = doc ? doc.json : {};
      console.info(
        "Data from DB - keys:",
        Object.keys(data).join(", ") || "empty"
      );
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
  console.info(`Server running on http://localhost:${PORT}`);
});
