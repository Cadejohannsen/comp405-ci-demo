const https = require('https');
const fs = require('fs');
const path = require('path');

// Mockaroo API endpoint
const MOCKAROO_API = 'https://api.mockaroo.com/api';
const API_KEY = '31038e10';

// Car data schema for Mockaroo
const CAR_SCHEMA = [
  { name: 'make', type: 'Custom List', options: ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Infiniti', 'Acura', 'Cadillac', 'Lincoln', 'Genesis', 'Volvo', 'Ferrari', 'Lamborghini', 'Porsche', 'Bentley', 'Rolls-Royce', 'Aston Martin', 'Maserati', 'McLaren', 'Tesla', 'Rivian', 'Lucid', 'GMC', 'Buick', 'Chrysler', 'Dodge', 'Jeep', 'Ram', 'Jaguar', 'Land Rover', 'Mini', 'Smart', 'Mitsubishi', 'Suzuki', 'FIAT', 'Alfa Romeo', 'Bugatti'] },
  { name: 'model', type: 'Custom List', options: ['Camry', 'Accord', 'F-150', 'Silverado', 'Civic', 'Corolla', 'RAV4', 'CR-V', 'Explorer', 'Escape', 'Model S', 'Model 3', 'Model X', 'Model Y', 'Mustang', 'Camaro', 'Challenger', 'Corvette', '911', 'Cayenne', '3 Series', '5 Series', 'X5', 'E-Class', 'S-Class', 'A4', 'Q5', 'RX 350', 'ES 350', 'MDX', 'Tahoe', 'Suburban', 'Sierra', 'F-250', 'Ram 1500', 'Wrangler', 'Grand Cherokee', 'Pilot', 'Highlander', 'Altima', 'Sentra', 'Elantra', 'Sonata', 'Forte', 'Optima', 'CX-5', 'Outback', 'Forester', 'Tiguan', 'Golf', 'Jetta', 'Passat', 'Atlas', 'Accord', 'Crosstrek', 'Ascent', 'Palisade', 'Telluride', 'Sorento'] },
  { name: 'year', type: 'Number', min: 1990, max: 2026 },
  { name: 'trim', type: 'Custom List', options: ['Base', 'LE', 'SE', 'XLE', 'Limited', 'Platinum', 'Sport', 'Touring', 'Grand Touring', 'Signature', 'LX', 'EX', 'EX-L', 'Touring', 'Elite', 'Sport', 'Hybrid', 'Plug-in Hybrid', 'Performance', 'Track', 'S', '4S', 'Turbo', 'GT', 'GT3', 'GT4', 'Spyder', 'Cabriolet', 'Convertible', 'Roadster'] },
  { name: 'bodyType', type: 'Custom List', options: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Wagon', 'Minivan', 'Pickup', 'Crossover'] },
  { name: 'color', type: 'Custom List', options: ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Beige', 'Gold', 'Orange', 'Yellow', 'Purple', 'Pink', 'Charcoal', 'Pearl White', 'Midnight Black', 'Silver Metallic', 'Deep Blue', 'Forest Green', 'Fire Engine Red', 'Sunset Orange', 'Champagne', 'Platinum'] },
  { name: 'transmission', type: 'Custom List', options: ['Automatic', 'Manual', 'CVT', 'Dual-Clutch', 'Semi-Automatic', 'Electric'] },
  { name: 'driveType', type: 'Custom List', options: ['FWD', 'RWD', 'AWD', '4WD'] },
  { name: 'fuelType', type: 'Custom List', options: ['Gasoline', 'Diesel', 'Hybrid', 'Plug-in Hybrid', 'Electric', 'Flex Fuel'] },
  { name: 'engine', type: 'Custom List', options: ['2.0L I4', '2.5L I4', '3.5L V6', '5.0L V8', '6.2L V8', '6.7L V8', 'Electric Motor', 'Hybrid System', '1.5L Turbo I3', '2.0L Turbo I4', '2.7L Turbo V6', '3.0L Twin-Turbo I6', '4.0L Twin-Turbo V8', '6.6L V8 Diesel'] },
  { name: 'horsepower', type: 'Number', min: 100, max: 1000 },
  { name: 'torque', type: 'Number', min: 100, max: 1000 },
  { name: 'mpgCity', type: 'Number', min: 10, max: 150 },
  { name: 'mpgHighway', type: 'Number', min: 15, max: 150 },
  { name: 'fuelTank', type: 'Number', min: 10, max: 40 },
  { name: 'length', type: 'Number', min: 150, max: 250 },
  { name: 'width', type: 'Number', min: 60, max: 100 },
  { name: 'height', type: 'Number', min: 50, max: 80 },
  { name: 'weight', type: 'Number', min: 2000, max: 7000 },
  { name: 'cargoSpace', type: 'Number', min: 10, max: 150 },
  { name: 'airbags', type: 'Number', min: 4, max: 12 },
  { name: 'ratingNHTSA', type: 'Custom List', options: ['1', '2', '3', '4', '5'] },
  { name: 'ratingIIHS', type: 'Custom List', options: ['Poor', 'Marginal', 'Acceptable', 'Good', 'Good+'] },
  { name: 'vin', type: 'Custom Formula', formula: 'random.choice([\'1\',\'2\',\'3\',\'4\',\'5\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\'])' },
  { name: 'stockNumber', type: 'Custom Formula', formula: 'random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\']) + random.choice([\'A\',\'B\',\'C\',\'D\',\'E\',\'F\',\'G\',\'H\',\'J\',\'K\',\'L\',\'M\',\'N\',\'P\',\'R\',\'S\',\'T\',\'U\',\'V\',\'W\',\'X\',\'Y\',\'Z\'])' },
  { name: 'condition', type: 'Custom List', options: ['New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'] },
  { name: 'mileage', type: 'Number', min: 0, max: 200000 },
  { name: 'msrp', type: 'Number', min: 5000, max: 500000 },
  { name: 'marketValue', type: 'Custom Formula', formula: 'msrp * random.uniform(0.70, 0.95)' },
  { name: 'dealerPrice', type: 'Custom Formula', formula: 'marketValue * random.uniform(0.95, 1.10)' },
  { name: 'imageUrl', type: 'Custom Formula', formula: '\'https://images.unsplash.com/photo-\' + str(random.randint(1, 1000)) + \'?w=800&h=600&fit=crop&auto=format\'' }
];

// Dealer data schema
const DEALER_SCHEMA = [
  { name: 'name', type: 'Custom List', options: ['AutoNation', 'CarMax', 'Penske Automotive', 'Sonic Automotive', 'Group 1 Automotive', 'Lithia Motors', 'Asbury Automotive Group', 'Penske Automotive Group', 'Sonic Automotive', 'Toyota of', 'Honda of', 'Ford of', 'Chevrolet of', 'BMW of', 'Mercedes-Benz of', 'Audi of', 'Lexus of', 'Nissan of', 'Hyundai of', 'Kia of', 'Mazda of', 'Subaru of', 'Volkswagen of', 'Cadillac of', 'Lincoln of', 'Acura of', 'Infiniti of', 'Buick of', 'GMC of', 'Jeep of', 'Ram of', 'Dodge of', 'Chrysler of', 'Porsche of', 'Ferrari of', 'Lamborghini of', 'Bentley of', 'Rolls-Royce of', 'Aston Martin of', 'Maserati of', 'McLaren of', 'Jaguar of', 'Land Rover of', 'Volvo of', 'Genesis of', 'Tesla of', 'Rivian of', 'Lucid of', 'Ferrari Beverly Hills', 'Porsche Beverly Hills', 'BMW of Beverly Hills', 'Mercedes-Benz of Beverly Hills', 'Lexus of Beverly Hills', 'Toyota Beverly Hills', 'Honda Beverly Hills', 'Ford Beverly Hills', 'Chevrolet Beverly Hills', 'Nissan Beverly Hills', 'Hyundai Beverly Hills'] },
  { name: 'location', type: 'Custom List', options: ['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC', 'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK', 'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Milwaukee, WI', 'Baltimore, MD', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA', 'Kansas City, MO', 'Mesa, AZ', 'Atlanta, GA', 'Omaha, NE', 'Colorado Springs, CO', 'Raleigh, NC', 'Long Beach, CA', 'Virginia Beach, VA', 'Miami, FL', 'Oakland, CA', 'Minneapolis, MN', 'Tampa, FL', 'Tulsa, OK', 'Arlington, TX', 'Wichita, KS', 'New Orleans, LA', 'Bakersfield, CA', 'Cleveland, OH', 'Aurora, CO', 'Anaheim, CA', 'Honolulu, HI', 'Santa Ana, CA', 'Riverside, CA', 'Corpus Christi, TX', 'Lexington, KY', 'Stockton, CA', 'Pittsburgh, PA', 'St. Paul, MN', 'Cincinnati, OH', 'Greensboro, NC', 'Plano, TX', 'Newark, NJ', 'Orlando, FL', 'Durham, NC', 'Chula Vista, CA', 'Laredo, TX', 'Buffalo, NY', 'Rochester, NY', 'St. Louis, MO', 'Reno, NV', 'Glendale, AZ', 'Gilbert, AZ', 'Garland, TX', 'Winston-Salem, NC', 'North Las Vegas, NV', 'Norfolk, VA', 'Chesapeake, VA', 'Lubbock, TX', 'Scottsdale, AZ', 'Irving, TX', 'Glendale, CA', 'Hialeah, FL', 'Fremont, CA', 'Irvine, CA', 'San Bernardino, CA', 'Boise, ID', 'Birmingham, AL', 'Rochester, NY', 'Spokane Valley, WA', 'Spokane, WA'] },
  { name: 'lat', type: 'Number', min: 25, max: 48 },
  { name: 'lng', type: 'Number', min: -125, max: -65 },
  { name: 'website', type: 'Custom Formula', formula: '\'https://www.\' + name.toLowerCase().replace(\' \', \'\').replace(\' \', \'\') + \'.com\'' },
  { name: 'rating', type: 'Custom List', options: ['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'] },
  { name: 'reviewCount', type: 'Number', min: 10, max: 5000 }
];

// Download data from Mockaroo with schema
async function downloadMockarooData(schema, filename, numRows) {
  return new Promise((resolve, reject) => {
    const schemaData = JSON.stringify(schema);
    const url = `${MOCKAROO_API}/${numRows}?key=${API_KEY}&schema=${encodeURIComponent(schemaData)}`;
    
    console.log(`📥 Downloading ${numRows} records from Mockaroo...`);
    
    const req = https.request(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
          console.log(`✅ Downloaded ${jsonData.length} records to ${filename}`);
          resolve(jsonData);
        } catch (error) {
          console.error(`❌ Error parsing JSON: ${error.message}`);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Download error: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

// Generate massive dataset
async function generateMassiveDataset() {
  console.log("🚀 Starting massive dataset generation...");
  
  try {
    // Create data directory
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // Generate cars in batches (Mockaroo free plan limit is 1000 per call)
    console.log("🚗 Generating cars...");
    const allCars = [];
    const batchSize = 1000;
    const totalCars = 10000;
    const batches = Math.ceil(totalCars / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const currentBatchSize = Math.min(batchSize, totalCars - (i * batchSize));
      const batchCars = await downloadMockarooData(
        CAR_SCHEMA,
        path.join(dataDir, `cars_batch_${i + 1}.json`),
        currentBatchSize
      );
      allCars.push(...batchCars);
      console.log(`📊 Cars batch ${i + 1}/${batches} completed`);
    }
    
    // Combine all car batches
    fs.writeFileSync(path.join(dataDir, 'cars.json'), JSON.stringify(allCars, null, 2));
    console.log(`✅ Combined ${allCars.length} cars into cars.json`);
    
    // Generate dealers
    console.log("🏢 Generating dealers...");
    const dealers = await downloadMockarooData(
      DEALER_SCHEMA,
      path.join(dataDir, 'dealers.json'),
      500
    );
    
    // Generate listings (multiple per car)
    console.log("📋 Generating listings...");
    const listings = [];
    const listingsPerCar = 2.5; // Average 2-3 listings per car
    
    for (let i = 0; i < allCars.length; i++) {
      const car = allCars[i];
      const numListings = Math.floor(Math.random() * 3) + 1; // 1-3 listings per car
      
      for (let j = 0; j < numListings; j++) {
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
    
    fs.writeFileSync(path.join(dataDir, 'listings.json'), JSON.stringify(listings, null, 2));
    console.log(`✅ Generated ${listings.length} listings`);
    
    console.log("\n🎉 Massive dataset generation completed!");
    console.log(`📊 Dataset Summary:`);
    console.log(`🚗 Cars: ${allCars.length}`);
    console.log(`🏢 Dealers: ${dealers.length}`);
    console.log(`📋 Listings: ${listings.length}`);
    console.log(`📈 Average listings per car: ${(listings.length / allCars.length).toFixed(2)}`);
    console.log("\n🚀 Ready to import: npm run seed:massive");
    
  } catch (error) {
    console.error("❌ Error generating dataset:", error);
    process.exit(1);
  }
}

generateMassiveDataset();
