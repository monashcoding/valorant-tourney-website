import React from "react";
import { Tournament } from "../../types";

function TournamentTimeline({ tournament }: { tournament: Tournament }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-valorant text-white mb-2">
          TOURNAMENT INFO
        </h2>
        <div className="h-1 bg-yellow-400 w-48 mx-auto"></div>
      </div>

      <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-white">QUALIFIED TEAMS</h3>
        <div className="grid grid-cols-2 gap-3">
          {(tournament.qualifiedTeams || []).map((team, index) => (
            <div
              key={team.id}
              className="bg-neutral-800 rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-lg text-black">
                  {team.abbreviation}
                </div>
                <span className="font-bold text-white">{team.name}</span>
              </div>
              <div className="text-white text-sm">
                {team.members.length} Players
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-yellow-400">SCHEDULE</h3>
        <div className="space-y-3">
          <div className="bg-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-yellow-400">
                DAY 1 - GROUP STAGE
              </span>
              <span className="text-sm text-white">COMPLETED</span>
            </div>
            <p className="text-sm text-white">
              All teams competed, Top 4 qualified
            </p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-4 border-2 border-yellow-400">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-yellow-400">DAY 2 - FINALS</span>
              <span className="text-sm text-yellow-400 animate-pulse">
                TODAY
              </span>
            </div>
            <p className="text-sm text-white">Semifinals → Finals</p>
          </div>
        </div>
      </div>

      <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-white">PRIZE POOL</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg">
            <span className="font-bold text-black">🏆 1st Place</span>
            <span className="text-xl font-bold text-black">CHAMPION</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
            <span className="font-bold text-white">🥈 2nd Place</span>
            <span className="text-lg font-bold text-white">RUNNER-UP</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
            <span className="font-bold text-white">🥉 3rd Place</span>
            <span className="text-lg text-white">THIRD PLACE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { TournamentTimeline };
