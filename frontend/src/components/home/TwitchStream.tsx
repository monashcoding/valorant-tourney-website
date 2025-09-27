import React from "react";

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
            src={`https://player.twitch.tv/?channel=grimm&parent=${parent}`}
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

export { TwitchStream };
