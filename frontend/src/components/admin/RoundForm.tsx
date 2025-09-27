import React, { useState } from "react";
import { TournamentRound, TournamentSlot } from "../../types";
import { SlotForm } from "./SlotForm";

interface RoundFormProps {
  round: TournamentRound;
  onChange: (round: TournamentRound) => void;
  roundIndex: number;
  teams: any[];
}

export const RoundForm: React.FC<RoundFormProps> = ({
  round,
  onChange,
  roundIndex,
  teams,
}) => {
  const [newSlotTime, setNewSlotTime] = useState("");

  const handleRoundChange = (
    field: keyof Omit<TournamentRound, "slots">,
    value: string
  ) => {
    onChange({ ...round, [field]: value });
  };

  const addSlot = () => {
    if (newSlotTime) {
      const newSlot: TournamentSlot = {
        id: `slot-${Date.now()}`,
        number: round.slots.length + 1,
        timeSlot: newSlotTime,
        matches: [],
      };
      onChange({ ...round, slots: [...round.slots, newSlot] });
      setNewSlotTime("");
    }
  };

  const updateSlot = (slotIndex: number, updatedSlot: TournamentSlot) => {
    const newSlots = [...round.slots];
    newSlots[slotIndex] = updatedSlot;
    onChange({ ...round, slots: newSlots });
  };

  const removeSlot = (slotIndex: number) => {
    const newSlots = round.slots.filter((_, index) => index !== slotIndex);
    onChange({ ...round, slots: newSlots });
  };

  return (
    <div className="ml-4 p-3 bg-neutral-700 rounded">
      <div className="space-y-2 mb-4">
        <input
          type="number"
          placeholder="Round Number"
          value={round.number}
          onChange={(e) => handleRoundChange("number", e.target.value)}
          className="w-full p-2 bg-neutral-600 rounded text-white"
        />
        <input
          type="text"
          placeholder="Name"
          value={round.name}
          onChange={(e) => handleRoundChange("name", e.target.value)}
          className="w-full p-2 bg-neutral-600 rounded text-white"
        />
        <textarea
          placeholder="Description"
          value={round.description}
          onChange={(e) => handleRoundChange("description", e.target.value)}
          className="w-full p-2 bg-neutral-600 rounded text-white"
          rows={2}
        />
        <input
          type="text"
          placeholder="Time Slot"
          value={round.timeSlot}
          onChange={(e) => handleRoundChange("timeSlot", e.target.value)}
          className="w-full p-2 bg-neutral-600 rounded text-white"
        />
      </div>

      <h6 className="text-md font-semibold text-yellow-400 mb-2">Slots</h6>
      <div className="space-y-3 mb-4">
        {round.slots.map((slot, sIndex) => (
          <div key={slot.id} className="border border-neutral-600 p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white font-medium">Slot {sIndex + 1}</span>
              <button
                onClick={() => removeSlot(sIndex)}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Remove Slot
              </button>
            </div>
            <SlotForm
              slot={slot}
              onChange={(updatedSlot) => updateSlot(sIndex, updatedSlot)}
              slotIndex={sIndex}
              teams={teams}
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="New Slot Time (e.g., 10:00 AM)"
          value={newSlotTime}
          onChange={(e) => setNewSlotTime(e.target.value)}
          className="flex-1 p-2 bg-neutral-600 rounded text-white"
        />
        <button
          onClick={addSlot}
          className="px-4 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500"
          disabled={!newSlotTime}
        >
          Add Slot
        </button>
      </div>
    </div>
  );
};
