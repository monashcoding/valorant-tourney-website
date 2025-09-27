import React from "react";
import { Link } from "react-router-dom";

interface ErrorProps {
  error?: string;
  type?: "error" | "404";
}

const Error: React.FC<ErrorProps> = ({ error, type = "error" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-valorant-black via-valorant-dark to-valorant-gray flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {type === "404" ? (
          <>
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-valorant-cyan mb-4">
              Page Not Found
            </h1>
            <p className="text-valorant-light mb-6">
              This is the official website for the Valorant Tournament by Monash
              Coding Club (Sat Sep 27 - Sun Sep 28, 2025). The page you're
              looking for doesn't exist. For the official broadcast, head to
              twitch.tv/monashcoding.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-valorant-red rounded-full font-bold text-white hover:bg-red-600 transition-colors"
            >
              Go Home
            </Link>
            <a
              href="https://twitch.tv/monashcoding"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-valorant-purple rounded-full font-bold text-white hover:bg-purple-700 transition-colors ml-4"
            >
              Watch Live on Twitch
            </a>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">💥</div>
            <h1 className="text-3xl font-bold text-valorant-red mb-4">
              Something Went Wrong
            </h1>
            <p className="text-valorant-light mb-6">
              This is the official website for the Valorant Tournament by Monash
              Coding Club (Sat Sep 27 - Sun Sep 28, 2025). An unexpected error
              occurred. For the official broadcast, head to
              twitch.tv/monashcoding.
            </p>
            {error && (
              <div className="bg-valorant-gray p-4 rounded mb-6 text-sm text-valorant-orange">
                <strong>Details:</strong> {error}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-3 bg-valorant-cyan rounded-full font-bold text-valorant-dark hover:bg-cyan-400 transition-colors"
            >
              Retry
            </button>
            <a
              href="https://twitch.tv/monashcoding"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-valorant-purple rounded-full font-bold text-white hover:bg-purple-700 transition-colors ml-4"
            >
              Watch Live on Twitch
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Error;
