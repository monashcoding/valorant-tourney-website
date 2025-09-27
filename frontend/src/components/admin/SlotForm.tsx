import React from "react";
import { TournamentSlot } from "../../types";

interface SlotFormProps {
  slot: TournamentSlot;
  onChange: (slot: TournamentSlot) => void;
  slotIndex: number;
}

export const SlotForm: React.FC<SlotFormProps> = ({
  slot,
  onChange,
  slotIndex,
}) => {
  const handleSlotChange = (
    field: keyof Omit<TournamentSlot, "matches">,
    value: string | number
  ) => {
    onChange({ ...slot, [field]: value });
  };

  // Matches are managed by the parent component

  return (
    <div className="ml-6 p-2 bg-neutral-600 rounded">
      <div className="space-y-2 mb-4">
        <input
          type="number"
          placeholder="Slot Number"
          value={slot.number}
          onChange={(e) =>
            handleSlotChange("number", parseInt(e.target.value) || 0)
          }
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

      {/* Matches UI is handled in the parent (AdminPanel) */}
    </div>
  );
};
