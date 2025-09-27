import React from "react";
import { Match, MapResult } from "../../types";

interface MatchupProps {
  match: Match;
}

const Matchup: React.FC<MatchupProps> = ({ match }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-gray-600 text-white";
      case "in-progress":
        return "bg-yellow-400 text-black";
      case "completed":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getMatchStatusBadge = () => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
        match.status
      )}`}
    >
      {match.status.toUpperCase()}
    </span>
  );

  return (
    <div className="flex items-stretch justify-between p-4 bg-neutral-700 rounded-lg border border-neutral-600">
      {/* Teams Section */}
      <div className="flex items-center space-x-6 flex-1">
        {/* Team 1 */}
        <div className="flex flex-col items-center space-y-1">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
            {match.team1.abbreviation}
          </div>
          <span className="text-white font-semibold text-sm text-center">
            {match.team1.name}
          </span>
        </div>

        {/* VS Indicator */}
        <div className="text-yellow-400 font-bold text-lg">VS</div>

        {/* Team 2 */}
        <div className="flex flex-col items-center space-y-1">
          <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {match.team2.abbreviation}
          </div>
          <span className="text-white font-semibold text-sm text-center">
            {match.team2.name}
          </span>
        </div>
      </div>

      {/* Match Details Section */}
      <div className="flex flex-col items-end space-y-2 ml-6">
        <div className="text-sm text-gray-300">{match.format}</div>

        {match.maps.length > 0 && (
          <div className="flex space-x-1">
            {match.maps.map((map: MapResult, idx: number) => (
              <span
                key={idx}
                className="text-xs bg-gray-600 px-2 py-1 rounded font-mono"
              >
                {map.team1Score}-{map.team2Score}
              </span>
            ))}
          </div>
        )}

        {match.winner && (
          <span className="text-xs font-bold text-green-400">
            {match.winner.abbreviation} Wins
          </span>
        )}

        {getMatchStatusBadge()}
      </div>
    </div>
  );
};

export default Matchup;
