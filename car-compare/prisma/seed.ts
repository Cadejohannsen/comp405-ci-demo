// @ts-nocheck
/* eslint-disable */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Minimal seed - only basic structure, no car data
// This allows API data to be the only source of vehicle information

async function main() {
  console.log("🌱 Starting minimal seed (API-only mode)...");

  // Create a sample dealer for testing API integration
  const sampleDealer = await prisma.dealer.create({
    data: {
      name: "API Test Dealership",
      location: "Test City, ST",
      website: "https://example.com",
    },
  });

  console.log(`✅ Created sample dealer: ${sampleDealer.name}`);
  console.log("🎯 Database ready for API data only");
  console.log("📊 No seeded car data - API will be the sole data source");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
