import React from "react";
import { Tournament, Team } from "../../types";
import Matchup from "./Matchup";

function TournamentTimeline({
  tournament,
  onTeamClick,
}: {
  tournament: Tournament;
  onTeamClick?: (team: Team) => void;
}) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-valorant text-white mb-2">
          TOURNAMENT TIMELINE
        </h2>
        <div className="h-1 bg-yellow-400 w-48 mx-auto"></div>
      </div>

      {/* Qualified Teams */}
      <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-white">
          TEAMS ({tournament.qualifiedTeams.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tournament.qualifiedTeams.map((team) => (
            <button
              key={team.id}
              type="button"
              onClick={() => onTeamClick?.(team)}
              className="bg-neutral-800 rounded-lg p-3 flex items-center justify-between hover:bg-neutral-700 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="px-2 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-sm text-black">
                  {team.abbreviation}
                </div>
                <div>
                  <span className="font-bold text-white block">
                    {team.name}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tournament Schedule */}
      <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6 text-yellow-400">SCHEDULE</h3>
        <div className="space-y-6">
          {tournament.days.map((day) => (
            <div key={day.id} className="border-l-4 border-yellow-400 pl-4">
              <h4 className="text-lg font-bold text-white mb-3">
                Day {day.dayNumber} - {formatDate(day.date)}
              </h4>
              <div className="space-y-4">
                {day.rounds.map((round) => (
                  <div key={round.id} className="bg-neutral-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-yellow-400">
                        Round {round.number}: {round.name}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {round.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="border-b border-neutral-700 pb-3 last:border-b-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-white">
                              Slot {slot.number}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {slot.matches.map((match) => (
                              <Matchup
                                key={match.id}
                                match={match}
                                onTeamClick={onTeamClick}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Status */}
      <div className="text-center pt-4 border-t border-neutral-700">
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            tournament.status === "ongoing"
              ? "bg-yellow-400 text-black"
              : tournament.status === "completed"
              ? "bg-green-600 text-white"
              : "bg-gray-600 text-white"
          }`}
        >
          Tournament Status: {tournament.status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export { TournamentTimeline };
