"use client";

import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import CarCard from "./CarCard";

interface NearbyCar {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  bodyType: string;
  imageUrl?: string | null;
  price: number;
  dealerName: string;
  dealerLocation: string;
  distance: number;
}

interface NearbyResponse {
  cars: NearbyCar[];
  totalNearbyDealers: number;
  radius: number;
}

export default function NearbyCars() {
  const [cars, setCars] = useState<NearbyCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState("your area");
  const [radius, setRadius] = useState(100);
  const [dealerCount, setDealerCount] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode for display name
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoRes.json();
          const city =
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.county ||
            "your area";
          const state = geoData.address?.state || "";
          setLocationName(state ? `${city}, ${state}` : city);
        } catch {
          // Keep default "your area"
        }

        // Fetch nearby cars
        try {
          const res = await fetch(
            `/api/cars/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
          );
          const data: NearbyResponse = await res.json();
          setCars(data.cars);
          setDealerCount(data.totalNearbyDealers);
        } catch {
          setError("Failed to load nearby cars");
        }

        setLoading(false);
      },
      () => {
        setError("Location access denied. Enable location to see nearby cars.");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [radius]);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center gap-3 py-20">
          <Loader2 size={24} className="animate-spin" />
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Finding cars near you...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center py-12 border-2 border-dashed border-black/10">
          <MapPin size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-heading text-4xl font-bold uppercase tracking-tight mb-4">
          <MapPin size={28} className="inline mr-2" />
          Cars Near {locationName}
        </h2>
        <div className="text-center py-12 border-2 border-dashed border-black/10">
          <p className="font-heading text-xl font-bold uppercase mb-2">
            No cars found nearby
          </p>
          <p className="text-sm text-muted-foreground">
            Try increasing the search radius
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={20} className="text-accent" />
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              {dealerCount} dealers within {radius} miles
            </p>
          </div>
          <h2 className="font-heading text-4xl font-bold uppercase tracking-tight">
            Cars Near {locationName}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Radius
          </label>
          {[50, 100, 250, 500].map((r) => (
            <button
              key={r}
              onClick={() => {
                setLoading(true);
                setRadius(r);
              }}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-wider border-2 transition-colors ${
                radius === r
                  ? "bg-black text-white border-black"
                  : "border-black/20 hover:border-black"
              }`}
            >
              {r} mi
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.slice(0, 6).map((car) => (
          <div key={car.id} className="relative">
            <div className="absolute top-3 left-3 z-10 bg-white border-2 border-black px-3 py-1 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
              <MapPin size={12} />
              {car.distance} mi away
            </div>
            <CarCard
              id={car.id}
              make={car.make}
              model={car.model}
              year={car.year}
              mileage={car.mileage}
              bodyType={car.bodyType}
              imageUrl={car.imageUrl}
              lowestPrice={car.price}
              listingCount={1}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
