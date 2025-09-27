import { useState, useEffect } from "react";
import { Tournament } from "../types";

function parseDates(obj: any): any {
  if (obj === null || typeof obj !== "object" || obj instanceof Date) {
    return obj;
  }

  // Handle Tournament level dates
  if (obj.startDate) obj.startDate = new Date(obj.startDate);
  if (obj.endDate) obj.endDate = new Date(obj.endDate);

  // Handle days and nested structures
  if (obj.days && Array.isArray(obj.days)) {
    obj.days.forEach((day: any) => {
      if (day.date) day.date = new Date(day.date);
      if (day.rounds && Array.isArray(day.rounds)) {
        day.rounds.forEach((round: any) => {
          if (round.slots && Array.isArray(round.slots)) {
            round.slots.forEach((slot: any) => {
              if (slot.matches && Array.isArray(slot.matches)) {
                slot.matches.forEach((match: any) => {
                  if (match.scheduledTime)
                    match.scheduledTime = new Date(match.scheduledTime);
                  if (match.startTime)
                    match.startTime = new Date(match.startTime);
                  if (match.endTime) match.endTime = new Date(match.endTime);
                });
              }
            });
          }
        });
      }
    });
  }

  // Recurse into other objects if needed (e.g., qualifiedTeams, but no dates there)
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = parseDates(obj[key]);
    }
  });

  return obj;
}

export const useTournamentData = () => {
  const [data, setData] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // @ts-ignore
  const API_URL = `${import.meta.env.VITE_BACKEND_API || ""}api/data`;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      const parsed = parseDates(json) as Tournament;
      setData(parsed);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch tournament data";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};
