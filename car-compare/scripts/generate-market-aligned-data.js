const fs = require('fs');
const path = require('path');

// Market-aligned vehicle data with realistic 2024 pricing
const VEHICLE_DATA = {
  // Toyota models with realistic 2024 pricing
  Toyota: [
    { model: 'Camry', basePrice: 28000, category: 'Sedan', mpg: [32, 41], resaleValue: 'excellent' },
    { model: 'Corolla', basePrice: 24000, category: 'Sedan', mpg: [31, 40], resaleValue: 'excellent' },
    { model: 'RAV4', basePrice: 32000, category: 'SUV', mpg: [27, 35], resaleValue: 'excellent' },
    { model: 'Highlander', basePrice: 40000, category: 'SUV', mpg: [21, 29], resaleValue: 'excellent' },
    { model: 'Tacoma', basePrice: 35000, category: 'Truck', mpg: [20, 23], resaleValue: 'excellent' },
    { model: 'Tundra', basePrice: 45000, category: 'Truck', mpg: [16, 20], resaleValue: 'good' },
    { model: 'Prius', basePrice: 28000, category: 'Hybrid', mpg: [54, 50], resaleValue: 'excellent' },
    { model: 'Sienna', basePrice: 38000, category: 'Minivan', mpg: [19, 26], resaleValue: 'good' }
  ],
  // Honda models
  Honda: [
    { model: 'Accord', basePrice: 30000, category: 'Sedan', mpg: [33, 42], resaleValue: 'excellent' },
    { model: 'Civic', basePrice: 26000, category: 'Sedan', mpg: [33, 42], resaleValue: 'excellent' },
    { model: 'CR-V', basePrice: 34000, category: 'SUV', mpg: [28, 34], resaleValue: 'excellent' },
    { model: 'Pilot', basePrice: 45000, category: 'SUV', mpg: [20, 27], resaleValue: 'good' },
    { model: 'Odyssey', basePrice: 42000, category: 'Minivan', mpg: [19, 28], resaleValue: 'good' },
    { model: 'Fit', basePrice: 20000, category: 'Hatchback', mpg: [33, 40], resaleValue: 'good' }
  ],
  // Ford models
  Ford: [
    { model: 'F-150', basePrice: 45000, category: 'Truck', mpg: [20, 24], resaleValue: 'average' },
    { model: 'Mustang', basePrice: 35000, category: 'Sports', mpg: [21, 32], resaleValue: 'average' },
    { model: 'Explorer', basePrice: 42000, category: 'SUV', mpg: [21, 28], resaleValue: 'average' },
    { model: 'Escape', basePrice: 30000, category: 'SUV', mpg: [28, 34], resaleValue: 'average' },
    { model: 'Focus', basePrice: 22000, category: 'Sedan', mpg: [30, 40], resaleValue: 'average' }
  ],
  // Chevrolet models
  Chevrolet: [
    { model: 'Silverado', basePrice: 48000, category: 'Truck', mpg: [17, 23], resaleValue: 'average' },
    { model: 'Tahoe', basePrice: 45000, category: 'SUV', mpg: [20, 28], resaleValue: 'average' },
    { model: 'Malibu', basePrice: 28000, category: 'Sedan', mpg: [29, 36], resaleValue: 'average' },
    { model: 'Equinox', basePrice: 32000, category: 'SUV', mpg: [26, 31], resaleValue: 'average' },
    { model: 'Camaro', basePrice: 32000, category: 'Sports', mpg: [22, 31], resaleValue: 'average' },
    { model: 'Corvette', basePrice: 70000, category: 'Sports', mpg: [16, 29], resaleValue: 'good' }
  ],
  // BMW models (premium pricing)
  BMW: [
    { model: '3 Series', basePrice: 48000, category: 'Sedan', mpg: [26, 34], resaleValue: 'average' },
    { model: '5 Series', basePrice: 65000, category: 'Sedan', mpg: [25, 33], resaleValue: 'average' },
    { model: 'X5', basePrice: 75000, category: 'SUV', mpg: [21, 28], resaleValue: 'average' },
    { model: 'X3', basePrice: 55000, category: 'SUV', mpg: [23, 30], resaleValue: 'average' }
  ],
  // Mercedes-Benz models (premium pricing)
  'Mercedes-Benz': [
    { model: 'C-Class', basePrice: 50000, category: 'Sedan', mpg: [25, 35], resaleValue: 'average' },
    { model: 'E-Class', basePrice: 68000, category: 'Sedan', mpg: [23, 33], resaleValue: 'average' },
    { model: 'GLE', basePrice: 75000, category: 'SUV', mpg: [19, 26], resaleValue: 'average' },
    { model: 'GLC', basePrice: 60000, category: 'SUV', mpg: [22, 29], resaleValue: 'average' }
  ],
  // Audi models (premium pricing)
  Audi: [
    { model: 'A4', basePrice: 45000, category: 'Sedan', mpg: [27, 34], resaleValue: 'average' },
    { model: 'A6', basePrice: 62000, category: 'Sedan', mpg: [24, 33], resaleValue: 'average' },
    { model: 'Q5', basePrice: 58000, category: 'SUV', mpg: [23, 30], resaleValue: 'average' },
    { model: 'Q7', basePrice: 85000, category: 'SUV', mpg: [18, 25], resaleValue: 'average' }
  ],
  // Tesla models (premium EV pricing)
  Tesla: [
    { model: 'Model 3', basePrice: 45000, category: 'Sedan', mpg: [132, 115], resaleValue: 'average' },
    { model: 'Model Y', basePrice: 58000, category: 'SUV', mpg: [125, 111], resaleValue: 'average' },
    { model: 'Model S', basePrice: 85000, category: 'Sedan', mpg: [120, 105], resaleValue: 'average' },
    { model: 'Model X', basePrice: 100000, category: 'SUV', mpg: [104, 96], resaleValue: 'average' }
  ],
  // Nissan models
  Nissan: [
    { model: 'Altima', basePrice: 30000, category: 'Sedan', mpg: [28, 39], resaleValue: 'average' },
    { model: 'Sentra', basePrice: 24000, category: 'Sedan', mpg: [32, 41], resaleValue: 'average' },
    { model: 'Rogue', basePrice: 34000, category: 'SUV', mpg: [30, 37], resaleValue: 'average' },
    { model: 'Pathfinder', basePrice: 40000, category: 'SUV', mpg: [21, 27], resaleValue: 'average' },
    { model: 'Frontier', basePrice: 35000, category: 'Truck', mpg: [18, 24], resaleValue: 'average' }
  ],
  // Hyundai models
  Hyundai: [
    { model: 'Elantra', basePrice: 24000, category: 'Sedan', mpg: [33, 42], resaleValue: 'average' },
    { model: 'Sonata', basePrice: 30000, category: 'Sedan', mpg: [28, 38], resaleValue: 'average' },
    { model: 'Tucson', basePrice: 34000, category: 'SUV', mpg: [26, 33], resaleValue: 'average' },
    { model: 'Santa Fe', basePrice: 40000, category: 'SUV', mpg: [22, 29], resaleValue: 'average' },
    { model: 'Palisade', basePrice: 45000, category: 'SUV', mpg: [19, 26], resaleValue: 'average' }
  ],
  // Kia models
  Kia: [
    { model: 'Forte', basePrice: 22000, category: 'Sedan', mpg: [31, 41], resaleValue: 'average' },
    { model: 'Optima', basePrice: 28000, category: 'Sedan', mpg: [29, 39], resaleValue: 'average' },
    { model: 'Sportage', basePrice: 34000, category: 'SUV', mpg: [25, 32], resaleValue: 'average' },
    { model: 'Sorento', basePrice: 40000, category: 'SUV', mpg: [21, 28], resaleValue: 'average' },
    { model: 'Telluride', basePrice: 45000, category: 'SUV', mpg: [20, 27], resaleValue: 'average' }
  ],
  // Mazda models
  Mazda: [
    { model: 'Mazda3', basePrice: 26000, category: 'Sedan', mpg: [28, 36], resaleValue: 'average' },
    { model: 'Mazda6', basePrice: 32000, category: 'Sedan', mpg: [26, 35], resaleValue: 'average' },
    { model: 'CX-5', basePrice: 34000, category: 'SUV', mpg: [25, 31], resaleValue: 'average' },
    { model: 'CX-9', basePrice: 45000, category: 'SUV', mpg: [20, 27], resaleValue: 'average' }
  ],
  // Subaru models
  Subaru: [
    { model: 'Impreza', basePrice: 24000, category: 'Sedan', mpg: [28, 36], resaleValue: 'average' },
    { model: 'Legacy', basePrice: 30000, category: 'Sedan', mpg: [27, 35], resaleValue: 'average' },
    { model: 'Outback', basePrice: 34000, category: 'SUV', mpg: [26, 33], resaleValue: 'average' },
    { model: 'Forester', basePrice: 32000, category: 'SUV', mpg: [27, 34], resaleValue: 'average' },
    { model: 'Ascent', basePrice: 45000, category: 'SUV', mpg: [20, 27], resaleValue: 'average' }
  ],
  // Volkswagen models
  Volkswagen: [
    { model: 'Jetta', basePrice: 25000, category: 'Sedan', mpg: [31, 41], resaleValue: 'average' },
    { model: 'Passat', basePrice: 32000, category: 'Sedan', mpg: [29, 38], resaleValue: 'average' },
    { model: 'Tiguan', basePrice: 34000, category: 'SUV', mpg: [23, 30], resaleValue: 'average' },
    { model: 'Atlas', basePrice: 48000, category: 'SUV', mpg: [20, 27], resaleValue: 'average' }
  ],
  // Luxury brands
  Lexus: [
    { model: 'ES 350', basePrice: 48000, category: 'Sedan', mpg: [22, 32], resaleValue: 'good' },
    { model: 'RX 350', basePrice: 55000, category: 'SUV', mpg: [22, 29], resaleValue: 'good' },
    { model: 'LS 500', basePrice: 90000, category: 'Sedan', mpg: [18, 29], resaleValue: 'average' }
  ],
  Infiniti: [
    { model: 'Q50', basePrice: 48000, category: 'Sedan', mpg: [20, 29], resaleValue: 'average' },
    { model: 'QX50', basePrice: 50000, category: 'SUV', mpg: [22, 29], resaleValue: 'average' },
    { model: 'QX80', basePrice: 85000, category: 'SUV', mpg: [14, 20], resaleValue: 'average' }
  ],
  Acura: [
    { model: 'ILX', basePrice: 35000, category: 'Sedan', mpg: [25, 35], resaleValue: 'average' },
    { model: 'RDX', basePrice: 48000, category: 'SUV', mpg: [22, 28], resaleValue: 'average' },
    { model: 'MDX', basePrice: 55000, category: 'SUV', mpg: [19, 26], resaleValue: 'average' }
  ],
  Cadillac: [
    { model: 'CT4', basePrice: 40000, category: 'Sedan', mpg: [27, 34], resaleValue: 'average' },
    { model: 'XT4', basePrice: 45000, category: 'SUV', mpg: [24, 30], resaleValue: 'average' },
    { model: 'Escalade', basePrice: 90000, category: 'SUV', mpg: [14, 21], resaleValue: 'average' }
  ],
  Lincoln: [
    { model: 'MKZ', basePrice: 45000, category: 'Sedan', mpg: [21, 31], resaleValue: 'average' },
    { model: 'Nautilus', basePrice: 55000, category: 'SUV', mpg: [20, 27], resaleValue: 'average' },
    { model: 'Navigator', basePrice: 90000, category: 'SUV', mpg: [16, 23], resaleValue: 'average' }
  ],
  // Electric and hybrid brands
  Rivian: [
    { model: 'R1T', basePrice: 85000, category: 'Truck', mpg: [70, 70], resaleValue: 'average' },
    { model: 'R1S', basePrice: 90000, category: 'SUV', mpg: [77, 77], resaleValue: 'average' }
  ],
  Lucid: [
    { model: 'Air', basePrice: 95000, category: 'Sedan', mpg: [117, 117], resaleValue: 'average' }
  ],
  // Performance brands (luxury pricing)
  Porsche: [
    { model: '911', basePrice: 120000, category: 'Sports', mpg: [20, 28], resaleValue: 'good' },
    { model: 'Cayenne', basePrice: 95000, category: 'SUV', mpg: [19, 26], resaleValue: 'average' },
    { model: 'Macan', basePrice: 75000, category: 'SUV', mpg: [19, 26], resaleValue: 'average' }
  ],
  Ferrari: [
    { model: '488', basePrice: 320000, category: 'Sports', mpg: [15, 23], resaleValue: 'excellent' },
    { model: 'F8', basePrice: 450000, category: 'Sports', mpg: [12, 16], resaleValue: 'excellent' }
  ],
  Lamborghini: [
    { model: 'Huracan', basePrice: 320000, category: 'Sports', mpg: [14, 21], resaleValue: 'excellent' },
    { model: 'Urus', basePrice: 280000, category: 'SUV', mpg: [12, 17], resaleValue: 'excellent' }
  ],
  Bentley: [
    { model: 'Continental GT', basePrice: 250000, category: 'Sports', mpg: [14, 24], resaleValue: 'excellent' },
    { model: 'Bentayga', basePrice: 220000, category: 'SUV', mpg: [12, 19], resaleValue: 'excellent' }
  ]
};

// Improved depreciation model based on market research
const DEPRECIATION_MODEL = {
  // Age-based depreciation rates (per year)
  ageRates: {
    0: 0.15,  // First year: 15% depreciation
    1: 0.12,  // Years 1-3: 12% per year
    2: 0.12,
    3: 0.10,  // Years 3-7: 10% per year
    4: 0.10,
    5: 0.10,
    6: 0.10,
    7: 0.08,  // Years 7-15: 8% per year
    8: 0.08,
    9: 0.08,
    10: 0.08,
    11: 0.08,
    12: 0.08,
    13: 0.08,
    14: 0.08,
    15: 0.05,  // Years 15+: 5% per year (collectible factor)
  },
  
  // Brand-specific adjustments
  brandAdjustments: {
    'excellent': 0.8,  // Toyota, Honda - 20% better resale value
    'good': 1.0,      // Mainstream average
    'average': 1.1,   // European luxury - 10% faster depreciation
    'poor': 1.2       // Performance/luxury - 20% faster depreciation
  },
  
  // Condition-based pricing multipliers
  conditionMultipliers: {
    'New': 1.0,
    'Like New': 0.95,
    'Excellent': 0.85,
    'Very Good': 0.75,
    'Good': 0.65,
    'Fair': 0.50,
    'Poor': 0.35
  },
  
  // Collectible premiums for vintage cars (25+ years)
  collectiblePremiums: {
    'Porsche': 1.5,
    'Ferrari': 2.0,
    'Lamborghini': 1.8,
    'Bentley': 1.6,
    'Mercedes-Benz': 1.3,
    'BMW': 1.2,
    'default': 1.1
  }
};

// Trims for different categories
const TRIMS = {
  Sedan: ['Base', 'LE', 'SE', 'XLE', 'Limited', 'Platinum', 'Sport', 'Touring'],
  SUV: ['Base', 'LE', 'SE', 'XLE', 'Limited', 'Platinum', 'Sport', 'Touring'],
  Truck: ['Base', 'XL', 'XLT', 'Lariat', 'Limited', 'Platinum', 'King Ranch', 'Raptor'],
  Sports: ['Base', 'S', '4S', 'Turbo', 'GT', 'GT3', 'GT4', 'Spyder', 'Coupe', 'Convertible'],
  'Minivan': ['Base', 'LE', 'SE', 'XLE', 'Limited', 'Platinum'],
  Hatchback: ['Base', 'SE', 'Sport', 'Touring'],
  Hybrid: ['Base', 'LE', 'SE', 'XLE', 'Limited', 'Platinum', 'Touring']
};

// Calculate realistic pricing based on market data
function calculateRealisticPricing(basePrice, year, condition, make, modelData) {
  const age = 2026 - year;
  const resaleValue = modelData.resaleValue || 'average';
  const brandAdjustment = DEPRECIATION_MODEL.brandAdjustments[resaleValue];
  
  // Calculate depreciation based on age
  let depreciation = 1.0;
  for (let i = 0; i < age && i < 25; i++) {
    const rate = DEPRECIATION_MODEL.ageRates[i] || 0.05;
    depreciation *= (1 - rate * brandAdjustment);
  }
  
  // Apply collectible premium for vintage cars
  let collectiblePremium = 1.0;
  if (age >= 25) {
    collectiblePremium = DEPRECIATION_MODEL.collectiblePremiums[make] || DEPRECIATION_MODEL.collectiblePremiums.default;
  }
  
  // Calculate MSRP with inflation adjustment
  const inflationAdjustment = Math.pow(1.03, (2026 - 2024)); // 3% inflation per year
  let msrp = basePrice * inflationAdjustment * depreciation * collectiblePremium;
  
  // Add random variation (±10%)
  msrp = msrp * (0.9 + Math.random() * 0.2);
  
  // Apply condition multiplier
  const conditionMultiplier = DEPRECIATION_MODEL.conditionMultipliers[condition];
  msrp = msrp * conditionMultiplier;
  
  // Calculate market value and dealer price
  const marketValue = msrp * (0.85 + Math.random() * 0.1); // 85-95% of MSRP
  const dealerPrice = marketValue * (0.95 + Math.random() * 0.1); // 95-105% of market value
  
  return {
    msrp: Math.round(msrp),
    marketValue: Math.round(marketValue),
    dealerPrice: Math.round(dealerPrice)
  };
}

// Generate realistic mileage based on age and condition
function calculateRealisticMileage(year, condition) {
  const age = 2026 - year;
  const expectedMileage = age * 12000; // 12,000 miles per year average
  
  const mileageMultipliers = {
    'New': 0.1,      // New cars have very low mileage
    'Like New': 0.3,
    'Excellent': 0.5,
    'Very Good': 0.8,
    'Good': 1.2,
    'Fair': 1.8,
    'Poor': 2.5
  };
  
  const mileage = expectedMileage * mileageMultipliers[condition] * (0.7 + Math.random() * 0.6);
  return Math.max(0, Math.min(mileage, 300000)); // Cap at 300,000 miles
}

// Generate market-aligned car data
function generateMarketAlignedCars(count) {
  console.log('🚗 Generating market-aligned car data...');
  
  const cars = [];
  const makes = Object.keys(VEHICLE_DATA);
  const colors = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Beige', 'Gold', 'Orange', 'Yellow', 'Purple', 'Charcoal', 'Pearl White', 'Midnight Black', 'Silver Metallic', 'Deep Blue', 'Forest Green', 'Fire Engine Red', 'Sunset Orange', 'Champagne', 'Platinum'];
  const transmissions = ['Automatic', 'Manual', 'CVT', 'Dual-Clutch', 'Electric'];
  const driveTypes = ['FWD', 'RWD', 'AWD', '4WD'];
  const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Plug-in Hybrid', 'Electric', 'Flex Fuel'];
  const conditions = ['New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  
  // Validate that we have vehicle data
  if (!VEHICLE_DATA || Object.keys(VEHICLE_DATA).length === 0) {
    console.error('❌ No vehicle data available');
    return [];
  }
  
  for (let i = 0; i < count; i++) {
    const make = makes[Math.floor(Math.random() * makes.length)];
    const models = VEHICLE_DATA[make];
    
    // Skip if this make has no models defined
    if (!models || models.length === 0) {
      continue;
    }
    
    const modelData = models[Math.floor(Math.random() * models.length)];
    const year = Math.floor(Math.random() * 37) + 1990; // 1990-2026
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Calculate realistic pricing
    const pricing = calculateRealisticPricing(modelData.basePrice, year, condition, make, modelData);
    
    // Calculate realistic mileage
    const mileage = calculateRealisticMileage(year, condition);
    
    // Generate realistic specifications
    const trims = TRIMS[modelData.category];
    const trim = trims ? trims[Math.floor(Math.random() * trims.length)] : 'Base';
    
    const car = {
      make: make,
      model: modelData.model,
      year: year,
      trim: trim,
      bodyType: modelData.category,
      color: colors[Math.floor(Math.random() * colors.length)],
      transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
      driveType: driveTypes[Math.floor(Math.random() * driveTypes.length)],
      fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      engine: getEngineForCar(modelData.category, modelData.basePrice),
      horsepower: getHorsepowerForCar(modelData.category, modelData.basePrice),
      torque: getTorqueForCar(modelData.category, modelData.basePrice),
      mpgCity: modelData.mpg[0],
      mpgHighway: modelData.mpg[1],
      fuelTank: getFuelTankForCar(modelData.category),
      length: getLengthForCar(modelData.category),
      width: getWidthForCar(modelData.category),
      height: getHeightForCar(modelData.category),
      weight: getWeightForCar(modelData.category),
      cargoSpace: getCargoSpaceForCar(modelData.category),
      airbags: getAirbagsForCar(year),
      ratingNHTSA: getNHTSARating(year, modelData.category),
      ratingIIHS: getIIHSRating(year, modelData.category),
      vin: generateVIN(),
      stockNumber: generateStockNumber(),
      condition: condition,
      mileage: mileage,
      msrp: pricing.msrp,
      marketValue: pricing.marketValue,
      dealerPrice: pricing.dealerPrice,
      imageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=800&h=600&fit=crop&auto=format`
    };
    
    cars.push(car);
  }
  
  return cars;
}

// Helper functions for realistic specifications (same as before)
function getEngineForCar(category, basePrice) {
  const engines = {
    Sedan: ['1.5L I4', '1.8L I4', '2.0L I4', '2.5L I4', '3.5L V6', '2.0L Turbo I4', '3.0L Twin-Turbo I6'],
    SUV: ['2.5L I4', '3.5L V6', '2.0L Turbo I4', '3.0L Twin-Turbo I6', '5.7L V8', '3.0L Turbo V6'],
    Truck: ['3.5L V6', '5.3L V8', '6.2L V8', '3.0L Turbo V6', '6.7L V8', '5.0L V8 Diesel'],
    Sports: ['2.0L Turbo I4', '3.0L Twin-Turbo I6', '4.0L Twin-Turbo V8', '5.0L V8', '6.2L V8', '6.5L V12'],
    'Minivan': ['3.5L V6', '3.5L V6 Hybrid', '2.5L I4 Hybrid'],
    Hatchback: ['1.5L I4', '1.8L I4', '2.0L I4', '2.0L Turbo I4'],
    Hybrid: ['2.0L I4 Hybrid', '2.5L I4 Hybrid', '3.5L V6 Hybrid', 'Electric Motor']
  };
  
  const categoryEngines = engines[category] || engines.Sedan;
  return categoryEngines[Math.floor(Math.random() * categoryEngines.length)];
}

function getHorsepowerForCar(category, basePrice) {
  if (category === 'Sports') {
    return Math.floor(300 + (basePrice / 500) * 10 + Math.random() * 100);
  } else if (category === 'Truck') {
    return Math.floor(250 + (basePrice / 1000) * 5 + Math.random() * 50);
  } else {
    return Math.floor(130 + (basePrice / 1000) * 3 + Math.random() * 30);
  }
}

function getTorqueForCar(category, basePrice) {
  if (category === 'Sports') {
    return Math.floor(300 + (basePrice / 500) * 8 + Math.random() * 80);
  } else if (category === 'Truck') {
    return Math.floor(350 + (basePrice / 1000) * 6 + Math.random() * 60);
  } else {
    return Math.floor(120 + (basePrice / 1000) * 2.5 + Math.random() * 25);
  }
}

function getFuelTankForCar(category) {
  const tanks = {
    Sedan: [11, 13, 15, 16],
    SUV: [15, 17, 19, 21, 23],
    Truck: [19, 22, 25, 28, 33],
    Sports: [13, 15, 16, 18],
    'Minivan': [16, 18, 19, 20],
    Hatchback: [11, 12, 13, 14],
    Hybrid: [11, 13, 15, 16]
  };
  
  const categoryTanks = tanks[category] || tanks.Sedan;
  return categoryTanks[Math.floor(Math.random() * categoryTanks.length)];
}

function getLengthForCar(category) {
  const lengths = {
    Sedan: [175, 185, 195, 205],
    SUV: [175, 185, 195, 205, 215, 225],
    Truck: [190, 210, 230, 250],
    Sports: [175, 182, 188, 195],
    'Minivan': [200, 205, 210, 215],
    Hatchback: [160, 165, 170, 175]
  };
  
  const categoryLengths = lengths[category] || lengths.Sedan;
  return categoryLengths[Math.floor(Math.random() * categoryLengths.length)];
}

function getWidthForCar(category) {
  const widths = {
    Sedan: [68, 70, 72, 74],
    SUV: [70, 74, 78, 82],
    Truck: [79, 80, 81, 82],
    Sports: [72, 75, 78, 81],
    'Minivan': [75, 78, 80, 82],
    Hatchback: [66, 68, 70, 72]
  };
  
  const categoryWidths = widths[category] || widths.Sedan;
  return categoryWidths[Math.floor(Math.random() * categoryWidths.length)];
}

function getHeightForCar(category) {
  const heights = {
    Sedan: [55, 57, 58, 60],
    SUV: [65, 67, 69, 71, 73],
    Truck: [70, 73, 75, 78],
    Sports: [52, 54, 55, 57],
    'Minivan': [66, 68, 70, 72],
    Hatchback: [56, 58, 60, 62]
  };
  
  const categoryHeights = heights[category] || heights.Sedan;
  return categoryHeights[Math.floor(Math.random() * categoryHeights.length)];
}

function getWeightForCar(category) {
  const weights = {
    Sedan: [2800, 3200, 3600, 4000],
    SUV: [3500, 4000, 4500, 5000, 5500],
    Truck: [4500, 5000, 5500, 6000],
    Sports: [3000, 3500, 4000, 4500],
    'Minivan': [4000, 4300, 4600, 4900],
    Hatchback: [2500, 2800, 3100, 3400]
  };
  
  const categoryWeights = weights[category] || weights.Sedan;
  return categoryWeights[Math.floor(Math.random() * categoryWeights.length)];
}

function getCargoSpaceForCar(category) {
  const cargo = {
    Sedan: [14, 15, 16, 17],
    SUV: [30, 35, 40, 45, 50],
    Truck: [40, 50, 60, 70],
    Sports: [10, 11, 12, 13],
    'Minivan': [30, 33, 37, 40],
    Hatchback: [20, 22, 25, 28]
  };
  
  const categoryCargo = cargo[category] || cargo.Sedan;
  return categoryCargo[Math.floor(Math.random() * categoryCargo.length)];
}

function getAirbagsForCar(year) {
  if (year < 1998) return 2;
  if (year < 2000) return 4;
  if (year < 2005) return 6;
  if (year < 2010) return 8;
  return 10;
}

function getNHTSARating(year, category) {
  if (year < 2000) return '3';
  if (year < 2005) return '4';
  if (year < 2010) return '5';
  return '5';
}

function getIIHSRating(year, category) {
  if (year < 2000) return 'Marginal';
  if (year < 2005) return 'Acceptable';
  if (year < 2010) return 'Good';
  return 'Good+';
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

// Generate realistic dealers (same as before)
function generateRealisticDealers(count) {
  console.log('🏢 Generating realistic dealers...');
  
  const dealerNames = [
    'AutoNation', 'CarMax', 'Penske Automotive', 'Sonic Automotive', 'Group 1 Automotive',
    'Lithia Motors', 'Asbury Automotive Group', 'Penske Automotive Group', 'Sonic Automotive',
    'Toyota of', 'Honda of', 'Ford of', 'Chevrolet of', 'BMW of', 'Mercedes-Benz of',
    'Audi of', 'Lexus of', 'Nissan of', 'Hyundai of', 'Kia of', 'Mazda of', 'Subaru of',
    'Volkswagen of', 'Cadillac of', 'Lincoln of', 'Acura of', 'Infiniti of', 'Buick of',
    'GMC of', 'Jeep of', 'Ram of', 'Dodge of', 'Chrysler of', 'Porsche of', 'Ferrari of',
    'Lamborghini of', 'Bentley of', 'Rolls-Royce of', 'Aston Martin of', 'Maserati of',
    'McLaren of', 'Jaguar of', 'Land Rover of', 'Volvo of', 'Genesis of', 'Tesla of',
    'Rivian of', 'Lucid of', 'Ferrari Beverly Hills', 'Porsche Beverly Hills',
    'BMW of Beverly Hills', 'Mercedes-Benz of Beverly Hills', 'Lexus of Beverly Hills',
    'Toyota Beverly Hills', 'Honda Beverly Hills', 'Ford Beverly Hills', 'Chevrolet Beverly Hills',
    'Nissan Beverly Hills', 'Hyundai Beverly Hills'
  ];
  
  const cities = [
    'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
    'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
    'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
    'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Milwaukee, WI',
    'Baltimore, MD', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA',
    'Kansas City, MO', 'Mesa, AZ', 'Atlanta, GA', 'Omaha, NE', 'Colorado Springs, CO',
    'Raleigh, NC', 'Long Beach, CA', 'Virginia Beach, VA', 'Miami, FL', 'Oakland, CA',
    'Minneapolis, MN', 'Tampa, FL', 'Tulsa, OK', 'Arlington, TX', 'Wichita, KS',
    'New Orleans, LA', 'Bakersfield, CA', 'Cleveland, OH', 'Aurora, CO', 'Anaheim, CA',
    'Honolulu, HI', 'Santa Ana, CA', 'Riverside, CA', 'Corpus Christi, TX', 'Lexington, KY',
    'Stockton, CA', 'Pittsburgh, PA', 'St. Paul, MN', 'Cincinnati, OH', 'Greensboro, NC',
    'Plano, TX', 'Newark, NJ', 'Orlando, FL', 'Durham, NC', 'Chula Vista, CA',
    'Laredo, TX', 'Buffalo, NY', 'Rochester, NY', 'St. Louis, MO', 'Reno, NV',
    'Glendale, AZ', 'Gilbert, AZ', 'Garland, TX', 'Winston-Salem, NC', 'North Las Vegas, NV',
    'Norfolk, VA', 'Chesapeake, VA', 'Lubbock, TX', 'Scottsdale, AZ', 'Irving, TX',
    'Glendale, CA', 'Hialeah, FL', 'Fremont, CA', 'Irvine, CA', 'San Bernardino, CA',
    'Boise, ID', 'Birmingham, AL', 'Ranchington, WA', 'Spokane Valley, WA', 'Spokane, WA'
  ];
  
  const dealers = [];
  
  for (let i = 0; i < count; i++) {
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
  
  return dealers;
}

// Generate realistic listings (same as before)
function generateRealisticListings(cars, dealers) {
  console.log('📋 Generating realistic listings...');
  
  const listings = [];
  const listingTypes = ['New', 'Used', 'Certified Pre-Owned'];
  const statuses = ['Available', 'Pending', 'Sold', 'Reserved'];
  
  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    const numListings = Math.floor(Math.random() * 3) + 1; // 1-3 listings per car
    
    for (let j = 0; j < numListings; j++) {
      const dealer = dealers[Math.floor(Math.random() * dealers.length)];
      
      // Price variation around dealer price
      const priceVariation = 0.95 + Math.random() * 0.1; // ±5%
      const listingPrice = Math.round(car.dealerPrice * priceVariation);
      
      const listing = {
        price: listingPrice,
        listingType: listingTypes[Math.floor(Math.random() * listingTypes.length)],
        listingStatus: statuses[Math.floor(Math.random() * statuses.length)],
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
        description: `${car.condition} condition, ${car.mileage.toLocaleString()} miles, one owner, clean title, well-maintained`,
        highlights: `${car.condition} condition, ${car.mileage.toLocaleString()} miles, one owner, clean title`,
        features: `${car.transmission}, ${car.driveType}, ${car.fuelType}, premium audio system`,
        conditionDetails: `${car.condition} exterior and interior, no scratches or dents, like new`,
        warranty: car.condition === 'New' ? 'Manufacturer warranty remaining' : 'Extended warranty available',
        financing: 'Financing available with competitive rates',
        delivery: 'Free delivery within 50 miles',
        inspections: '150-point inspection, comprehensive report available'
      };
      
      listings.push(listing);
    }
  }
  
  return listings;
}

// Generate the complete market-aligned dataset
async function generateMarketAlignedDataset() {
  console.log('🚀 Starting market-aligned dataset generation...');
  
  try {
    // Create data directory
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // Generate cars with market-aligned pricing
    const cars = generateMarketAlignedCars(5000);
    fs.writeFileSync(path.join(dataDir, 'cars.json'), JSON.stringify(cars, null, 2));
    console.log(`✅ Generated ${cars.length} market-aligned cars`);
    
    // Generate dealers
    const dealers = generateRealisticDealers(500);
    fs.writeFileSync(path.join(dataDir, 'dealers.json'), JSON.stringify(dealers, null, 2));
    console.log(`✅ Generated ${dealers.length} realistic dealers`);
    
    // Generate listings
    const listings = generateRealisticListings(cars, dealers);
    fs.writeFileSync(path.join(dataDir, 'listings.json'), JSON.stringify(listings, null, 2));
    console.log(`✅ Generated ${listings.length} realistic listings`);
    
    // Show sample data with pricing analysis
    console.log('\n📊 Sample Cars with Market-Aligned Pricing:');
    cars.slice(0, 10).forEach((car, index) => {
      const priceCategory = car.msrp < 20000 ? 'Budget' : 
                          car.msrp < 40000 ? 'Mainstream' : 
                          car.msrp < 80000 ? 'Premium' : 'Luxury';
      console.log(`${index + 1}. ${car.year} ${car.make} ${car.model} ${car.trim}`);
      console.log(`   💰 Price: $${car.msrp.toLocaleString()} (${priceCategory}) | Market: $${car.marketValue.toLocaleString()} | Dealer: $${car.dealerPrice.toLocaleString()}`);
      console.log(`   📏 Mileage: ${car.mileage.toLocaleString()} miles | Condition: ${car.condition}`);
      console.log(`   🚗 Category: ${car.bodyType} | ${car.fuelType} | ${car.transmission}`);
      console.log('');
    });
    
    // Price distribution analysis
    const priceDistribution = {
      'Under $20k': 0,
      '$20k-$40k': 0,
      '$40k-$60k': 0,
      '$60k-$80k': 0,
      '$80k-$100k': 0,
      'Over $100k': 0
    };
    
    cars.forEach(car => {
      if (car.msrp < 20000) priceDistribution['Under $20k']++;
      else if (car.msrp < 40000) priceDistribution['$20k-$40k']++;
      else if (car.msrp < 60000) priceDistribution['$40k-$60k']++;
      else if (car.msrp < 80000) priceDistribution['$60k-$80k']++;
      else if (car.msrp < 100000) priceDistribution['$80k-$100k']++;
      else priceDistribution['Over $100k']++;
    });
    
    console.log('💰 Price Distribution:');
    Object.entries(priceDistribution).forEach(([range, count]) => {
      const percentage = ((count / cars.length) * 100).toFixed(1);
      console.log(`   ${range}: ${count} cars (${percentage}%)`);
    });
    
    console.log('\n🎉 Market-aligned dataset generation completed!');
    console.log(`📊 Dataset Summary:`);
    console.log(`🚗 Cars: ${cars.length}`);
    console.log(`🏢 Dealers: ${dealers.length}`);
    console.log(`📋 Listings: ${listings.length}`);
    console.log(`📈 Average listings per car: ${(listings.length / cars.length).toFixed(2)}`);
    console.log('\n🚀 Ready to import: npm run seed:massive');
    
  } catch (error) {
    console.error('❌ Error generating dataset:', error);
    process.exit(1);
  }
}

generateMarketAlignedDataset();
