"use client";


import {useState, useEffect, useRef} from "react";
import { APIProvider,
  Map,
  AdvancedMarker,
  MapMouseEvent,
  useMapsLibrary, } from "@vis.gl/react-google-maps";

type Place = {
  id : number;
  name: string;
  lat: number;
  lng: number;
  stayminutes: number;
  cost: number;
};

function PlaceSearch({
  onPlaceSelect,
}: {
  onPlaceSelect: (place: google.maps.places.Place) => void;
}) {
  const placesLibrary = useMapsLibrary("places");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!placesLibrary || !containerRef.current) {
      return;
    }

    const autocomplete =
      new placesLibrary.PlaceAutocompleteElement();

    containerRef.current.appendChild(autocomplete);

    const handleSelect = async (event: any) => {
      const place = event.placePrediction.toPlace();

      await place.fetchFields({
        fields: ["displayName", "location"],
      });

      onPlaceSelect(place);
    };

    autocomplete.addEventListener(
      "gmp-select",
      handleSelect
    );

    return () => {
      autocomplete.removeEventListener(
        "gmp-select",
        handleSelect
      );

      autocomplete.remove();
    };
  }, [placesLibrary, onPlaceSelect]);

  return <div ref={containerRef}></div>;
}

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

const movePlaceUp = (index: number) => {
  if(index === 0) {
    return;
  }

  const newPlaces = [...places];

  const temp = newPlaces[index];
  newPlaces[index] = newPlaces[index - 1];
  newPlaces[index - 1] = temp;

  setPlaces(newPlaces);
};

const movePlaceDown = (index: number) => {
  if(index === places.length -1){
    return;
  }

  const newPlaces = [...places];
  
  const temp = newPlaces[index];
  newPlaces[index] = newPlaces[index + 1];
  newPlaces[index + 1] = temp;

  setPlaces(newPlaces);
};

const addGooglePlace = (
  googlePlace: google.maps.places.Place
) => {
  if (!googlePlace.location){
    return;
  }

  const newPlace: Place = {
    id: Date.now(),
    name: googlePlace.displayName ?? "未設定",
    lat: googlePlace.location.lat(),
    lng: googlePlace.location.lng(),
    stayminutes: 60,
    cost: 0,
  };

  setPlaces([...places, newPlace]);
};

  return (
    <APIProvider apiKey={apiKey}>
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
          <PlaceSearch 
          onPlaceSelect={addGooglePlace}
        />

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

            <button
              onClick={() => movePlaceUp(index)}
            >  
            上に移動
            </button>
            <button
              onClick={() => movePlaceDown(index)}
            >  
            下に移動
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
        
      </div>
    </main>
    </APIProvider>
  );
}