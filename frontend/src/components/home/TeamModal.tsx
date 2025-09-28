import React, { useMemo } from "react";
import { Team, Tournament, Match } from "../../types";

interface TeamModalProps {
  team: Team | null;
  tournament: Tournament;
  onClose: () => void;
}

function TeamModal({ team, tournament, onClose }: TeamModalProps) {
  if (!team) return null;

  // Gather past matches for this team
  const { pastMatches } = useMemo(() => {
    const allMatches: Match[] = tournament.days.flatMap((day) =>
      day.rounds.flatMap((round) => round.slots.flatMap((slot) => slot.matches))
    );

    const teamMatches = allMatches.filter(
      (m) => m.team1.id === team.id || m.team2.id === team.id
    );

    const past = teamMatches
      .filter((m) => m.status === "completed")
      .sort((a, b) => b.scheduledTime.getTime() - a.scheduledTime.getTime())
      .slice(0, 5);

    return { pastMatches: past };
  }, [team, tournament]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-neutral-900 border border-yellow-400 rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="px-2 py-1 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-lg text-black">
              {team.abbreviation}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{team.name}</h3>
            </div>
          </div>
          <button
            type="button"
            className="text-white hover:text-yellow-400 font-bold text-4xl p-2"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Players</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {team.members.map((player) => (
                <div
                  key={player.id}
                  className="bg-neutral-800 rounded p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="text-white font-semibold">
                      {player.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      IGN: {player.ign}
                    </div>
                  </div>
                  {player.role && (
                    <span className="text-xs px-2 py-1 rounded bg-gray-700 text-white">
                      {player.role}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">
              Recent Matches
            </h4>
            {pastMatches.length === 0 ? (
              <div className="text-gray-400 text-sm">No past matches.</div>
            ) : (
              <div className="space-y-2">
                {pastMatches.map((m) => {
                  const isTeam1 = m.team1.id === team.id;
                  const opponent = isTeam1 ? m.team2 : m.team1;
                  const wins = m.maps.filter((map) =>
                    isTeam1
                      ? map.team1Score > map.team2Score
                      : map.team2Score > map.team1Score
                  ).length;
                  const losses = m.maps.length - wins;
                  return (
                    <div
                      key={m.id}
                      className="bg-neutral-800 rounded p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="px-2 py-1 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-black">
                          {opponent.abbreviation}
                        </div>
                        <span className="text-white text-sm font-semibold truncate">
                          {opponent.name}
                        </span>
                      </div>
                      <div className="text-yellow-400 font-bold text-sm">
                        {wins}-{losses}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamModal;
