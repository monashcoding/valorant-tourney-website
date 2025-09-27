import React, { useState } from "react";
import { TournamentDay, TournamentRound } from "../../types";
import { RoundForm } from "./RoundForm";

interface DayFormProps {
  day: TournamentDay;
  onChange: (day: TournamentDay) => void;
  dayIndex: number;
  teams: any[]; // For nested components
}

export const DayForm: React.FC<DayFormProps> = ({
  day,
  onChange,
  dayIndex,
  teams,
}) => {
  const [newRoundName, setNewRoundName] = useState("");

  const handleDayChange = (
    field: keyof Omit<TournamentDay, "rounds" | "leaderboard">,
    value: any
  ) => {
    onChange({ ...day, [field]: value });
  };

  const addRound = () => {
    if (newRoundName) {
      const newRound: TournamentRound = {
        id: `round-${Date.now()}`,
        number: day.rounds.length + 1,
        name: newRoundName,
        description: "",
        timeSlot: "",
        slots: [],
      };
      onChange({ ...day, rounds: [...day.rounds, newRound] });
      setNewRoundName("");
    }
  };

  const updateRound = (roundIndex: number, updatedRound: TournamentRound) => {
    const newRounds = [...day.rounds];
    newRounds[roundIndex] = updatedRound;
    onChange({ ...day, rounds: newRounds });
  };

  const removeRound = (roundIndex: number) => {
    const newRounds = day.rounds.filter((_, index) => index !== roundIndex);
    onChange({ ...day, rounds: newRounds });
  };

  return (
    <div className="border border-yellow-400 bg-neutral-800 p-4 rounded-lg mb-4">
      <h4 className="text-lg font-bold text-white mb-2">Day {dayIndex + 1}</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Date
          </label>
          <input
            type="date"
            value={day.date.toISOString().split("T")[0]}
            onChange={(e) => handleDayChange("date", new Date(e.target.value))}
            className="w-full p-2 bg-neutral-700 rounded text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Day Number
          </label>
          <input
            type="number"
            value={day.dayNumber}
            onChange={(e) =>
              handleDayChange("dayNumber", parseInt(e.target.value))
            }
            className="w-full p-2 bg-neutral-700 rounded text-white"
            min="1"
          />
        </div>
      </div>

      <h5 className="text-md font-semibold text-yellow-400 mb-2">Rounds</h5>
      <div className="space-y-4 mb-4">
        {day.rounds.map((round, rIndex) => (
          <div key={round.id} className="border border-neutral-600 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <h6 className="font-medium text-white">Round {rIndex + 1}</h6>
              <button
                onClick={() => removeRound(rIndex)}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Remove Round
              </button>
            </div>
            <RoundForm
              round={round}
              onChange={(updatedRound) => updateRound(rIndex, updatedRound)}
              roundIndex={rIndex}
              teams={teams}
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="New Round Name"
          value={newRoundName}
          onChange={(e) => setNewRoundName(e.target.value)}
          className="flex-1 p-2 bg-neutral-700 rounded text-white"
        />
        <button
          onClick={addRound}
          className="px-4 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500"
          disabled={!newRoundName}
        >
          Add Round
        </button>
      </div>

      {/* Leaderboard editing can be added here if needed */}
      <div className="mt-4">
        <h5 className="text-md font-semibold text-yellow-400 mb-2">
          Leaderboard
        </h5>
        {/* Implement leaderboard editing similar to teams */}
        <p className="text-white text-sm">
          Leaderboard editing to be implemented.
        </p>
      </div>
    </div>
  );
};
