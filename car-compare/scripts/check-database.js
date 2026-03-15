const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...\n');
    
    // Check cars
    const cars = await prisma.car.findMany({
      include: {
        listings: {
          include: {
            dealer: true
          }
        }
      }
    });
    
    console.log(`📊 Found ${cars.length} cars in database:\n`);
    
    cars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.year} ${car.make} ${car.model}`);
      console.log(`   🎨 Color: ${car.color || 'N/A'}`);
      console.log(`   📏 Mileage: ${car.mileage.toLocaleString()} miles`);
      console.log(`   🚗 Body Type: ${car.bodyType}`);
      console.log(`   ⚙️  Transmission: ${car.transmission || 'N/A'}`);
      console.log(`   ⛽ Fuel Type: ${car.fuelType || 'N/A'}`);
      console.log(`   🔄 Drive Type: ${car.driveType || 'N/A'}`);
      console.log(`   🖼️  Image: ${car.imageUrl ? 'Yes' : 'No'}`);
      console.log(`   📋 Listings: ${car.listings.length}`);
      
      if (car.listings.length > 0) {
        car.listings.forEach((listing, lIndex) => {
          console.log(`      ${lIndex + 1}. $${listing.price.toLocaleString()} - ${listing.dealer.name}`);
          console.log(`         📍 ${listing.dealer.location}`);
          console.log(`         🔗 ${listing.url || 'No URL'}`);
        });
      }
      console.log('');
    });
    
    // Check dealers
    const dealers = await prisma.dealer.findMany();
    console.log(`🏢 Found ${dealers.length} dealers in database:\n`);
    
    dealers.forEach((dealer, index) => {
      console.log(`${index + 1}. ${dealer.name}`);
      console.log(`   📍 ${dealer.location}`);
      console.log(`   🌐 ${dealer.website || 'No website'}`);
      console.log(`   📞 ${dealer.lat && dealer.lng ? `GPS: ${dealer.lat}, ${dealer.lng}` : 'No GPS data'}`);
      console.log(`   ✅ Active: ${dealer.isActive ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // Check listings
    const listings = await prisma.listing.findMany({
      include: {
        car: true,
        dealer: true
      }
    });
    
    console.log(`📋 Found ${listings.length} listings in database:\n`);
    
    listings.forEach((listing, index) => {
      console.log(`${index + 1}. $${listing.price.toLocaleString()}`);
      console.log(`   🚗 ${listing.car.year} ${listing.car.make} ${listing.car.model}`);
      console.log(`   🏢 ${listing.dealer.name}`);
      console.log(`   📍 ${listing.dealer.location}`);
      console.log(`   🔗 ${listing.url || 'No URL'}`);
      console.log(`   📅 Scraped: ${listing.scrapedAt.toLocaleDateString()}`);
      console.log(`   🏷️  Source: ${listing.source}`);
      console.log('');
    });
    
    console.log('✅ Database check completed!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
