import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getModelsForMakeYear, generatePrice, generateMileage, normalizeBodyType } from "@/lib/vehicle-api";

// Popular makes to pull from NHTSA
const TARGET_MAKES = [
  "Toyota", "Honda", "Ford", "Chevrolet", "Subaru",
  "Hyundai", "Kia", "Nissan", "Mazda", "BMW",
  "Jeep", "Volkswagen", "Tesla", "Lexus", "Audi",
];

const COLORS = [
  "White", "Black", "Silver", "Gray", "Blue",
  "Red", "Green", "Brown", "Gold", "Orange",
];

const TRANSMISSIONS = ["Automatic", "CVT", "Manual", "DCT", "DSG"];
const DRIVE_TYPES = ["FWD", "AWD", "4WD", "RWD"];
const FUEL_TYPES = ["Gasoline", "Hybrid", "Electric", "Plug-In Hybrid", "Diesel"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const yearStart = body.yearStart || new Date().getFullYear();
    const yearEnd = body.yearEnd || new Date().getFullYear() - 3;
    const maxModelsPerMake = body.maxModelsPerMake || 8;

    // Get all active Oregon dealers
    const dealers = await prisma.dealer.findMany({
      where: { isActive: true },
    });

    if (dealers.length === 0) {
      return NextResponse.json({ error: "No active dealers found. Run seed first." }, { status: 400 });
    }

    let totalCars = 0;
    let totalListings = 0;
    const errors: string[] = [];

    for (const make of TARGET_MAKES) {
      for (let year = yearStart; year >= yearEnd; year--) {
        try {
          const models = await getModelsForMakeYear(make, year);

          // Limit models per make/year
          const selected = models.slice(0, maxModelsPerMake);

          for (const model of selected) {
            const bodyType = normalizeBodyType(model.Model_Name || "Sedan");
            const mileage = generateMileage(year);
            const color = randomFrom(COLORS);
            const transmission = randomFrom(TRANSMISSIONS);
            const driveType = randomFrom(DRIVE_TYPES);
            const fuelType = randomFrom(FUEL_TYPES);

            // Check if this car already exists
            const existing = await prisma.car.findFirst({
              where: {
                make: model.Make_Name,
                model: model.Model_Name,
                year: year,
              },
            });

            if (existing) continue; // Skip duplicates

            const car = await prisma.car.create({
              data: {
                make: model.Make_Name,
                model: model.Model_Name,
                year: year,
                mileage: mileage,
                bodyType: bodyType,
                color: color,
                transmission: transmission,
                fuelType: fuelType,
                driveType: driveType,
              },
            });
            totalCars++;

            // Create 1-4 listings at random dealers
            const numListings = Math.floor(Math.random() * 4) + 1;
            const shuffled = [...dealers].sort(() => Math.random() - 0.5);
            const selectedDealers = shuffled.slice(0, numListings);

            for (const dealer of selectedDealers) {
              const price = generatePrice(model.Make_Name, year, bodyType, mileage);
              await prisma.listing.create({
                data: {
                  price: price,
                  url: dealer.website || undefined,
                  source: "nhtsa-api",
                  externalId: `${model.Make_Name}-${model.Model_Name}-${year}`.replace(/\s/g, "-").toLowerCase(),
                  carId: car.id,
                  dealerId: dealer.id,
                },
              });
              totalListings++;
            }
          }
        } catch (err: any) {
          errors.push(`${make} ${year}: ${err.message}`);
        }
      }
    }

    // Update lastScrapedAt on all dealers
    await prisma.dealer.updateMany({
      where: { isActive: true },
      data: { lastScrapedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      carsAdded: totalCars,
      listingsAdded: totalListings,
      dealersUpdated: dealers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    console.error("Scrape error:", err);
    return NextResponse.json(
      { error: "Scrape failed", details: err.message },
      { status: 500 }
    );
  }
}

// GET - check scrape status
export async function GET() {
  const carCount = await prisma.car.count();
  const listingCount = await prisma.listing.count();
  const dealerCount = await prisma.dealer.count();
  const lastScraped = await prisma.dealer.findFirst({
    where: { lastScrapedAt: { not: null } },
    orderBy: { lastScrapedAt: "desc" },
    select: { lastScrapedAt: true },
  });

  return NextResponse.json({
    totalCars: carCount,
    totalListings: listingCount,
    totalDealers: dealerCount,
    lastScrapedAt: lastScraped?.lastScrapedAt || null,
  });
}
