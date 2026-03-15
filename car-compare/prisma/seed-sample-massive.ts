// @ts-nocheck
/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Sample massive dataset seed with 3 cars, 3 dealers, 9 listings
async function main() {
  console.log("🌱 Starting sample massive dataset seed...");
  
  try {
    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    await prisma.listing.deleteMany();
    await prisma.car.deleteMany();
    await prisma.dealer.deleteMany();
    
    // Load sample data
    console.log("📊 Loading sample data...");
    const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/sample-cars.json"), "utf8"));
    const dealersData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/sample-dealers.json"), "utf8"));
    const listingsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/sample-listings.json"), "utf8"));
    
    console.log(`📈 Loaded ${carsData.length} cars, ${dealersData.length} dealers, ${listingsData.length} listings`);
    
    // Create dealers first
    console.log("🏢 Creating dealers...");
    const createdDealers = [];
    for (const dealerData of dealersData) {
      const dealer = await prisma.dealer.create({
        data: {
          name: dealerData.name,
          location: dealerData.location,
          lat: dealerData.lat,
          lng: dealerData.lng,
          website: dealerData.website,
          isActive: true,
          lastScrapedAt: new Date(),
        },
      });
      createdDealers.push(dealer);
    }
    
    console.log(`✅ Created ${createdDealers.length} dealers`);
    
    // Create cars
    console.log("🚗 Creating cars...");
    const createdCars = [];
    for (const carData of carsData) {
      const car = await prisma.car.create({
        data: {
          make: carData.make,
          model: carData.model,
          year: carData.year,
          mileage: carData.mileage,
          bodyType: carData.bodyType,
          imageUrl: carData.imageUrl,
          color: carData.color,
          transmission: carData.transmission,
          fuelType: carData.fuelType,
          driveType: carData.driveType,
        },
      });
      createdCars.push(car);
    }
    
    console.log(`✅ Created ${createdCars.length} cars`);
    
    // Create listings (3 per car)
    console.log("📋 Creating listings...");
    const createdListings = [];
    for (let i = 0; i < listingsData.length; i++) {
      const listingData = listingsData[i];
      const carIndex = i % createdCars.length;
      const dealerIndex = i % createdDealers.length;
      
      const listing = await prisma.listing.create({
        data: {
          price: listingData.price,
          url: listingData.url,
          source: listingData.source,
          externalId: listingData.externalId,
          scrapedAt: new Date(listingData.scrapedAt),
          carId: createdCars[carIndex].id,
          dealerId: createdDealers[dealerIndex].id,
        },
      });
      createdListings.push(listing);
    }
    
    console.log(`✅ Created ${createdListings.length} listings`);
    
    // Create summary statistics
    console.log("\n📊 Sample Dataset Summary:");
    console.log(`🚗 Cars: ${createdCars.length}`);
    console.log(`🏢 Dealers: ${createdDealers.length}`);
    console.log(`📋 Listings: ${createdListings.length}`);
    console.log(`📈 Average listings per car: ${(createdListings.length / createdCars.length).toFixed(2)}`);
    
    // Brand distribution
    const brandCounts = {};
    createdCars.forEach(car => {
      brandCounts[car.make] = (brandCounts[car.make] || 0) + 1;
    });
    
    console.log("\n🏭 Brand Distribution:");
    Object.entries(brandCounts).forEach(([brand, count]) => {
      console.log(`  ${brand}: ${count}`);
    });
    
    // Price distribution
    const priceRanges = {
      "Under $15k": 0,
      "$15k-$25k": 0,
      "$25k-$40k": 0,
      "$40k-$60k": 0,
      "$60k-$100k": 0,
      "Over $100k": 0
    };
    
    createdListings.forEach(listing => {
      if (listing.price < 15000) priceRanges["Under $15k"]++;
      else if (listing.price < 25000) priceRanges["$15k-$25k"]++;
      else if (listing.price < 40000) priceRanges["$25k-$40k"]++;
      else if (listing.price < 60000) priceRanges["$40k-$60k"]++;
      else if (listing.price < 100000) priceRanges["$60k-$100k"]++;
      else priceRanges["Over $100k"]++;
    });
    
    console.log("\n💰 Price Distribution:");
    Object.entries(priceRanges).forEach(([range, count]) => {
      console.log(`  ${range}: ${count}`);
    });
    
    console.log("\n🎯 Sample massive dataset seed completed successfully!");
    console.log("🚀 This demonstrates the structure for the full 10,000+ car dataset!");
    console.log("📋 To use the full dataset, follow the instructions in MASSIVE-DATASET.md");
    
  } catch (error) {
    console.error("❌ Error during seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
