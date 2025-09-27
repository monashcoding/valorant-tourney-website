import { useState, useEffect } from "react";

const getAPI_URL = () => `${process.env.VITE_BACKEND_API}api/data`;

export const useAdminData = (token: string) => {
  const [data, setData] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState("");

  const API_URL = getAPI_URL();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const json = await res.json();
      setData(json);
      setEditedData(JSON.parse(JSON.stringify(json))); // deep copy
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (dataToSave: any) => {
    if (!token) {
      setError("Admin token is required");
      return;
    }

    try {
      setSaveStatus("Saving...");
      setError(null);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      setSaveStatus("Saved successfully!");
      await fetchData(); // Refresh data
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaveStatus("");
    }
  };

  const updateEditedData = (jsonString: string) => {
    const value = jsonString;
    try {
      const newData = JSON.parse(value);
      setEditedData(newData);
      if (error && error.includes("Invalid JSON")) setError(null);
    } catch (parseErr) {
      // Ignore invalid JSON while typing
      if (value.trim() === "") {
        setEditedData({});
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    editedData,
    loading,
    error,
    saveStatus,
    fetchData,
    updateEditedData,
    saveData,
  };
};
