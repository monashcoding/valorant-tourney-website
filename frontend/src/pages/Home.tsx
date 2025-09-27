import React from "react";
import { useState } from "react";
import { useTournamentData } from "../hooks/useTournamentData";
import { Tournament } from "../types";

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

      <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-6 max-h-96 overflow-y-auto">
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
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black min-w-[48px]">
                    {match.team1.abbreviation}
                  </div>
                  <span className="font-bold text-white min-w-[40px] text-center">
                    VS
                  </span>
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-white min-w-[48px]">
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

function TwitchStream() {
  const parent = window.location.hostname;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-valorant text-white mb-2">
          LIVE STREAM
        </h2>
        <div className="h-1 bg-yellow-400 w-48 mx-auto"></div>
      </div>

      <div className="border border-yellow-400 bg-neutral-900 rounded-lg overflow-hidden">
        <div className="aspect-video">
          <iframe
            src={`https://player.twitch.tv/?channel=monashcoding&parent=${parent}`}
            height="100%"
            width="100%"
            frameBorder="0"
            scrolling="no"
            allowFullScreen={true}
          />
        </div>
      </div>
    </div>
  );
}

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
