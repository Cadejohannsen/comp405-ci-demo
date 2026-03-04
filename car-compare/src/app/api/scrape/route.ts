import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeCarListings } from "@/lib/scraper";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const listings = await scrapeCarListings(url);

    let imported = 0;
    for (const listing of listings) {
      const dealer = await prisma.dealer.upsert({
        where: { id: listing.dealerName.toLowerCase().replace(/\s+/g, "-") },
        create: {
          id: listing.dealerName.toLowerCase().replace(/\s+/g, "-"),
          name: listing.dealerName,
          location: listing.dealerLocation,
          website: url,
        },
        update: {},
      });

      const car = await prisma.car.create({
        data: {
          make: listing.make,
          model: listing.model,
          year: listing.year,
          mileage: listing.mileage,
          bodyType: listing.bodyType,
          imageUrl: listing.imageUrl,
        },
      });

      await prisma.listing.create({
        data: {
          price: listing.price,
          url: listing.url,
          carId: car.id,
          dealerId: dealer.id,
        },
      });

      imported++;
    }

    return NextResponse.json({
      message: `Scraped and imported ${imported} listings`,
      count: imported,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
