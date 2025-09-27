import React from "react";

function TwitchStream() {
  const parent = window.location.hostname;
  const channel = "monashcoding"; // Channel name for Twitch URL

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
            src={`https://player.twitch.tv/?channel=${channel}&parent=${parent}`}
            height="100%"
            width="100%"
            frameBorder="0"
            scrolling="no"
            allowFullScreen={true}
          />
        </div>
      </div>

      {/* Button to view full stream on Twitch */}
      <div className="text-center space-x-4">
        <a
          href={`https://www.twitch.tv/${channel}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-400 hover:bg-yellow-300 text-neutral-900 font-bold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          View on Twitch →
        </a>
        <a
          href="https://www.instagram.com/monashcoding"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-bold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Follow us on Instagram
        </a>
      </div>
    </div>
  );
}

export { TwitchStream };
