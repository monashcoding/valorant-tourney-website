import React, { useState } from "react";
import { TournamentSlot } from "../../types";
import { MatchEditor } from "./MatchEditor";

interface SlotFormProps {
  slot: TournamentSlot;
  onChange: (slot: TournamentSlot) => void;
  slotIndex: number;
  teams: any[];
}

export const SlotForm: React.FC<SlotFormProps> = ({
  slot,
  onChange,
  slotIndex,
  teams,
}) => {
  const [newMatchFormat, setNewMatchFormat] = useState("BO3");

  const handleSlotChange = (
    field: keyof Omit<TournamentSlot, "matches">,
    value: string
  ) => {
    onChange({ ...slot, [field]: value });
  };

  const addMatch = () => {
    const newMatch = {
      id: `match-${Date.now()}`,
      team1: teams[0] || {
        id: "",
        abbreviation: "T1",
        name: "Team 1",
        members: [],
      },
      team2: teams[1] || {
        id: "",
        abbreviation: "T2",
        name: "Team 2",
        members: [],
      },
      scheduledTime: new Date(),
      status: "scheduled" as const,
      format: newMatchFormat as any,
      maps: [],
      winner: undefined,
      bracketPosition: "",
      roundNumber: slotIndex + 1,
      slotNumber: slot.number,
      stage: "group-stage" as const,
    };
    onChange({ ...slot, matches: [...slot.matches, newMatch] });
    setNewMatchFormat("BO3");
  };

  const updateMatch = (matchIndex: number, updatedMatch: any) => {
    const newMatches = [...slot.matches];
    newMatches[matchIndex] = updatedMatch;
    onChange({ ...slot, matches: newMatches });
  };

  const removeMatch = (matchIndex: number) => {
    const newMatches = slot.matches.filter((_, index) => index !== matchIndex);
    onChange({ ...slot, matches: newMatches });
  };

  return (
    <div className="ml-6 p-2 bg-neutral-600 rounded">
      <div className="space-y-2 mb-4">
        <input
          type="number"
          placeholder="Slot Number"
          value={slot.number}
          onChange={(e) => handleSlotChange("number", e.target.value)}
          className="w-full p-1 bg-neutral-500 rounded text-white text-sm"
        />
        <input
          type="text"
          placeholder="Time Slot"
          value={slot.timeSlot}
          onChange={(e) => handleSlotChange("timeSlot", e.target.value)}
          className="w-full p-1 bg-neutral-500 rounded text-white text-sm"
        />
      </div>

      <h6 className="text-sm font-semibold text-yellow-400 mb-2">Matches</h6>
      <div className="space-y-3">
        {slot.matches.map((match, mIndex) => (
          <div key={match.id} className="border border-neutral-500 p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white text-sm font-medium">
                Match {mIndex + 1}
              </span>
              <button
                onClick={() => removeMatch(mIndex)}
                className="px-1 py-0.5 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              >
                X
              </button>
            </div>
            <MatchEditor
              match={match}
              teams={teams}
              onChange={(updatedMatch) => updateMatch(mIndex, updatedMatch)}
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-2 mt-2">
        <select
          value={newMatchFormat}
          onChange={(e) => setNewMatchFormat(e.target.value)}
          className="flex-1 p-1 bg-neutral-500 rounded text-white text-sm"
        >
          <option value="BO1">BO1</option>
          <option value="BO3">BO3</option>
          <option value="BO5">BO5</option>
        </select>
        <button
          onClick={addMatch}
          className="px-2 py-1 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500 text-sm"
        >
          Add Match
        </button>
      </div>
    </div>
  );
};
