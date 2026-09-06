"use client";


import {useState} from "react";
import { APIProvider,
  Map,
  AdvancedMarker,
  MapMouseEvent } from "@vis.gl/react-google-maps";

type Position = {
  lat: number;
  lng: number;
};

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [position, setPosition] = useState<Position | null>(null);
 
  if (!apiKey) {
    return <p>Google Maps APIキーが設定されていません。</p>;
  }

  const handleMapClick = (event: MapMouseEvent) => {
    if(!event.detail.latLng){
      return;
    }
    setPosition({
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng
    });
  };

  return (
    <main>
      <h1>Trip Planner</h1>

      <div style={{ width: "100%", height: "600px" }}>
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={{
              lat: 35.681236,
              lng: 139.767125,
            }}
            defaultZoom={8}
            onClick={handleMapClick}
            mapId= "DEMO_MAP_ID"
          >
            {position && <AdvancedMarker position={position} />}

          </Map>
        </APIProvider>
      </div>
    </main>
  );
}