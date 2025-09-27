import React, { useEffect, useMemo, useState } from "react";
import { Match, MapResult, Team } from "../../types";

interface MatchupProps {
  match: Match;
  onTeamClick?: (team: Team) => void;
}

const Matchup: React.FC<MatchupProps> = ({ match, onTeamClick }) => {
  const [now, setNow] = useState<number>(Date.now());

  const isScheduled = match.status === "scheduled";

  useEffect(() => {
    if (!isScheduled) return;
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, [isScheduled]);

  const formatDateTime = (date: Date) => {
    const formatter = new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
    return formatter.format(date);
  };

  const formatCountdown = (msRemaining: number) => {
    const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const scheduledLocalTime = useMemo(
    () => formatDateTime(match.scheduledTime),
    [match.scheduledTime]
  );

  const countdownText = useMemo(() => {
    if (!isScheduled) return null;
    const msRemaining = match.scheduledTime.getTime() - now;
    return formatCountdown(msRemaining);
  }, [isScheduled, match.scheduledTime, now]);

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
      className={`px-1 py-0.5 rounded text-sm font-bold ${getStatusColor(
        match.status
      )}`}
    >
      {match.status === "in-progress" ? "LIVE" : match.status.toUpperCase()}
    </span>
  );

  // Calculate overall match score if completed
  const getMatchScore = () => {
    if (match.maps.length === 0) return null;

    const team1Wins = match.maps.filter(
      (map) => map.team1Score > map.team2Score
    ).length;
    const team2Wins = match.maps.filter(
      (map) => map.team2Score > map.team1Score
    ).length;

    return { team1Wins, team2Wins };
  };

  const matchScore = getMatchScore();

  return (
    <div className="p-1.5 sm:p-2 bg-neutral-800 rounded-lg border border-neutral-600 hover:border-neutral-500 transition-colors">
      {/* Teams section - stacked on mobile, inline on larger screens */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1">
        {/* Team 1 */}
        <button
          type="button"
          className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1 text-left focus:outline-none"
          onClick={() => onTeamClick?.(match.team1)}
        >
          <div className="px-2 py-1 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0">
            {match.team1.abbreviation}
          </div>
          <span className="text-white font-semibold text-xs sm:text-sm truncate">
            {match.team1.name}
          </span>
          {/* Show match score on mobile */}
          {matchScore && (
            <span className="text-yellow-400 font-bold text-xs sm:hidden ml-auto">
              {matchScore.team1Wins}
            </span>
          )}
        </button>

        {/* VS and Score - hidden on mobile when there's a score */}
        <div className="hidden sm:flex items-center space-x-2 shrink-0">
          {matchScore ? (
            <div className="flex items-center space-x-1 text-yellow-400 font-bold text-sm">
              <span>{matchScore.team1Wins}</span>
              <span className="text-gray-400">-</span>
              <span>{matchScore.team2Wins}</span>
            </div>
          ) : (
            <div className="text-yellow-400 font-bold text-sm">VS</div>
          )}
        </div>

        {/* Team 2 */}
        <button
          type="button"
          className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1 sm:justify-end text-right focus:outline-none"
          onClick={() => onTeamClick?.(match.team2)}
        >
          {/* Show match score on mobile */}
          {matchScore && (
            <span className="text-red-400 font-bold text-xs sm:hidden">
              {matchScore.team2Wins}
            </span>
          )}
          <span className="text-white font-semibold text-xs sm:text-sm truncate sm:order-2">
            {match.team2.name}
          </span>
          <div className="px-2 py-1 bg-red-400 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 sm:order-3">
            {match.team2.abbreviation}
          </div>
        </button>
      </div>

      {/* Compact details */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="text-gray-300 text-sm">{match.format}</span>

          {/* Map scores - compact display */}
          {match.maps.length > 0 && (
            <div className="flex space-x-0.5">
              {match.maps.map((map: MapResult, idx: number) => (
                <span
                  key={idx}
                  className="bg-gray-700 text-white px-1 py-0.5 rounded text-sm leading-none"
                  title={map.mapName}
                >
                  {map.team1Score}-{map.team2Score}
                </span>
              ))}
            </div>
          )}

          {/* Scheduled/local time */}
          <span className="text-gray-500">•</span>
          <span
            className="text-gray-300 text-sm"
            title={match.scheduledTime.toISOString()}
          >
            {scheduledLocalTime}
          </span>

          {/* Countdown for scheduled matches */}
          {isScheduled && (
            <span className="text-yellow-400 text-xs">in {countdownText}</span>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Winner indicator */}
          {match.winner && (
            <span className="font-bold text-green-400 text-sm">
              {match.winner.abbreviation} W
            </span>
          )}
          {getMatchStatusBadge()}
        </div>
      </div>
    </div>
  );
};

export default Matchup;
