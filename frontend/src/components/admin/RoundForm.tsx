import React from "react";
import { TournamentRound } from "../../types";

interface RoundFormProps {
  round: TournamentRound;
  onChange: (round: TournamentRound) => void;
}

export const RoundForm: React.FC<RoundFormProps> = ({ round, onChange }) => {
  const handleRoundChange = (
    field: keyof Omit<TournamentRound, "slots">,
    value: string | number
  ) => {
    onChange({ ...round, [field]: value });
  };

  return (
    <div className="ml-4 p-3 bg-neutral-700 rounded">
      <div className="space-y-2 mb-4">
        <input
          type="number"
          placeholder="Round Number"
          value={round.number}
          onChange={(e) =>
            handleRoundChange("number", parseInt(e.target.value) || 0)
          }
          className="w-full p-2 bg-neutral-600 rounded text-white"
        />
        <input
          type="text"
          placeholder="Name"
          value={round.name}
          onChange={(e) => handleRoundChange("name", e.target.value)}
          className="w-full p-2 bg-neutral-600 rounded text-white"
        />
      </div>
    </div>
  );
};
