import { useState, useEffect, useRef } from "react";
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

// Deep comparison function to check if data has actually changed
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return obj1 === obj2;

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== "object") return obj1 === obj2;

  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

export const useTournamentData = () => {
  const [data, setData] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousDataRef = useRef<Tournament | null>(null);
  const isInitialLoadRef = useRef(true);

  // @ts-ignore
  const API_URL = `${
    import.meta.env.VITE_BACKEND_API || "https://valorant-json.jasondev.me/"
  }api/data`;

  const fetchData = async () => {
    const wasInitialLoad = isInitialLoadRef.current;

    try {
      // Only show loading state on initial load, not on polling
      if (wasInitialLoad) {
        setLoading(true);
      }
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      const parsed = parseDates(json) as Tournament;

      // Only update state if the data has actually changed
      if (!deepEqual(previousDataRef.current, parsed)) {
        previousDataRef.current = parsed;
        setData(parsed);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch tournament data";
      setError(message);

      // Only reset data on initial load errors, not polling errors
      if (wasInitialLoad) {
        setData(null);
        previousDataRef.current = null;
      }
    } finally {
      // Only update loading state on initial load
      if (wasInitialLoad) {
        setLoading(false);
        isInitialLoadRef.current = false;
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};
