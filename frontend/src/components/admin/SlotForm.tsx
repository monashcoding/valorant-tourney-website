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
  const safeDateTimeValue = (value: string): string => {
    // Expecting ISO or empty; normalize to yyyy-MM-ddTHH:mm for datetime-local
    try {
      if (!value) return "";
      const d = new Date(value);
      if (isNaN(d.getTime())) return "";
      const pad = (n: number) => String(n).padStart(2, "0");
      const yyyy = d.getFullYear();
      const MM = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
    } catch {
      return "";
    }
  };
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
        <div>
          <label className="block text-xs text-white mb-1">Time Slot</label>
          <input
            type="datetime-local"
            placeholder="Time Slot"
            value={safeDateTimeValue(slot.timeSlot)}
            onChange={(e) => handleSlotChange("timeSlot", e.target.value)}
            className="w-full p-1 bg-neutral-500 rounded text-white text-sm"
          />
        </div>
      </div>

      {/* Matches UI is handled in the parent (AdminPanel) */}
    </div>
  );
};
