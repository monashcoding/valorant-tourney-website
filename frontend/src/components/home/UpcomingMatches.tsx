import React from "react";
import { Tournament } from "../../types";

function UpcomingMatches({ tournament }: { tournament: Tournament }) {
  const upcomingMatches = tournament.days
    .flatMap((day) =>
      day.rounds.flatMap((round) =>
        round.slots.flatMap((slot) =>
          slot.matches.filter((m) => m.status === "scheduled")
        )
      )
    )
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-valorant text-white mb-2">
          UPCOMING MATCHES
        </h2>
        <div className="h-1 bg-yellow-400 w-48 mx-auto"></div>
      </div>

      <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-6 aspect-video overflow-y-auto">
        {upcomingMatches.length === 0 ? (
          <p className="text-white text-center">No upcoming matches</p>
        ) : (
          <div className="space-y-4">
            {upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white min-w-[48px]">
                    {match.team1.abbreviation}
                  </div>
                  <span className="font-bold text-white min-w-[40px] text-center">
                    VS
                  </span>
                  <div className="w-12 h-12rounded-full flex items-center justify-center font-bold text-white min-w-[48px]">
                    {match.team2.abbreviation}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 font-bold">
                    {match.format}
                  </div>
                  <div className="text-sm text-white">
                    {match.scheduledTime.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { UpcomingMatches };
