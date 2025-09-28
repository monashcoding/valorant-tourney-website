import React from "react";
import { Tournament, Team } from "../../types";
import Matchup from "./Matchup";

interface UpcomingMatchesProps {
  tournament: Tournament;
  onTeamClick?: (team: Team) => void;
}

const UpcomingMatches: React.FC<UpcomingMatchesProps> = ({
  tournament,
  onTeamClick,
}) => {
  // Get today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter for upcoming matches (scheduled, in-progress, or completed from today)
  const upcomingMatches = tournament.days
    .flatMap((day) => {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      const isToday = dayDate.getTime() === today.getTime();

      return day.rounds.flatMap((round) =>
        round.slots.flatMap((slot) =>
          slot.matches.filter(
            (match) =>
              match.status === "scheduled" ||
              match.status === "in-progress" ||
              (match.status === "completed" && isToday)
          )
        )
      );
    })
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
    .slice(0, 6); // Show next 6 matches

  if (upcomingMatches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white text-lg">No upcoming matches scheduled</p>
        <p className="text-gray-400 text-sm mt-2">
          Check back soon for tournament updates!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="text-center mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold font-valorant text-white mb-2">
          UPCOMING MATCHES
        </h2>
        <div className="h-1 bg-yellow-400 w-48 mx-auto"></div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {upcomingMatches.map((match, index) => (
          <Matchup key={index} match={match} onTeamClick={onTeamClick} />
        ))}
        {upcomingMatches.length > 5 && (
          <div className="text-center py-4">
            <span className="text-gray-400 text-sm">
              And {upcomingMatches.length - 5} more...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingMatches;
