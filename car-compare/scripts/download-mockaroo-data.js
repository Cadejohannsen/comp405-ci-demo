const https = require('https');
const fs = require('fs');
const path = require('path');

// Mockaroo API endpoint
const MOCKAROO_API = 'https://api.mockaroo.com/api';

// API Key (you'll need to get this from Mockaroo)
const API_KEY = '31038e10';

// Download data from Mockaroo
async function downloadMockarooData(schema, filename, numRows) {
  return new Promise((resolve, reject) => {
    const url = `${MOCKAROO_API}/${numRows}?key=${API_KEY}`;
    
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

// Main download function
async function downloadAllData() {
  console.log("🚀 Starting Mockaroo data download...");
  
  try {
    // Create data directory
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // Download cars data
    await downloadMockarooData(
      'cars',
      path.join(dataDir, 'cars.json'),
      10000
    );
    
    // Download dealers data  
    await downloadMockarooData(
      'dealers',
      path.join(dataDir, 'dealers.json'),
      500
    );
    
    // Download listings data
    await downloadMockarooData(
      'listings',
      path.join(dataDir, 'listings.json'),
      25000
    );
    
    console.log("\n🎉 All data downloaded successfully!");
    console.log("📊 Ready to run: npm run seed:massive");
    
  } catch (error) {
    console.error("❌ Download failed:", error.message);
    process.exit(1);
  }
}

// Instructions for manual Mockaroo setup
console.log(`
📋 Manual Mockaroo Setup Instructions:

1. Go to https://www.mockaroo.com/
2. Sign up for a free account or use your existing account
3. Get your API key from your account settings
4. Replace 'your-mockaroo-api-key-here' in this script with your actual API key
5. Run: node scripts/download-mockaroo-data.js
6. Run: npm run seed:massive

Alternative: Manual Download
----------------------
1. Go to https://www.mockaroo.com/
2. Create a new schema with the fields from mockaroo-schema.json
3. Set "num_rows" to 10000 for cars
4. Download as JSON and save as data/cars.json
5. Create dealer schema with mockaroo-dealer-schema.json
6. Set "num_rows" to 500 for dealers  
7. Download as JSON and save as data/dealers.json
8. Create listing schema with mockaroo-listing-schema.json
9. Set "num_rows" to 25000 for listings
10. Download as JSON and save as data/listings.json
11. Run: npm run seed:massive

📊 Expected Results:
- 10,000+ cars across all major brands
- 500+ dealerships nationwide
- 25,000+ individual listings
- Complete price range coverage ($5,000 - $500,000+)
- All body types and fuel types
- Realistic dealer-car relationships
`);

// Run download if API key is provided
if (API_KEY !== 'your-mockaroo-api-key-here') {
  downloadAllData();
}
