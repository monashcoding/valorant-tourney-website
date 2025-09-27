import React, { useState } from "react";
import { Team, Player } from "../../types";

interface TeamEditorProps {
  team: Team;
  onChange: (team: Team) => void;
  index?: number; // For qualifiedTeams array
}

export const TeamEditor: React.FC<TeamEditorProps> = ({
  team,
  onChange,
  index = 0,
}) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerIGN, setNewPlayerIGN] = useState("");
  const [newPlayerRole, setNewPlayerRole] = useState("");

  const handleTeamChange = (
    field: keyof Omit<Team, "members" | "stats">,
    value: string
  ) => {
    onChange({ ...team, [field]: value });
  };

  const addPlayer = () => {
    if (newPlayerName && newPlayerIGN) {
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: newPlayerName,
        ign: newPlayerIGN,
        role: newPlayerRole || undefined,
      };
      onChange({ ...team, members: [...team.members, newPlayer] });
      setNewPlayerName("");
      setNewPlayerIGN("");
      setNewPlayerRole("");
    }
  };

  const removePlayer = (playerId: string) => {
    onChange({
      ...team,
      members: team.members.filter((p) => p.id !== playerId),
    });
  };

  const updatePlayer = (
    playerId: string,
    field: keyof Player,
    value: string
  ) => {
    onChange({
      ...team,
      members: team.members.map((p) =>
        p.id === playerId ? { ...p, [field]: value } : p
      ),
    });
  };

  return (
    <div className="border border-yellow-400 bg-neutral-800 p-4 rounded-lg">
      <h4 className="text-lg font-bold text-white mb-2">Team {index + 1}</h4>

      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Abbreviation"
          value={team.abbreviation}
          onChange={(e) => handleTeamChange("abbreviation", e.target.value)}
          className="w-full p-2 bg-neutral-700 rounded text-white"
        />
        <input
          type="text"
          placeholder="Full Name"
          value={team.name}
          onChange={(e) => handleTeamChange("name", e.target.value)}
          className="w-full p-2 bg-neutral-700 rounded text-white"
        />
      </div>

      <h5 className="text-md font-semibold text-yellow-400 mb-2">Players</h5>
      <div className="space-y-2 mb-4">
        {team.members.map((player, pIndex) => (
          <div
            key={player.id}
            className="flex space-x-2 items-center bg-neutral-700 p-2 rounded"
          >
            <input
              type="text"
              placeholder="Name"
              value={player.name}
              onChange={(e) => updatePlayer(player.id, "name", e.target.value)}
              className="flex-1 p-1 bg-neutral-600 rounded text-white text-sm"
            />
            <input
              type="text"
              placeholder="IGN"
              value={player.ign}
              onChange={(e) => updatePlayer(player.id, "ign", e.target.value)}
              className="flex-1 p-1 bg-neutral-600 rounded text-white text-sm"
            />
            <input
              type="text"
              placeholder="Role (optional)"
              value={player.role || ""}
              onChange={(e) =>
                updatePlayer(player.id, "role", e.target.value || undefined)
              }
              className="flex-1 p-1 bg-neutral-600 rounded text-white text-sm"
            />
            <button
              onClick={() => removePlayer(player.id)}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="New Player Name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          className="flex-1 p-2 bg-neutral-700 rounded text-white"
        />
        <input
          type="text"
          placeholder="IGN"
          value={newPlayerIGN}
          onChange={(e) => setNewPlayerIGN(e.target.value)}
          className="flex-1 p-2 bg-neutral-700 rounded text-white"
        />
        <input
          type="text"
          placeholder="Role (optional)"
          value={newPlayerRole}
          onChange={(e) => setNewPlayerRole(e.target.value)}
          className="flex-1 p-2 bg-neutral-700 rounded text-white"
        />
        <button
          onClick={addPlayer}
          className="px-4 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500"
          disabled={!newPlayerName || !newPlayerIGN}
        >
          Add Player
        </button>
      </div>
    </div>
  );
};
