import React from "react";
import { Tournament, TournamentStatus } from "../../types";

interface TournamentFormProps {
  tournament: Tournament;
  onChange: (updates: Partial<Tournament>) => void;
  addWarning?: (msg: string) => void; // From parent
}

export const TournamentForm: React.FC<TournamentFormProps> = ({
  tournament,
  onChange,
  addWarning,
}) => {
  const safeDateValue = (date: Date | string | undefined): string => {
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d && !isNaN(d.getTime())
        ? d.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes("Date")) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        onChange({ [name]: newDate });
      } else {
        addWarning?.("Invalid date input—using current date");
        onChange({ [name]: new Date() });
      }
    } else {
      onChange({ [name]: value });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ status: e.target.value as TournamentStatus });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Tournament Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={tournament.name}
            onChange={handleInputChange}
            className="w-full p-2 bg-neutral-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Tournament Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Status
          </label>
          <select
            name="status"
            value={tournament.status}
            onChange={handleStatusChange}
            className="w-full p-2 bg-neutral-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={safeDateValue(tournament.startDate)}
            onChange={handleInputChange}
            className="w-full p-2 bg-neutral-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={safeDateValue(tournament.endDate)}
            onChange={handleInputChange}
            className="w-full p-2 bg-neutral-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Current Day
          </label>
          <input
            type="number"
            name="currentDay"
            value={tournament.currentDay || ""}
            onChange={(e) =>
              onChange({
                currentDay: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
            className="w-full p-2 bg-neutral-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            min="1"
          />
        </div>
      </div>
    </div>
  );
};
