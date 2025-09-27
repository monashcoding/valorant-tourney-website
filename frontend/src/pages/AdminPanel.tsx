import React, { useState, useEffect } from "react";
import { Tournament } from "../types";
import { useAdminData } from "../hooks/useAdminData";
import { TournamentForm } from "../components/admin/TournamentForm";
import { TeamEditor } from "../components/admin/TeamEditor";
import { DayForm } from "../components/admin/DayForm";

const defaultTournament: Tournament = {
  id: `tournament-${Date.now()}`,
  name: "New Tournament",
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +1 week
  days: [],
  currentDay: undefined,
  status: "upcoming" as const,
  qualifiedTeams: [],
  winners: [],
};

function AdminPanel() {
  const [token, setToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [currentToken, setCurrentToken] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);

  const { data, loading, error, saveStatus, fetchData, saveData } =
    useAdminData(currentToken);

  const [editedTournament, setEditedTournament] = useState<Tournament | null>(
    null
  );

  // Helper to convert strings to Dates recursively
  const convertDatesToObjects = (obj: any): any => {
    if (obj instanceof Date) return obj;
    if (typeof obj !== "object" || obj === null) return obj;

    const newObj = Array.isArray(obj) ? [] : {};
    for (const [key, value] of Object.entries(obj)) {
      if (
        typeof value === "string" &&
        (key.includes("Date") || key.includes("Time"))
      ) {
        const date = new Date(value);
        newObj[key] = isNaN(date.getTime()) ? new Date() : date; // Fallback if invalid
        if (isNaN(date.getTime())) {
          const msg = `Invalid date for ${key}: ${value} — using today`;
          console.warn(msg);
          addWarning(msg);
        }
      } else {
        newObj[key] = convertDatesToObjects(value);
      }
    }
    return newObj;
  };

  const addWarning = (msg: string) => setWarnings((prev) => [...prev, msg]);
  const dismissWarning = (index: number) =>
    setWarnings((prev) => prev.filter((_, i) => i !== index));

  useEffect(() => {
    if (data) {
      try {
        let parsedData = data;
        if (typeof data === "string") parsedData = JSON.parse(data); // Rare, but handle
        const validatedData = convertDatesToObjects(parsedData);

        if (
          typeof validatedData === "object" &&
          validatedData !== null &&
          "name" in validatedData &&
          "days" in validatedData
        ) {
          setEditedTournament(validatedData as Tournament);
        } else {
          console.warn("Invalid tournament data format—initializing defaults");
          addWarning("Invalid tournament data format—initialized defaults");
          setEditedTournament({ ...defaultTournament, ...validatedData }); // Merge valid parts
        }
      } catch (parseErr) {
        console.error("Failed to parse tournament data:", parseErr);
        addWarning("Failed to parse data—using defaults");
        setEditedTournament(defaultTournament);
      }
    } else {
      // First load or empty—init defaults
      setEditedTournament(defaultTournament);
    }
  }, [data]);

  const updateTournament = (updates: Partial<Tournament>) => {
    if (editedTournament) {
      setEditedTournament({ ...editedTournament, ...updates });
    }
  };

  const updateQualifiedTeam = (index: number, updatedTeam: any) => {
    if (editedTournament) {
      const newTeams = [...editedTournament.qualifiedTeams];
      newTeams[index] = updatedTeam;
      setEditedTournament({ ...editedTournament, qualifiedTeams: newTeams });
    }
  };

  const addQualifiedTeam = () => {
    if (editedTournament) {
      const newTeam = {
        id: `team-${Date.now()}`,
        abbreviation: "",
        name: "",
        members: [],
        stats: {
          wins: 0,
          losses: 0,
          roundsWon: 0,
          roundsLost: 0,
          mapWins: 0,
          mapLosses: 0,
        },
      };
      setEditedTournament({
        ...editedTournament,
        qualifiedTeams: [...editedTournament.qualifiedTeams, newTeam],
      });
    }
  };

  const removeQualifiedTeam = (index: number) => {
    if (editedTournament) {
      const newTeams = editedTournament.qualifiedTeams.filter(
        (_, i) => i !== index
      );
      setEditedTournament({ ...editedTournament, qualifiedTeams: newTeams });
    }
  };

  const updateDay = (dayIndex: number, updatedDay: any) => {
    if (editedTournament) {
      const newDays = [...editedTournament.days];
      newDays[dayIndex] = updatedDay;
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const addDay = () => {
    if (editedTournament) {
      const newDay = {
        id: `day-${Date.now()}`,
        dayNumber: editedTournament.days.length + 1,
        date: new Date(),
        rounds: [],
        leaderboard: [],
      };
      setEditedTournament({
        ...editedTournament,
        days: [...editedTournament.days, newDay],
      });
    }
  };

  const removeDay = (dayIndex: number) => {
    if (editedTournament) {
      const newDays = editedTournament.days.filter((_, i) => i !== dayIndex);
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const handleSave = () => {
    if (editedTournament) {
      saveData(editedTournament);
    }
  };

  const handleTokenSubmit = () => {
    if (token.trim()) {
      setCurrentToken(token);
      setShowTokenInput(false);
    }
  };

  const handleLogout = () => {
    setShowTokenInput(true);
    setCurrentToken("");
    setToken("");
  };

  if (showTokenInput) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="border border-yellow-400 bg-neutral-900 p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            Admin Access
          </h2>
          <input
            type="password"
            placeholder="Enter admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-3 bg-neutral-800 rounded mb-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleTokenSubmit}
            className="w-full py-3 bg-yellow-400 rounded font-bold hover:bg-yellow-500 text-black transition-colors"
          >
            Enter Admin Panel
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!editedTournament) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        No data loaded.
      </div>
    );
  }

  return (
    <>
      {warnings.map((w, i) => (
        <div
          key={i}
          className="fixed top-4 right-4 bg-yellow-400 text-black p-4 rounded-lg max-w-sm z-50"
        >
          {w}
          <button
            onClick={() => dismissWarning(i)}
            className="ml-4 text-black underline"
          >
            Dismiss
          </button>
        </div>
      ))}
      <div className="min-h-screen bg-neutral-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Tournament Admin Panel
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-neutral-800 rounded text-white hover:bg-neutral-700"
              >
                Logout
              </button>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-yellow-400 rounded text-black hover:bg-yellow-500"
              >
                Refresh
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-yellow-400 rounded font-bold text-black hover:bg-yellow-500 transition-colors"
                disabled={loading}
              >
                Save Changes
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-yellow-400 p-4 rounded mb-4 text-black">
              {error}
            </div>
          )}
          {saveStatus && (
            <div className="p-4 rounded mb-4 bg-yellow-400 text-black">
              {saveStatus}
            </div>
          )}

          <div className="space-y-8">
            <TournamentForm
              tournament={editedTournament}
              onChange={updateTournament}
              addWarning={addWarning}
            />

            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Qualified Teams
              </h2>
              <button
                onClick={addQualifiedTeam}
                className="mb-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
              >
                Add Team
              </button>
              <div className="space-y-4">
                {(editedTournament?.qualifiedTeams || []).map((team, index) => (
                  <div key={team.id} className="flex space-x-4 items-start">
                    <TeamEditor
                      team={team}
                      onChange={(updatedTeam) =>
                        updateQualifiedTeam(index, updatedTeam)
                      }
                      index={index}
                    />
                    <button
                      onClick={() => removeQualifiedTeam(index)}
                      className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove Team
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Schedule (Days)
              </h2>
              <button
                onClick={addDay}
                className="mb-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
              >
                Add Day
              </button>
              <div className="space-y-4">
                {(editedTournament?.days || []).map((day, index) => (
                  <div key={day.id}>
                    <DayForm
                      day={day}
                      onChange={(updatedDay) => updateDay(index, updatedDay)}
                      dayIndex={index}
                      teams={editedTournament.qualifiedTeams}
                    />
                    <button
                      onClick={() => removeDay(index)}
                      className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove Day
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Winners editing can be added as simple team selects */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Winners</h2>
              <p className="text-white">
                Winners can be set via match winners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
