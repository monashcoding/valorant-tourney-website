import React from "react";
import { useState } from "react";
import { useTournamentData } from "../hooks/useTournamentData";
import { Bracket, Tournament } from "../types";

function BracketComponent({ bracket }: { bracket: Bracket }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          TOURNAMENT BRACKET
        </h2>
        <div className="h-1 bg-yellow-400 w-48 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-yellow-400">SEMIFINALS</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black">
                  MAC
                </div>
                <span className="font-bold text-white">VS</span>
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-white">
                  MNET
                </div>
              </div>
              <div className="text-yellow-400 font-bold">BO3</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black">
                  DEVSOC
                </div>
                <span className="font-bold text-white">VS</span>
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-white">
                  MEGA1
                </div>
              </div>
              <div className="text-yellow-400 font-bold">BO3</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-4">
            <h4 className="text-lg font-bold mb-2 text-yellow-400">
              WINNERS FINAL
            </h4>
            <div className="p-3 bg-neutral-800 rounded text-center">
              <span className="text-yellow-400">TBD</span>
            </div>
          </div>

          <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-4">
            <h4 className="text-lg font-bold mb-2 text-white">LOSERS FINAL</h4>
            <div className="p-3 bg-neutral-800 rounded text-center">
              <span className="text-yellow-400">TBD</span>
            </div>
          </div>
        </div>

        <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-yellow-400">
            GRAND FINAL
          </h3>
          <div className="p-4 bg-yellow-400 rounded-lg text-center">
            <span className="text-2xl font-bold text-black">CHAMPION</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TwitchStream() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">LIVE STREAM</h2>
        <div className="h-1 bg-yellow-400 w-48 mx-auto"></div>
      </div>

      <div className="border border-yellow-400 bg-neutral-900 rounded-lg overflow-hidden">
        <div className="aspect-video bg-neutral-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">
              TWITCH.TV/MONASHCODING
            </h3>
            <p className="text-white">Stream will start soon...</p>
            <div className="mt-4 inline-block px-6 py-2 bg-yellow-400 rounded-full font-bold animate-pulse text-black">
              LIVE
            </div>
          </div>
        </div>

        <div className="p-4 bg-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
              <span className="font-bold text-white">Monash Coding</span>
            </div>
            <div className="text-yellow-400">0 viewers</div>
          </div>
          <p className="text-sm text-white mt-2">
            Valorant Tournament 2024 - Day 2 Finals
          </p>
        </div>
      </div>

      <div className="border border-yellow-400 bg-neutral-900 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-2 text-yellow-400">CHAT</h3>
        <div className="bg-neutral-800 rounded p-3 h-32 overflow-y-auto">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-yellow-400 font-bold">User1:</span> Let's go
              MAC!
            </div>
            <div>
              <span className="text-yellow-400 font-bold">User2:</span> DEVSOC
              looking strong
            </div>
            <div>
              <span className="text-yellow-400 font-bold">User3:</span> This
              tournament is fire 🔥
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TournamentTimeline({ tournament }: { tournament: Tournament }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">TOURNAMENT INFO</h2>
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
                {team.stats?.wins ?? 0}W-{team.stats?.losses ?? 0}L
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
  const [bracket] = useState<Bracket>({
    id: "1",
    name: "Finals Bracket",
    stages: [],
    champion: undefined,
    runnerUp: undefined,
    thirdPlace: undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center text-yellow-400">
          <div className="text-4xl mb-4 animate-spin">🎮</div>
          <p className="text-xl">Loading Tournament Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
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
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <p className="text-white">No tournament data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">
            {tournament.name || "VALORANT TOURNAMENT"}
          </h1>
          <p className="text-xl text-yellow-400 mb-2">
            2024 CHAMPIONSHIP SERIES
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-white">
            <span>
              📅 {tournament.startDate?.toLocaleDateString() ?? "TBD"} -{" "}
              {tournament.endDate?.toLocaleDateString() ?? "TBD"}
            </span>
            <span>•</span>
            <span>🏟️ Monash University</span>
            <span>•</span>
            <span>🎮 {tournament.qualifiedTeams?.length ?? 0} Teams</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <BracketComponent bracket={bracket} />
          </div>

          <div className="lg:col-span-1">
            <TwitchStream />
          </div>

          <div className="lg:col-span-1">
            <TournamentTimeline tournament={tournament} />
          </div>
        </div>

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
  );
}
