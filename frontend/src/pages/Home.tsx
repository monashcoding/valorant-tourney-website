import React, { useState, useMemo } from "react";
import { useTournamentData } from "../hooks/useTournamentData";
import UpcomingMatches from "../components/home/UpcomingMatches";
import { TwitchStream } from "../components/home/TwitchStream";
import { TournamentTimeline } from "../components/home/TournamentTimeline";
import Error from "../components/error/Error";
import BackgroundCanvas from "../components/common/BackgroundCanvas";
import TeamModal from "../components/home/TeamModal";
import { Team } from "../types";

export default function Home() {
  const { data: tournament, loading, error } = useTournamentData();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Loading state - unchanged
  if (loading) {
    return (
      <div className="h-screen bg-neutral-900 flex items-center justify-center relative">
        <BackgroundCanvas />
        <div className="relative z-10 text-center text-yellow-400">
          <div className="text-4xl mb-4 animate-spin">🎮</div>
          <p className="text-xl">Loading Tournament Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <Error error={`Error loading tournament: ${error}`} />;
  }

  if (!tournament) {
    return (
      <div className="h-screen bg-neutral-900 flex items-center justify-center relative">
        <BackgroundCanvas />
        <div className="relative z-10">
          <p className="text-white">No tournament data available.</p>
        </div>
      </div>
    );
  }

  // Tournament-dependent content only (header, timeline)
  const TournamentContent = () => (
    <>
      <header className="text-center mb-12 mt-4">
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

      {/* Stable grid layout - TwitchStream won't remount */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 auto-rows-fr">
        <UpcomingMatches
          tournament={tournament}
          onTeamClick={setSelectedTeam}
        />
        <TwitchStream />
      </div>

      <TournamentTimeline
        tournament={tournament}
        onTeamClick={setSelectedTeam}
      />
    </>
  );

  return (
    <div className="h-screen bg-neutral-900 flex flex-col overflow-hidden relative">
      <BackgroundCanvas />
      <div className="relative z-10 w-full flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <TournamentContent />
          {selectedTeam && (
            <TeamModal
              team={selectedTeam}
              tournament={tournament}
              onClose={() => setSelectedTeam(null)}
            />
          )}
          <footer className="mt-16 text-center text-white">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <span className="flex items-center space-x-2">
                <span>Streamed on Twitch</span>
              </span>
              <span>•</span>
              <span>@monashcoding on Instagram, Twitch</span>
            </div>
            <p className="text-sm">
              © 2025 Monash Association of Coding. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
