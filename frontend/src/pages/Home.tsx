import React from "react";
import { useTournamentData } from "../hooks/useTournamentData";
import { Tournament } from "../types";
import { UpcomingMatches } from "../components/home/UpcomingMatches";
import { TwitchStream } from "../components/home/TwitchStream";
import { TournamentTimeline } from "../components/home/TournamentTimeline";

export default function Home() {
  const { data: tournament, loading, error } = useTournamentData();

  if (loading) {
    return (
      <div className="h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center text-yellow-400">
          <div className="text-4xl mb-4 animate-spin">🎮</div>
          <p className="text-xl">Loading Tournament Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center text-yellow-400">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-xl">Error loading tournament: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-yellow-400 rounded-full font-bold text-black hover:bg-yellow-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="h-screen bg-neutral-900 flex items-center justify-center">
        <p className="text-white">No tournament data available.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-900 flex flex-col overflow-hidden">
      <div className="w-full flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold font-valorant text-white mb-0">
              {tournament.name || "VALORANT TOURNAMENT"}
            </h1>
            <p className="text-xl text-yellow-400 mb-2">2025 CLASH OF CLUBS</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-white">
              <span>
                📅 {tournament.startDate?.toLocaleDateString() ?? "TBD"} -{" "}
                {tournament.endDate?.toLocaleDateString() ?? "TBD"}
              </span>
              <span>•</span>
              <span>Online</span>
              <span>•</span>
              <span>
                🎮 {tournament.qualifiedTeams?.length ?? 0} University Teams
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <UpcomingMatches tournament={tournament} />
            <TwitchStream />
          </div>

          <TournamentTimeline tournament={tournament} />

          <footer className="mt-16 text-center text-white">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <span className="flex items-center space-x-2">
                <span className="text-yellow-400">🔴</span>
                <span>Live on Twitch</span>
              </span>
              <span>•</span>
              <span>Follow @MonashCoding</span>
              <span>•</span>
              <span>#ValorantTournament</span>
            </div>
            <p className="text-sm">
              © 2024 Monash Coding Club. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
