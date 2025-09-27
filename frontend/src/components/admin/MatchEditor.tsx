import React from "react";
import { Match, Team, MapResult } from "../../types";

interface MatchEditorProps {
  match: Match;
  teams: Team[]; // Available teams to select from
  onChange: (match: Match) => void;
  addWarning?: (msg: string) => void; // From parent if passed
}

export const MatchEditor: React.FC<MatchEditorProps> = ({
  match,
  teams,
  onChange,
  addWarning,
}) => {
  const safeDateValue = (date: Date | string | undefined): string => {
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d && !isNaN(d.getTime())
        ? d.toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16);
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  };

  const handleChange = (field: keyof Match, value: any) => {
    if (field === "scheduledTime" && value) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        onChange({ ...match, [field]: newDate });
      } else {
        addWarning?.("Invalid scheduled time—using now");
        onChange({ ...match, [field]: new Date() });
      }
    } else {
      onChange({ ...match, [field]: value });
    }
  };

  const updateMap = (mapIndex: number, field: keyof MapResult, value: any) => {
    const newMaps = [...match.maps];
    newMaps[mapIndex] = { ...newMaps[mapIndex], [field]: value };
    onChange({ ...match, maps: newMaps });
  };

  const addMap = () => {
    const newMap: MapResult = {
      mapName: "",
      team1Score: 0,
      team2Score: 0,
    };
    onChange({ ...match, maps: [...match.maps, newMap] });
  };

  const removeMap = (mapIndex: number) => {
    const newMaps = match.maps.filter((_, index) => index !== mapIndex);
    onChange({ ...match, maps: newMaps });
  };

  const setTeam1 = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) handleChange("team1", team);
  };

  const setTeam2 = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) handleChange("team2", team);
  };

  const setWinner = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) handleChange("winner", team);
  };

  return (
    <div className="border border-yellow-400 bg-neutral-800 p-4 rounded-lg mb-4">
      <h4 className="text-lg font-bold text-white mb-2">Match</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Team 1
          </label>
          <select
            value={match.team1.id}
            onChange={(e) => setTeam1(e.target.value)}
            className="w-full p-2 bg-neutral-700 rounded text-white"
          >
            <option value="">Select Team 1</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.abbreviation}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Team 2
          </label>
          <select
            value={match.team2.id}
            onChange={(e) => setTeam2(e.target.value)}
            className="w-full p-2 bg-neutral-700 rounded text-white"
          >
            <option value="">Select Team 2</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.abbreviation}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Format
          </label>
          <select
            value={match.format}
            onChange={(e) => handleChange("format", e.target.value)}
            className="w-full p-2 bg-neutral-700 rounded text-white"
          >
            <option value="BO1">BO1</option>
            <option value="BO3">BO3</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Scheduled Time
          </label>
          <input
            type="datetime-local"
            value={safeDateValue(match.scheduledTime)}
            onChange={(e) => handleChange("scheduledTime", e.target.value)}
            className="w-full p-2 bg-neutral-700 rounded text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Status
          </label>
          <select
            value={match.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full p-2 bg-neutral-700 rounded text-white"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-1">
          Winner
        </label>
        <select
          value={match.winner?.id || ""}
          onChange={(e) => setWinner(e.target.value)}
          className="w-full p-2 bg-neutral-700 rounded text-white"
        >
          <option value="">No Winner</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.abbreviation}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h5 className="text-md font-semibold text-yellow-400 mb-2">Maps</h5>
        {match.maps.map((map, index) => (
          <div
            key={index}
            className="flex space-x-2 items-center bg-neutral-700 p-2 rounded mb-2"
          >
            <input
              type="text"
              placeholder="Map Name"
              value={map.mapName}
              onChange={(e) => updateMap(index, "mapName", e.target.value)}
              className="flex-1 p-1 bg-neutral-600 rounded text-white text-sm"
            />
            <input
              type="number"
              placeholder="Team 1 Score"
              value={map.team1Score}
              onChange={(e) =>
                updateMap(index, "team1Score", parseInt(e.target.value) || 0)
              }
              className="w-20 p-1 bg-neutral-600 rounded text-white text-sm"
            />
            <input
              type="number"
              placeholder="Team 2 Score"
              value={map.team2Score}
              onChange={(e) =>
                updateMap(index, "team2Score", parseInt(e.target.value) || 0)
              }
              className="w-20 p-1 bg-neutral-600 rounded text-white text-sm"
            />
            <button
              onClick={() => removeMap(index)}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addMap}
          className="px-4 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500 mt-2"
        >
          Add Map
        </button>
      </div>
    </div>
  );
};
