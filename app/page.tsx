"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <p>Google Maps APIキーが設定されていません。</p>;
  }

  return (
    <main>
      <h1>Trip Planner</h1>

      <div style={{ width: "100%", height: "600px" }}>
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={{
              lat: 38.681236,
              lng: 139.767125,
            }}
            defaultZoom={8}
          />
        </APIProvider>
      </div>
    </main>
  );
}