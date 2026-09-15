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

  const updatePlaceName = (id: number, newName: string) => {
    setPlaces(
      places.map((place) =>
        place.id === id
          ? {...place, name: newName}
          : place
      )
    )
  };

  const updateStayMinutes = (id: number, newStayMinutes: number) => {
    setPlaces(
      places.map((place) =>
        place.id === id
          ? {...place, stayminutes: newStayMinutes}
          : place
      )
    );
  };

  const updateCost = (id: number, newCost: number) => {
  setPlaces(
    places.map((place) =>
      place.id === id
        ? { ...place, cost: newCost }
        : place
    )
  );
};

const deletePlace = (id: number) => {
  setPlaces(
    places.filter((place) => place.id !== id)
  );
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
            <input
              type="text"
              value={place.name}
              onChange={(event) =>
                updatePlaceName(place.id, event.target.value)
              }
            />
            <p>緯度: {place.lat}</p>
            <p>経度: {place.lng}</p>
            <input
              type="number"
              value={place.stayminutes}
              onChange={(event) =>
                updateStayMinutes(place.id, Number(event.target.value))
              }
            />
            <input
              type="number"
              value={place.cost}
              onChange={(event) =>
                updateCost(place.id, Number(event.target.value))
              }
            />

            <button 
              onClick={() => deletePlace(place.id)}
            > 
            削除
            </button>
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