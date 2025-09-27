import React from "react";
import { useState } from "react";
import { useTournamentData } from "../hooks/useTournamentData";
import { Bracket, Tournament } from "../types";

function BracketComponent({ bracket }: { bracket: Bracket }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold glow-text mb-2">
          TOURNAMENT BRACKET
        </h2>
        <div className="h-1 bg-gradient-to-r from-valorant-red via-valorant-purple to-valorant-cyan w-48 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glow-border bg-valorant-dark rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-valorant-cyan">
            SEMIFINALS
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-valorant-gray rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-valorant-red rounded-full flex items-center justify-center font-bold">
                  MAC
                </div>
                <span className="font-bold">VS</span>
                <div className="w-12 h-12 bg-valorant-purple rounded-full flex items-center justify-center font-bold">
                  MNET
                </div>
              </div>
              <div className="text-valorant-orange font-bold">BO3</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-valorant-gray rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-valorant-cyan rounded-full flex items-center justify-center font-bold">
                  DEVSOC
                </div>
                <span className="font-bold">VS</span>
                <div className="w-12 h-12 bg-valorant-orange rounded-full flex items-center justify-center font-bold">
                  MEGA1
                </div>
              </div>
              <div className="text-valorant-orange font-bold">BO3</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glow-border bg-valorant-dark rounded-lg p-4">
            <h4 className="text-lg font-bold mb-2 text-valorant-red">
              WINNERS FINAL
            </h4>
            <div className="p-3 bg-valorant-gray rounded text-center">
              <span className="text-valorant-cyan">TBD</span>
            </div>
          </div>

          <div className="glow-border bg-valorant-dark rounded-lg p-4">
            <h4 className="text-lg font-bold mb-2 text-valorant-purple">
              LOSERS FINAL
            </h4>
            <div className="p-3 bg-valorant-gray rounded text-center">
              <span className="text-valorant-cyan">TBD</span>
            </div>
          </div>
        </div>

        <div className="glow-border bg-valorant-dark rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-valorant-orange">
            GRAND FINAL
          </h3>
          <div className="p-4 bg-gradient-to-r from-valorant-red to-valorant-purple rounded-lg text-center">
            <span className="text-2xl font-bold glow-text">CHAMPION</span>
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
        <h2 className="text-2xl font-bold glow-text mb-2">LIVE STREAM</h2>
        <div className="h-1 bg-gradient-to-r from-valorant-purple via-valorant-cyan to-valorant-red w-48 mx-auto"></div>
      </div>

      <div className="glow-border bg-valorant-dark rounded-lg overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-valorant-gray to-valorant-dark flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-valorant-cyan mb-2">
              TWITCH.TV/MONASHCODING
            </h3>
            <p className="text-valorant-light">Stream will start soon...</p>
            <div className="mt-4 inline-block px-6 py-2 bg-valorant-red rounded-full font-bold animate-pulse">
              LIVE
            </div>
          </div>
        </div>

        <div className="p-4 bg-valorant-gray">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-valorant-red rounded-full"></div>
              <span className="font-bold">Monash Coding</span>
            </div>
            <div className="text-valorant-cyan">0 viewers</div>
          </div>
          <p className="text-sm text-valorant-light mt-2">
            Valorant Tournament 2024 - Day 2 Finals
          </p>
        </div>
      </div>

      <div className="glow-border bg-valorant-dark rounded-lg p-4">
        <h3 className="text-lg font-bold mb-2 text-valorant-cyan">CHAT</h3>
        <div className="bg-valorant-gray rounded p-3 h-32 overflow-y-auto">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-valorant-orange font-bold">User1:</span>{" "}
              Let's go MAC!
            </div>
            <div>
              <span className="text-valorant-purple font-bold">User2:</span>{" "}
              DEVSOC looking strong
            </div>
            <div>
              <span className="text-valorant-cyan font-bold">User3:</span> This
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
        <h2 className="text-2xl font-bold glow-text mb-2">TOURNAMENT INFO</h2>
        <div className="h-1 bg-gradient-to-r from-valorant-cyan via-valorant-orange to-valorant-red w-48 mx-auto"></div>
      </div>

      <div className="glow-border bg-valorant-dark rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-valorant-red">
          QUALIFIED TEAMS
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(tournament.qualifiedTeams || []).map((team, index) => (
            <div
              key={team.id}
              className="bg-valorant-gray rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{
                    backgroundColor:
                      index === 0
                        ? "#FF4654"
                        : index === 1
                        ? "#B820FF"
                        : index === 2
                        ? "#0CECDD"
                        : "#FF9B40",
                  }}
                >
                  {team.abbreviation}
                </div>
                <span className="font-bold">{team.name}</span>
              </div>
              <div className="text-valorant-light text-sm">
                {team.stats?.wins ?? 0}W-{team.stats?.losses ?? 0}L
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glow-border bg-valorant-dark rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-valorant-cyan">SCHEDULE</h3>
        <div className="space-y-3">
          <div className="bg-valorant-gray rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-valorant-orange">
                DAY 1 - GROUP STAGE
              </span>
              <span className="text-sm text-valorant-light">COMPLETED</span>
            </div>
            <p className="text-sm text-valorant-light">
              All teams competed, Top 4 qualified
            </p>
          </div>

          <div className="bg-valorant-gray rounded-lg p-4 border-2 border-valorant-red">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-valorant-red">
                DAY 2 - FINALS
              </span>
              <span className="text-sm text-valorant-cyan animate-pulse">
                TODAY
              </span>
            </div>
            <p className="text-sm text-valorant-light">Semifinals → Finals</p>
          </div>
        </div>
      </div>

      <div className="glow-border bg-valorant-dark rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-valorant-purple">
          PRIZE POOL
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-valorant-red to-valorant-orange rounded-lg">
            <span className="font-bold">🏆 1st Place</span>
            <span className="text-xl font-bold">CHAMPION</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-valorant-purple to-valorant-cyan rounded-lg">
            <span className="font-bold">🥈 2nd Place</span>
            <span className="text-lg font-bold">RUNNER-UP</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-valorant-gray rounded-lg">
            <span className="font-bold">🥉 3rd Place</span>
            <span className="text-lg">THIRD PLACE</span>
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
      <div className="min-h-screen bg-gradient-to-br from-valorant-black via-valorant-dark to-valorant-gray flex items-center justify-center">
        <div className="text-center text-valorant-cyan">
          <div className="text-4xl mb-4 animate-spin">🎮</div>
          <p className="text-xl">Loading Tournament Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-valorant-black via-valorant-dark to-valorant-gray flex items-center justify-center">
        <div className="text-center text-valorant-red">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-xl">Error loading tournament: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-valorant-red rounded-full font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-valorant-black via-valorant-dark to-valorant-gray flex items-center justify-center">
        <p className="text-valorant-light">No tournament data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-valorant-black via-valorant-dark to-valorant-gray">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 glow-text">
            {tournament.name || "VALORANT TOURNAMENT"}
          </h1>
          <p className="text-xl text-valorant-cyan mb-2">
            2024 CHAMPIONSHIP SERIES
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-valorant-light">
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

        <footer className="mt-16 text-center text-valorant-light">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <span className="flex items-center space-x-2">
              <span className="text-valorant-red">🔴</span>
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
