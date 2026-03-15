// @ts-nocheck
/* eslint-disable */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Test seed with a few cars to verify interface works
async function main() {
  console.log("🌱 Starting test seed...");

  // Create a sample dealer
  const dealer = await prisma.dealer.create({
    data: {
      name: "Test Dealership",
      location: "Test City, ST",
      website: "https://example.com",
    },
  });

  console.log(`✅ Created dealer: ${dealer.name}`);

  // Create a few test cars
  const testCars = [
    {
      make: "Toyota",
      model: "Camry",
      year: 2024,
      mileage: 15000,
      bodyType: "Sedan",
      imageUrl: null,
    },
    {
      make: "Honda",
      model: "Accord",
      year: 2024,
      mileage: 12000,
      bodyType: "Sedan",
      imageUrl: null,
    },
    {
      make: "Ford",
      model: "Mustang",
      year: 2024,
      mileage: 8000,
      bodyType: "Coupe",
      imageUrl: null,
    },
  ];

  for (const carData of testCars) {
    const car = await prisma.car.create({
      data: carData,
    });

    // Create a listing for each car
    await prisma.listing.create({
      data: {
        carId: car.id,
        dealerId: dealer.id,
        price: 25000 + Math.random() * 20000,
        url: null,
        scrapedAt: new Date(),
      },
    });

    console.log(`✅ Created car: ${car.year} ${car.make} ${car.model}`);
  }

  console.log("🎯 Test data created - interface should now work");
  console.log("📊 3 test cars with listings available");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
