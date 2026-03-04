import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseFloat(searchParams.get("radius") || "100"); // default 100 miles

    if (!lat && !lng) {
      return NextResponse.json(
        { error: "lat and lng query params are required" },
        { status: 400 }
      );
    }

    const dealers = await prisma.dealer.findMany({
      where: {
        lat: { not: null },
        lng: { not: null },
      },
      include: {
        listings: {
          include: { car: true },
          orderBy: { price: "asc" },
        },
      },
    });

    const nearbyDealers = dealers
      .map((dealer) => ({
        ...dealer,
        distance: haversineDistance(lat, lng, dealer.lat!, dealer.lng!),
      }))
      .filter((d) => d.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    // Flatten to car listings with distance info
    const nearbyCars = nearbyDealers.flatMap((dealer) =>
      dealer.listings.map((listing) => ({
        id: listing.car.id,
        make: listing.car.make,
        model: listing.car.model,
        year: listing.car.year,
        mileage: listing.car.mileage,
        bodyType: listing.car.bodyType,
        imageUrl: listing.car.imageUrl,
        price: listing.price,
        dealerName: dealer.name,
        dealerLocation: dealer.location,
        distance: Math.round(dealer.distance),
        listingId: listing.id,
      }))
    );

    // Deduplicate by car id, keeping the closest dealer's listing
    const seen = new Set<string>();
    const uniqueCars = nearbyCars.filter((car) => {
      if (seen.has(car.id)) return false;
      seen.add(car.id);
      return true;
    });

    return NextResponse.json({
      cars: uniqueCars,
      totalNearbyDealers: nearbyDealers.length,
      radius,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
