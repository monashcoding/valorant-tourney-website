import React, { useState, useEffect } from "react";
import { Tournament, TournamentRound, TournamentSlot, Match } from "../types";
import { TournamentForm } from "../components/admin/TournamentForm";
import { TeamEditor } from "../components/admin/TeamEditor";
import { RoundForm } from "../components/admin/RoundForm";
import { SlotForm } from "../components/admin/SlotForm";
import { MatchEditor } from "../components/admin/MatchEditor";
import { useAdminData } from "../hooks/useAdminData";
import { Collapsible } from "../components/common/Collapsible";

const defaultTournament: Tournament = {
  id: `tournament-${Date.now()}`,
  name: "New Tournament",
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +1 week
  days: [],
  qualifiedTeams: [],
  status: "upcoming" as const,
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
      const lowerKey = key.toLowerCase();
      if (
        typeof value === "string" &&
        (lowerKey.includes("date") || lowerKey.includes("time"))
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

  const safeDateOnlyValue = (date: Date | string | undefined): string => {
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d && !isNaN(d.getTime())
        ? d.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  const sanitizeTournamentBeforeSave = (t: Tournament): Tournament => {
    const ensureDate = (v: any): Date => {
      if (v instanceof Date) return v;
      const d = new Date(v);
      return isNaN(d.getTime()) ? new Date() : d;
    };

    return {
      ...t,
      startDate: ensureDate(t.startDate),
      endDate: ensureDate(t.endDate),
      days: t.days.map((day) => ({
        ...day,
        date: ensureDate(day.date),
        rounds: day.rounds.map((round) => ({
          ...round,
          number:
            typeof round.number === "number"
              ? round.number
              : parseInt(String(round.number)) || 0,
          slots: round.slots.map((slot) => ({
            ...slot,
            number:
              typeof slot.number === "number"
                ? slot.number
                : parseInt(String(slot.number)) || 0,
            matches: slot.matches.map((m) => ({
              ...m,
              scheduledTime: ensureDate(m.scheduledTime),
              maps: m.maps.map((map) => ({
                mapName: String(map.mapName || ""),
                team1Score:
                  typeof map.team1Score === "number"
                    ? map.team1Score
                    : parseInt(String(map.team1Score)) || 0,
                team2Score:
                  typeof map.team2Score === "number"
                    ? map.team2Score
                    : parseInt(String(map.team2Score)) || 0,
              })),
            })),
          })),
        })),
      })),
      qualifiedTeams: t.qualifiedTeams.map((team) => ({
        ...team,
        members: team.members.map((p) => ({ ...p })),
      })),
    };
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
      // Renumber days
      const renumberedDays = newDays.map((day, i) => ({
        ...day,
        dayNumber: i + 1,
      }));
      setEditedTournament({ ...editedTournament, days: renumberedDays });
    }
  };

  const updateRound = (
    dayIndex: number,
    roundIndex: number,
    updatedRound: TournamentRound
  ) => {
    if (editedTournament) {
      const newDays = [...editedTournament.days];
      const newRounds = [...newDays[dayIndex].rounds];
      newRounds[roundIndex] = updatedRound;
      newDays[dayIndex] = { ...newDays[dayIndex], rounds: newRounds };
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const addRound = (dayIndex: number) => {
    if (editedTournament) {
      const newDays = [...editedTournament.days];
      const day = { ...newDays[dayIndex] };
      const newRound: TournamentRound = {
        id: `round-${Date.now()}`,
        number: day.rounds.length + 1,
        name: `Round ${day.rounds.length + 1}`,
        slots: [],
      };
      day.rounds = [...day.rounds, newRound];
      newDays[dayIndex] = day;
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const removeRound = (dayIndex: number, roundIndex: number) => {
    if (editedTournament) {
      const newDays = [...editedTournament.days];
      const day = { ...newDays[dayIndex] };
      day.rounds = day.rounds.filter((_, i) => i !== roundIndex);
      day.rounds = day.rounds.map((r, i) => ({ ...r, number: i + 1 }));
      newDays[dayIndex] = day;
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const updateSlot = (
    dayIndex: number,
    roundIndex: number,
    slotIndex: number,
    updatedSlot: TournamentSlot
  ) => {
    if (editedTournament) {
      const newDays = [...editedTournament.days];
      const newRounds = [...newDays[dayIndex].rounds];
      const newSlots = [...newRounds[roundIndex].slots];
      newSlots[slotIndex] = updatedSlot;
      newRounds[roundIndex] = { ...newRounds[roundIndex], slots: newSlots };
      newDays[dayIndex] = { ...newDays[dayIndex], rounds: newRounds };
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const addSlot = (dayIndex: number, roundIndex: number) => {
    if (editedTournament) {
      const newDays = [...editedTournament.days];
      const newRounds = [...newDays[dayIndex].rounds];
      const round = { ...newRounds[roundIndex] };
      const newSlot: TournamentSlot = {
        id: `slot-${Date.now()}`,
        number: round.slots.length + 1,
        matches: [],
      };
      round.slots = [...round.slots, newSlot];
      newRounds[roundIndex] = round;
      newDays[dayIndex] = { ...newDays[dayIndex], rounds: newRounds };
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const removeSlot = (
    dayIndex: number,
    roundIndex: number,
    slotIndex: number
  ) => {
    if (editedTournament) {
      const newDays = [...editedTournament.days];
      const newRounds = [...newDays[dayIndex].rounds];
      const round = { ...newRounds[roundIndex] };
      round.slots = round.slots.filter((_, i) => i !== slotIndex);
      round.slots = round.slots.map((s, i) => ({ ...s, number: i + 1 }));
      newRounds[roundIndex] = round;
      newDays[dayIndex] = { ...newDays[dayIndex], rounds: newRounds };
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const updateMatch = (
    dayIndex: number,
    roundIndex: number,
    slotIndex: number,
    matchIndex: number,
    updatedMatch: Match
  ) => {
    if (editedTournament) {
      const newDays = [...editedTournament.days];
      const newRounds = [...newDays[dayIndex].rounds];
      const newSlots = [...newRounds[roundIndex].slots];
      const newMatches = [...newSlots[slotIndex].matches];
      newMatches[matchIndex] = updatedMatch;
      newSlots[slotIndex] = { ...newSlots[slotIndex], matches: newMatches };
      newRounds[roundIndex] = { ...newRounds[roundIndex], slots: newSlots };
      newDays[dayIndex] = { ...newDays[dayIndex], rounds: newRounds };
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const addMatch = (
    dayIndex: number,
    roundIndex: number,
    slotIndex: number
  ) => {
    if (editedTournament) {
      const emptyTeam = { id: "", abbreviation: "", name: "", members: [] };
      const newDays = [...editedTournament.days];
      const newRounds = [...newDays[dayIndex].rounds];
      const newSlots = [...newRounds[roundIndex].slots];
      const slot = { ...newSlots[slotIndex] };
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        team1: emptyTeam,
        team2: emptyTeam,
        scheduledTime: new Date(),
        status: "scheduled" as const,
        format: "BO1" as const,
        maps: [],
        winner: undefined,
      };
      slot.matches = [...slot.matches, newMatch];
      newSlots[slotIndex] = slot;
      newRounds[roundIndex] = { ...newRounds[roundIndex], slots: newSlots };
      newDays[dayIndex] = { ...newDays[dayIndex], rounds: newRounds };
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const removeMatch = (
    dayIndex: number,
    roundIndex: number,
    slotIndex: number,
    matchIndex: number
  ) => {
    if (editedTournament) {
      const newDays = [...editedTournament.days];
      const newRounds = [...newDays[dayIndex].rounds];
      const newSlots = [...newRounds[roundIndex].slots];
      const slot = { ...newSlots[slotIndex] };
      slot.matches = slot.matches.filter((_, i) => i !== matchIndex);
      newSlots[slotIndex] = slot;
      newRounds[roundIndex] = { ...newRounds[roundIndex], slots: newSlots };
      newDays[dayIndex] = { ...newDays[dayIndex], rounds: newRounds };
      setEditedTournament({ ...editedTournament, days: newDays });
    }
  };

  const handleSave = () => {
    if (editedTournament) {
      try {
        const sanitized = sanitizeTournamentBeforeSave(editedTournament);
        saveData(sanitized);
      } catch (e) {
        addWarning(
          "Failed to sanitize data before saving. Attempting raw save."
        );
        // Attempt raw save to partially persist whatever is valid
        saveData(editedTournament);
      }
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  Qualified Teams
                </h2>
                <button
                  onClick={addQualifiedTeam}
                  className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                >
                  Add Team
                </button>
              </div>
              <div className="space-y-3">
                {(editedTournament?.qualifiedTeams || []).map((team, index) => (
                  <Collapsible
                    key={team.id}
                    title={
                      <span>
                        {team.abbreviation || team.name || `Team ${index + 1}`}
                      </span>
                    }
                    subtitle={`${team.members?.length || 0} members`}
                    actions={
                      <button
                        onClick={() => removeQualifiedTeam(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    }
                    defaultOpen={false}
                    className="bg-neutral-800"
                    contentClassName="pt-2"
                  >
                    <TeamEditor
                      team={team}
                      onChange={(updatedTeam) =>
                        updateQualifiedTeam(index, updatedTeam)
                      }
                      index={index}
                    />
                  </Collapsible>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  Schedule (Days)
                </h2>
                <button
                  onClick={addDay}
                  className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                >
                  Add Day
                </button>
              </div>
              <div className="space-y-3">
                {(editedTournament?.days || []).map((day, dayIndex) => (
                  <Collapsible
                    key={day.id}
                    title={<span>Day {day.dayNumber}</span>}
                    subtitle={safeDateOnlyValue(day.date)}
                    actions={
                      <button
                        onClick={() => removeDay(dayIndex)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    }
                    defaultOpen={false}
                    className="bg-neutral-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-white text-sm">
                        Date:
                        <input
                          type="date"
                          value={safeDateOnlyValue(day.date)}
                          onChange={(e) =>
                            updateDay(dayIndex, {
                              ...day,
                              date: new Date(e.target.value),
                            })
                          }
                          className="bg-neutral-700 text-white p-1 rounded ml-2"
                        />
                      </label>
                      <button
                        onClick={() => addRound(dayIndex)}
                        className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                      >
                        Add Round
                      </button>
                    </div>
                    <div className="space-y-2">
                      {day.rounds.map((round, roundIndex) => (
                        <Collapsible
                          key={round.id}
                          title={
                            <span>{round.name || `Round ${round.number}`}</span>
                          }
                          subtitle={`Round ${round.number}`}
                          actions={
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => addSlot(dayIndex, roundIndex)}
                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Add Slot
                              </button>
                              <button
                                onClick={() =>
                                  removeRound(dayIndex, roundIndex)
                                }
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Remove
                              </button>
                            </div>
                          }
                          defaultOpen={false}
                          className="bg-neutral-700"
                        >
                          <div className="mb-3">
                            <RoundForm
                              round={round}
                              onChange={(updatedRound) =>
                                updateRound(dayIndex, roundIndex, updatedRound)
                              }
                            />
                          </div>
                          <div className="space-y-2 ml-2">
                            {round.slots.map((slot, slotIndex) => (
                              <Collapsible
                                key={slot.id}
                                title={<span>Slot {slot.number}</span>}
                                subtitle={`Slot ${slot.number}`}
                                actions={
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() =>
                                        addMatch(
                                          dayIndex,
                                          roundIndex,
                                          slotIndex
                                        )
                                      }
                                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                      Add Match
                                    </button>
                                    <button
                                      onClick={() =>
                                        removeSlot(
                                          dayIndex,
                                          roundIndex,
                                          slotIndex
                                        )
                                      }
                                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                }
                                defaultOpen={false}
                                className="bg-neutral-600"
                              >
                                <div className="mb-2">
                                  <SlotForm
                                    slot={slot}
                                    slotIndex={slotIndex}
                                    onChange={(updatedSlot) =>
                                      updateSlot(
                                        dayIndex,
                                        roundIndex,
                                        slotIndex,
                                        updatedSlot
                                      )
                                    }
                                  />
                                </div>
                                <div className="space-y-2 ml-2">
                                  {slot.matches.map((match, matchIndex) => {
                                    const t1 =
                                      match.team1?.abbreviation ||
                                      match.team1?.name ||
                                      "TBD";
                                    const t2 =
                                      match.team2?.abbreviation ||
                                      match.team2?.name ||
                                      "TBD";
                                    const when = safeDateOnlyValue(
                                      match.scheduledTime as any
                                    );
                                    return (
                                      <Collapsible
                                        key={match.id}
                                        title={
                                          <span>{`Match ${
                                            matchIndex + 1
                                          }: ${t1} vs ${t2}`}</span>
                                        }
                                        subtitle={`${match.status} • ${when}`}
                                        actions={
                                          <button
                                            onClick={() =>
                                              removeMatch(
                                                dayIndex,
                                                roundIndex,
                                                slotIndex,
                                                matchIndex
                                              )
                                            }
                                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                          >
                                            Remove
                                          </button>
                                        }
                                        defaultOpen={false}
                                        className="bg-neutral-500"
                                      >
                                        <MatchEditor
                                          match={match}
                                          onChange={(updatedMatch) =>
                                            updateMatch(
                                              dayIndex,
                                              roundIndex,
                                              slotIndex,
                                              matchIndex,
                                              updatedMatch
                                            )
                                          }
                                          teams={
                                            editedTournament.qualifiedTeams
                                          }
                                        />
                                      </Collapsible>
                                    );
                                  })}
                                </div>
                              </Collapsible>
                            ))}
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </Collapsible>
                ))}
              </div>
            </div>

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
