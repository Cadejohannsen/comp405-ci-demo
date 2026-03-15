const https = require('https');
const fs = require('fs');
const path = require('path');

// Simple Mockaroo API call
const API_KEY = '31038e10';

// Download basic car data
async function downloadCars() {
  return new Promise((resolve, reject) => {
    // Simple API call without complex schema
    const url = `https://api.mockaroo.com/api/1000?key=${API_KEY}&name=Car&fields[]=make&fields[]=model&fields[]=year&fields[]=price&fields[]=color&fields[]=mileage`;
    
    console.log(`📥 Downloading cars from Mockaroo...`);
    console.log(`🔗 URL: ${url}`);
    
    const req = https.request(url, (res) => {
      let data = '';
      
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers: ${JSON.stringify(res.headers)}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 Response length: ${data.length}`);
        console.log(`📝 First 200 chars: ${data.substring(0, 200)}`);
        
        try {
          if (data.startsWith('<html>')) {
            console.log('❌ Got HTML response instead of JSON');
            console.log('🔍 This might mean:');
            console.log('   - API key is invalid');
            console.log('   - API endpoint is wrong');
            console.log('   - Mockaroo is down');
            console.log('   - Rate limit exceeded');
            reject(new Error('HTML response received instead of JSON'));
            return;
          }
          
          const jsonData = JSON.parse(data);
          fs.writeFileSync(path.join(__dirname, '../data/cars.json'), JSON.stringify(jsonData, null, 2));
          console.log(`✅ Downloaded ${jsonData.length} cars`);
          resolve(jsonData);
        } catch (error) {
          console.error(`❌ Error parsing JSON: ${error.message}`);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Request error: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

// Test the API
async function testAPI() {
  try {
    await downloadCars();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Try alternative approach - manual data generation
    console.log('\n🔄 Falling back to manual data generation...');
    generateManualData();
  }
}

// Generate data manually as fallback
function generateManualData() {
  console.log('🛠️ Generating manual car data...');
  
  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Infiniti', 'Acura', 'Cadillac', 'Lincoln', 'Genesis', 'Volvo', 'Tesla', 'Rivian', 'GMC', 'Buick', 'Chrysler', 'Dodge', 'Jeep', 'Ram'];
  const models = ['Camry', 'Accord', 'F-150', 'Silverado', 'Civic', 'Corolla', 'RAV4', 'CR-V', 'Explorer', 'Escape', 'Model S', 'Model 3', 'Model X', 'Model Y', 'Mustang', 'Camaro', 'Challenger', 'Corvette', '911', 'Cayenne', '3 Series', '5 Series', 'X5', 'E-Class', 'S-Class', 'A4', 'Q5', 'RX 350', 'ES 350', 'MDX', 'Tahoe', 'Suburban', 'Sierra', 'F-250', 'Ram 1500', 'Wrangler', 'Grand Cherokee', 'Pilot', 'Highlander', 'Altima', 'Sentra', 'Elantra', 'Sonata', 'Forte', 'Optima', 'CX-5', 'Outback', 'Forester', 'Tiguan', 'Golf', 'Jetta', 'Passat', 'Atlas'];
  const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Wagon', 'Minivan', 'Pickup', 'Crossover'];
  const colors = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Beige', 'Gold', 'Orange', 'Yellow', 'Purple', 'Pink', 'Charcoal', 'Pearl White', 'Midnight Black', 'Silver Metallic', 'Deep Blue', 'Forest Green', 'Fire Engine Red', 'Sunset Orange', 'Champagne', 'Platinum'];
  const transmissions = ['Automatic', 'Manual', 'CVT', 'Dual-Clutch', 'Semi-Automatic', 'Electric'];
  const driveTypes = ['FWD', 'RWD', 'AWD', '4WD'];
  const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Plug-in Hybrid', 'Electric', 'Flex Fuel'];
  
  const cars = [];
  
  for (let i = 0; i < 5000; i++) {
    const make = makes[Math.floor(Math.random() * makes.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    const year = Math.floor(Math.random() * 37) + 1990; // 1990-2026
    
    const car = {
      make: make,
      model: model,
      year: year,
      trim: ['Base', 'LE', 'SE', 'XLE', 'Limited', 'Platinum', 'Sport', 'Touring'][Math.floor(Math.random() * 8)],
      bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
      driveType: driveTypes[Math.floor(Math.random() * driveTypes.length)],
      fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      engine: ['2.0L I4', '2.5L I4', '3.5L V6', '5.0L V8', '6.2L V8', 'Electric Motor', 'Hybrid System'][Math.floor(Math.random() * 7)],
      horsepower: Math.floor(Math.random() * 900) + 100,
      torque: Math.floor(Math.random() * 900) + 100,
      mpgCity: Math.floor(Math.random() * 140) + 10,
      mpgHighway: Math.floor(Math.random() * 135) + 15,
      fuelTank: Math.floor(Math.random() * 30) + 10,
      length: Math.floor(Math.random() * 100) + 150,
      width: Math.floor(Math.random() * 40) + 60,
      height: Math.floor(Math.random() * 30) + 50,
      weight: Math.floor(Math.random() * 5000) + 2000,
      cargoSpace: Math.floor(Math.random() * 140) + 10,
      airbags: Math.floor(Math.random() * 8) + 4,
      ratingNHTSA: ['1', '2', '3', '4', '5'][Math.floor(Math.random() * 5)],
      ratingIIHS: ['Poor', 'Marginal', 'Acceptable', 'Good', 'Good+'][Math.floor(Math.random() * 5)],
      vin: generateVIN(),
      stockNumber: generateStockNumber(),
      condition: ['New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'][Math.floor(Math.random() * 7)],
      mileage: Math.floor(Math.random() * 200000),
      msrp: Math.floor(Math.random() * 495000) + 5000,
      marketValue: 0,
      dealerPrice: 0,
      imageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=800&h=600&fit=crop&auto=format`
    };
    
    // Calculate realistic pricing
    car.marketValue = car.msrp * (0.7 + Math.random() * 0.25);
    car.dealerPrice = car.marketValue * (0.95 + Math.random() * 0.15);
    
    cars.push(car);
  }
  
  // Save cars data
  fs.writeFileSync(path.join(__dirname, '../data/cars.json'), JSON.stringify(cars, null, 2));
  console.log(`✅ Generated ${cars.length} cars manually`);
  
  // Generate dealers
  generateDealers();
}

function generateVIN() {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let vin = '';
  for (let i = 0; i < 17; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)];
  }
  return vin;
}

function generateStockNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let stock = '';
  for (let i = 0; i < 8; i++) {
    stock += chars[Math.floor(Math.random() * chars.length)];
  }
  return stock;
}

function generateDealers() {
  console.log('🏢 Generating dealers...');
  
  const dealerNames = ['AutoNation', 'CarMax', 'Penske Automotive', 'Sonic Automotive', 'Group 1 Automotive', 'Lithia Motors', 'Asbury Automotive Group', 'Toyota of', 'Honda of', 'Ford of', 'Chevrolet of', 'BMW of', 'Mercedes-Benz of', 'Audi of', 'Lexus of', 'Nissan of', 'Hyundai of', 'Kia of', 'Mazda of', 'Subaru of', 'Volkswagen of', 'Cadillac of', 'Lincoln of', 'Acura of', 'Infiniti of', 'Buick of', 'GMC of', 'Jeep of', 'Ram of', 'Dodge of', 'Chrysler of', 'Porsche of', 'Ferrari of', 'Lamborghini of', 'Bentley of', 'Rolls-Royce of', 'Aston Martin of', 'Maserati of', 'McLaren of', 'Jaguar of', 'Land Rover of', 'Volvo of', 'Genesis of', 'Tesla of', 'Rivian of', 'Lucid of'];
  const cities = ['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC', 'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK', 'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Milwaukee, WI', 'Baltimore, MD', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA', 'Kansas City, MO', 'Mesa, AZ', 'Atlanta, GA', 'Omaha, NE', 'Colorado Springs, CO', 'Raleigh, NC', 'Long Beach, CA', 'Virginia Beach, VA', 'Miami, FL', 'Oakland, CA', 'Minneapolis, MN', 'Tampa, FL', 'Tulsa, OK', 'Arlington, TX', 'Wichita, KS', 'New Orleans, LA', 'Bakersfield, CA', 'Cleveland, OH', 'Aurora, CO', 'Anaheim, CA', 'Honolulu, HI', 'Santa Ana, CA', 'Riverside, CA', 'Corpus Christi, TX', 'Lexington, KY', 'Stockton, CA', 'Pittsburgh, PA', 'St. Paul, MN', 'Cincinnati, OH', 'Greensboro, NC', 'Plano, TX', 'Newark, NJ', 'Orlando, FL', 'Durham, NC', 'Chula Vista, CA', 'Laredo, TX', 'Buffalo, NY', 'Rochester, NY', 'St. Louis, MO', 'Reno, NV', 'Glendale, AZ', 'Gilbert, AZ', 'Garland, TX', 'Winston-Salem, NC', 'North Las Vegas, NV', 'Norfolk, VA', 'Chesapeake, VA', 'Lubbock, TX', 'Scottsdale, AZ', 'Irving, TX', 'Glendale, CA', 'Hialeah, FL', 'Fremont, CA', 'Irvine, CA', 'San Bernardino, CA', 'Boise, ID', 'Birmingham, AL', 'Rochester, NY', 'Spokane Valley, WA', 'Spokane, WA'];
  
  const dealers = [];
  
  for (let i = 0; i < 500; i++) {
    const name = dealerNames[Math.floor(Math.random() * dealerNames.length)];
    const location = cities[Math.floor(Math.random() * cities.length)];
    
    const dealer = {
      name: name,
      location: location,
      lat: 25 + Math.random() * 23, // 25-48 (US latitude range)
      lng: -125 + Math.random() * 60, // -125 to -65 (US longitude range)
      website: `https://www.${name.toLowerCase().replace(' ', '').replace(' ', '')}.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 10000)}`,
      email: `info@${name.toLowerCase().replace(' ', '').replace(' ', '')}.com`,
      address: `${Math.floor(Math.random() * 9000) + 100} Main St, ${location}`,
      zipCode: Math.floor(Math.random() * 90000) + 10000,
      rating: ['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'][Math.floor(Math.random() * 9)],
      reviewCount: Math.floor(Math.random() * 5000) + 10,
      hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-6PM, Sun: Closed',
      specialties: 'New Cars, Used Cars, Service, Parts',
      services: 'Sales, Service, Parts, Financing, Leasing',
      established: Math.floor(Math.random() * 35) + 1990,
      employeeCount: Math.floor(Math.random() * 200) + 5,
      inventorySize: Math.floor(Math.random() * 950) + 50,
      certifications: 'Certified Pre-Owned, ASE Certified, Manufacturer Certified',
      amenities: 'Customer Lounge, WiFi, Coffee Bar, Kids Play Area',
      paymentMethods: 'Cash, Credit Card, Debit Card, Financing, Leasing',
      socialMedia: 'Facebook, Twitter, Instagram, YouTube'
    };
    
    dealers.push(dealer);
  }
  
  fs.writeFileSync(path.join(__dirname, '../data/dealers.json'), JSON.stringify(dealers, null, 2));
  console.log(`✅ Generated ${dealers.length} dealers`);
  
  // Generate listings
  generateListings();
}

function generateListings() {
  console.log('📋 Generating listings...');
  
  // Load cars and dealers
  const cars = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));
  const dealers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dealers.json'), 'utf8'));
  
  const listings = [];
  
  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    const numListings = Math.floor(Math.random() * 3) + 1; // 1-3 listings per car
    
    for (let j = 0; j < numListings; j++) {
      const dealer = dealers[Math.floor(Math.random() * dealers.length)];
      
      const listing = {
        price: car.dealerPrice * (0.95 + Math.random() * 0.1), // ±5% around dealer price
        listingType: ['New', 'Used', 'Certified Pre-Owned'][Math.floor(Math.random() * 3)],
        listingStatus: 'Available',
        daysOnLot: Math.floor(Math.random() * 365),
        views: Math.floor(Math.random() * 10000),
        saves: Math.floor(Math.random() * 500),
        inquiries: Math.floor(Math.random() * 100),
        testDrives: Math.floor(Math.random() * 50),
        url: `https://www.dealer.com/inventory/${Math.floor(Math.random() * 1000000)}`,
        source: 'mockaroo',
        externalId: Math.floor(Math.random() * 10000000).toString(),
        scrapedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        description: 'Excellent condition, low mileage, one owner, clean title, well-maintained',
        highlights: 'Low mileage, one owner, clean title, excellent condition',
        features: 'Leather seats, sunroof, premium audio, navigation, heated seats',
        conditionDetails: 'Excellent exterior and interior, no scratches or dents, like new',
        warranty: 'Manufacturer warranty remaining, extended warranty available',
        financing: 'Financing available, competitive rates, multiple lenders',
        delivery: 'Free delivery within 50 miles, paid shipping available',
        inspections: '150-point inspection, certified pre-owned, comprehensive report',
        priceHistory: 'Price reduced, competitive pricing, market analysis available'
      };
      
      listings.push(listing);
    }
  }
  
  fs.writeFileSync(path.join(__dirname, '../data/listings.json'), JSON.stringify(listings, null, 2));
  console.log(`✅ Generated ${listings.length} listings`);
  
  console.log('\n🎉 Manual dataset generation completed!');
  console.log(`📊 Dataset Summary:`);
  console.log(`🚗 Cars: ${cars.length}`);
  console.log(`🏢 Dealers: ${dealers.length}`);
  console.log(`📋 Listings: ${listings.length}`);
  console.log(`📈 Average listings per car: ${(listings.length / cars.length).toFixed(2)}`);
  console.log('\n🚀 Ready to import: npm run seed:massive');
}

testAPI();
