"use client";


import {useState} from "react";
import { APIProvider,
  Map,
  AdvancedMarker,
  MapMouseEvent } from "@vis.gl/react-google-maps";

type Place = {
  id : number;
  name: string;
  lat: number;
  lng: number;
  stayminutes: number;
  cost: number;
};

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [places, setPlaces] = useState<Place[]>([]);

  
 
  if (!apiKey) {
    return <p>Google Maps APIキーが設定されていません。</p>;
  }

  const handleMapClick = (event: MapMouseEvent) => {
    if(!event.detail.latLng){
      return;
    }

    const newPlace: Place = {
    id: Date.now(),
    name: "未設定",
    lat: event.detail.latLng.lat,
    lng: event.detail.latLng.lng,
    stayminutes: 60,
    cost: 0,
    };

    setPlaces([...places, newPlace]);
  };

  return (
    <main
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
      }}
    >
      {/*左側のパネル*/}
      <div
        style={{
          width: "35%",
          padding: "20px",
        }}
      >
        <h1>Trip Planner</h1>

        {places.map((place, index) =>(
          <div key={place.id}>
            <h2>{place.name}</h2>
            <p>緯度: {place.lat}</p>
            <p>経度: {place.lng}</p>
            <p>滞在時間: {place.stayminutes}分</p>
            <p>費用: {place.cost}円</p>
          </div>
        ))}
      </div>

      <div
        style={{
          width: "65%",
          height: "100%",
        }}
      >
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
            {places.map((place, index) => (
              <AdvancedMarker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
              />
            ))}

          </Map>
        </APIProvider>
      </div>
    </main>
  );
}