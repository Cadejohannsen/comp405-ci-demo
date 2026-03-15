const fs = require('fs');
const path = require('path');

// Realistic vehicle data with proper brand-model combinations and pricing
const VEHICLE_DATA = {
  // Toyota models with realistic pricing
  Toyota: [
    { model: 'Camry', basePrice: 25000, category: 'Sedan', mpg: [32, 41] },
    { model: 'Corolla', basePrice: 22000, category: 'Sedan', mpg: [31, 40] },
    { model: 'RAV4', basePrice: 28000, category: 'SUV', mpg: [27, 35] },
    { model: 'Highlander', basePrice: 35000, category: 'SUV', mpg: [21, 29] },
    { model: 'Tacoma', basePrice: 27000, category: 'Truck', mpg: [20, 23] },
    { model: 'Tundra', basePrice: 37000, category: 'Truck', mpg: [16, 20] },
    { model: 'Prius', basePrice: 24000, category: 'Hybrid', mpg: [54, 50] },
    { model: 'Sienna', basePrice: 35000, category: 'Minivan', mpg: [19, 26] }
  ],
  // Honda models
  Honda: [
    { model: 'Accord', basePrice: 27000, category: 'Sedan', mpg: [33, 42] },
    { model: 'Civic', basePrice: 23000, category: 'Sedan', mpg: [33, 42] },
    { model: 'CR-V', basePrice: 29000, category: 'SUV', mpg: [28, 34] },
    { model: 'Pilot', basePrice: 38000, category: 'SUV', mpg: [20, 27] },
    { model: 'Odyssey', basePrice: 37000, category: 'Minivan', mpg: [19, 28] },
    { model: 'Fit', basePrice: 17000, category: 'Hatchback', mpg: [33, 40] }
  ],
  // Ford models
  Ford: [
    { model: 'F-150', basePrice: 35000, category: 'Truck', mpg: [20, 24] },
    { model: 'Mustang', basePrice: 30000, category: 'Coupe', mpg: [21, 32] },
    { model: 'Explorer', basePrice: 34000, category: 'SUV', mpg: [21, 28] },
    { model: 'Escape', basePrice: 26000, category: 'SUV', mpg: [28, 34] },
    { model: 'Focus', basePrice: 18000, category: 'Sedan', mpg: [30, 40] }
  ],
  // Chevrolet models
  Chevrolet: [
    { model: 'Silverado', basePrice: 36000, category: 'Truck', mpg: [17, 23] },
    { model: 'Tahoe', basePrice: 35000, category: 'SUV', mpg: [20, 28] },
    { model: 'Malibu', basePrice: 24000, category: 'Sedan', mpg: [29, 36] },
    { model: 'Equinox', basePrice: 27000, category: 'SUV', mpg: [26, 31] },
    { model: 'Camaro', basePrice: 26000, category: 'Coupe', mpg: [22, 31] },
    { model: 'Corvette', basePrice: 65000, category: 'Sports', mpg: [16, 29] }
  ],
  // BMW models
  BMW: [
    { model: '3 Series', basePrice: 42000, category: 'Sedan', mpg: [26, 34] },
    { model: '5 Series', basePrice: 55000, category: 'Sedan', mpg: [25, 33] },
    { model: 'X5', basePrice: 62000, category: 'SUV', mpg: [21, 28] },
    { model: 'X3', basePrice: 45000, category: 'SUV', mpg: [23, 30] }
  ],
  // Mercedes-Benz models
  'Mercedes-Benz': [
    { model: 'C-Class', basePrice: 43000, category: 'Sedan', mpg: [25, 35] },
    { model: 'E-Class', basePrice: 56000, category: 'Sedan', mpg: [23, 33] },
    { model: 'GLE', basePrice: 56000, category: 'SUV', mpg: [19, 26] },
    { model: 'GLC', basePrice: 48000, category: 'SUV', mpg: [22, 29] }
  ],
  // Audi models
  Audi: [
    { model: 'A4', basePrice: 40000, category: 'Sedan', mpg: [27, 34] },
    { model: 'A6', basePrice: 55000, category: 'Sedan', mpg: [24, 33] },
    { model: 'Q5', basePrice: 50000, category: 'SUV', mpg: [23, 30] },
    { model: 'Q7', basePrice: 70000, category: 'SUV', mpg: [18, 25] }
  ],
  // Tesla models
  Tesla: [
    { model: 'Model 3', basePrice: 40000, category: 'Sedan', mpg: [132, 115] }, // Electric MPGe
    { model: 'Model Y', basePrice: 52000, category: 'SUV', mpg: [125, 111] },
    { model: 'Model S', basePrice: 75000, category: 'Sedan', mpg: [120, 105] },
    { model: 'Model X', basePrice: 90000, category: 'SUV', mpg: [104, 96] }
  ],
  // Nissan models
  Nissan: [
    { model: 'Altima', basePrice: 26000, category: 'Sedan', mpg: [28, 39] },
    { model: 'Sentra', basePrice: 20000, category: 'Sedan', mpg: [32, 41] },
    { model: 'Rogue', basePrice: 28000, category: 'SUV', mpg: [30, 37] },
    { model: 'Pathfinder', basePrice: 34000, category: 'SUV', mpg: [21, 27] },
    { model: 'Frontier', basePrice: 29000, category: 'Truck', mpg: [18, 24] }
  ],
  // Hyundai models
  Hyundai: [
    { model: 'Elantra', basePrice: 20000, category: 'Sedan', mpg: [33, 42] },
    { model: 'Sonata', basePrice: 25000, category: 'Sedan', mpg: [28, 38] },
    { model: 'Tucson', basePrice: 27000, category: 'SUV', mpg: [26, 33] },
    { model: 'Santa Fe', basePrice: 33000, category: 'SUV', mpg: [22, 29] },
    { model: 'Palisade', basePrice: 37000, category: 'SUV', mpg: [19, 26] }
  ],
  // Kia models
  Kia: [
    { model: 'Forte', basePrice: 19000, category: 'Sedan', mpg: [31, 41] },
    { model: 'Optima', basePrice: 24000, category: 'Sedan', mpg: [29, 39] },
    { model: 'Sportage', basePrice: 27000, category: 'SUV', mpg: [25, 32] },
    { model: 'Sorento', basePrice: 33000, category: 'SUV', mpg: [21, 28] },
    { model: 'Telluride', basePrice: 37000, category: 'SUV', mpg: [20, 27] }
  ],
  // Mazda models
  Mazda: [
    { model: 'Mazda3', basePrice: 23000, category: 'Sedan', mpg: [28, 36] },
    { model: 'Mazda6', basePrice: 26000, category: 'Sedan', mpg: [26, 35] },
    { model: 'CX-5', basePrice: 28000, category: 'SUV', mpg: [25, 31] },
    { model: 'CX-9', basePrice: 38000, category: 'SUV', mpg: [20, 27] }
  ],
  // Subaru models
  Subaru: [
    { model: 'Impreza', basePrice: 19000, category: 'Sedan', mpg: [28, 36] },
    { model: 'Legacy', basePrice: 24000, category: 'Sedan', mpg: [27, 35] },
    { model: 'Outback', basePrice: 28000, category: 'SUV', mpg: [26, 33] },
    { model: 'Forester', basePrice: 27000, category: 'SUV', mpg: [27, 34] },
    { model: 'Ascent', basePrice: 37000, category: 'SUV', mpg: [20, 27] }
  ],
  // Volkswagen models
  Volkswagen: [
    { model: 'Jetta', basePrice: 21000, category: 'Sedan', mpg: [31, 41] },
    { model: 'Passat', basePrice: 26000, category: 'Sedan', mpg: [29, 38] },
    { model: 'Tiguan', basePrice: 28000, category: 'SUV', mpg: [23, 30] },
    { model: 'Atlas', basePrice: 38000, category: 'SUV', mpg: [20, 27] }
  ],
  // Luxury brands
  Lexus: [
    { model: 'ES 350', basePrice: 42000, category: 'Sedan', mpg: [22, 32] },
    { model: 'RX 350', basePrice: 48000, category: 'SUV', mpg: [22, 29] },
    { model: 'LS 500', basePrice: 77000, category: 'Sedan', mpg: [18, 29] }
  ],
  Infiniti: [
    { model: 'Q50', basePrice: 42000, category: 'Sedan', mpg: [20, 29] },
    { model: 'QX50', basePrice: 45000, category: 'SUV', mpg: [22, 29] },
    { model: 'QX80', basePrice: 72000, category: 'SUV', mpg: [14, 20] }
  ],
  Acura: [
    { model: 'ILX', basePrice: 30000, category: 'Sedan', mpg: [25, 35] },
    { model: 'RDX', basePrice: 41000, category: 'SUV', mpg: [22, 28] },
    { model: 'MDX', basePrice: 48000, category: 'SUV', mpg: [19, 26] }
  ],
  Cadillac: [
    { model: 'CT4', basePrice: 35000, category: 'Sedan', mpg: [27, 34] },
    { model: 'XT4', basePrice: 38000, category: 'SUV', mpg: [24, 30] },
    { model: 'Escalade', basePrice: 78000, category: 'SUV', mpg: [14, 21] }
  ],
  Lincoln: [
    { model: 'MKZ', basePrice: 38000, category: 'Sedan', mpg: [21, 31] },
    { model: 'Nautilus', basePrice: 46000, category: 'SUV', mpg: [20, 27] },
    { model: 'Navigator', basePrice: 77000, category: 'SUV', mpg: [16, 23] }
  ],
  // Electric and hybrid brands
  Rivian: [
    { model: 'R1T', basePrice: 73000, category: 'Truck', mpg: [70, 70] },
    { model: 'R1S', basePrice: 78000, category: 'SUV', mpg: [77, 77] }
  ],
  Lucid: [
    { model: 'Air', basePrice: 87000, category: 'Sedan', mpg: [117, 117] }
  ],
  // Performance brands
  Porsche: [
    { model: '911', basePrice: 106000, category: 'Sports', mpg: [20, 28] },
    { model: 'Cayenne', basePrice: 86000, category: 'SUV', mpg: [19, 26] },
    { model: 'Macan', basePrice: 68000, category: 'SUV', mpg: [19, 26] }
  ],
  Ferrari: [
    { model: '488', basePrice: 280000, category: 'Sports', mpg: [15, 23] },
    { model: 'F8', basePrice: 400000, category: 'Sports', mpg: [12, 16] }
  ],
  Lamborghini: [
    { model: 'Huracan', basePrice: 280000, category: 'Sports', mpg: [14, 21] },
    { model: 'Urus', basePrice: 230000, category: 'SUV', mpg: [12, 17] }
  ],
  Bentley: [
    { model: 'Continental GT', basePrice: 220000, category: 'Sports', mpg: [14, 24] },
    { model: 'Bentayga', basePrice: 190000, category: 'SUV', mpg: [12, 19] }
  ]
};

// Trims for different categories
const TRIMS = {
  Sedan: ['Base', 'LE', 'SE', 'XLE', 'Limited', 'Platinum', 'Sport', 'Touring'],
  SUV: ['Base', 'LE', 'SE', 'XLE', 'Limited', 'Platinum', 'Sport', 'Touring'],
  Truck: ['Base', 'XL', 'XLT', 'Lariat', 'Limited', 'Platinum', 'King Ranch', 'Raptor'],
  'Sports': ['Base', 'S', '4S', 'Turbo', 'GT', 'GT3', 'GT4', 'Spyder', 'Coupe', 'Convertible'],
  'Minivan': ['Base', 'LE', 'SE', 'XLE', 'Limited', 'Platinum'],
  Hatchback: ['Base', 'SE', 'Sport', 'Touring'],
  Hybrid: ['Base', 'LE', 'SE', 'XLE', 'Limited', 'Platinum', 'Touring']
};

// Generate realistic car data
function generateRealisticCars(count) {
  console.log('🚗 Generating realistic car data...');
  
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
    
    // Debug logging
    if (!modelData) {
      console.log(`❌ No model data for ${make}`);
      continue;
    }
    
    const year = Math.floor(Math.random() * 37) + 1990; // 1990-2026
    
    // Calculate realistic pricing based on year and condition
    const age = 2026 - year;
    const depreciationRate = 0.12; // 12% per year average
    const conditionMultiplier = {
      'New': 1.0,
      'Like New': 0.95,
      'Excellent': 0.85,
      'Very Good': 0.75,
      'Good': 0.65,
      'Fair': 0.55,
      'Poor': 0.45
    };
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const depreciation = Math.pow(1 - depreciationRate, age);
    const conditionMult = conditionMultiplier[condition];
    
    // Calculate realistic price
    let msrp = modelData.basePrice * Math.pow(1.03, (2026 - 2026)); // Adjust for inflation
    msrp = msrp * depreciation * conditionMult;
    
    // Add some random variation
    msrp = msrp * (0.9 + Math.random() * 0.2); // ±10% variation
    
    // Calculate realistic mileage based on age and condition
    const expectedMileage = age * 12000; // 12,000 miles per year average
    const mileageMultiplier = {
      'New': 0.1, // New cars have very low mileage
      'Like New': 0.3,
      'Excellent': 0.5,
      'Very Good': 0.8,
      'Good': 1.2,
      'Fair': 1.8,
      'Poor': 2.5
    };
    
    const mileage = Math.floor(expectedMileage * mileageMultiplier[condition] * (0.7 + Math.random() * 0.6));
    
    // Calculate market value and dealer price
    const marketValue = msrp * (0.85 + Math.random() * 0.1); // 85-95% of MSRP
    const dealerPrice = marketValue * (0.95 + Math.random() * 0.1); // 95-105% of market value
    
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
      mileage: Math.max(0, Math.min(mileage, 300000)), // Cap at 300,000 miles
      msrp: Math.round(msrp),
      marketValue: Math.round(marketValue),
      dealerPrice: Math.round(dealerPrice),
      imageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=800&h=600&fit=crop&auto=format`
    };
    
    cars.push(car);
  }
  
  return cars;
}

// Helper functions for realistic specifications
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

// Generate realistic dealers
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

// Generate realistic listings
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

// Generate the complete realistic dataset
async function generateRealisticDataset() {
  console.log('🚀 Starting realistic dataset generation...');
  
  try {
    // Create data directory
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // Generate cars
    const cars = generateRealisticCars(5000);
    fs.writeFileSync(path.join(dataDir, 'cars.json'), JSON.stringify(cars, null, 2));
    console.log(`✅ Generated ${cars.length} realistic cars`);
    
    // Generate dealers
    const dealers = generateRealisticDealers(500);
    fs.writeFileSync(path.join(dataDir, 'dealers.json'), JSON.stringify(dealers, null, 2));
    console.log(`✅ Generated ${dealers.length} realistic dealers`);
    
    // Generate listings
    const listings = generateRealisticListings(cars, dealers);
    fs.writeFileSync(path.join(dataDir, 'listings.json'), JSON.stringify(listings, null, 2));
    console.log(`✅ Generated ${listings.length} realistic listings`);
    
    // Show sample data
    console.log('\n📊 Sample Cars:');
    cars.slice(0, 5).forEach((car, index) => {
      console.log(`${index + 1}. ${car.year} ${car.make} ${car.model} ${car.trim}`);
      console.log(`   💰 Price: $${car.msrp.toLocaleString()} | Market: $${car.marketValue.toLocaleString()} | Dealer: $${car.dealerPrice.toLocaleString()}`);
      console.log(`   📏 Mileage: ${car.mileage.toLocaleString()} miles | Condition: ${car.condition}`);
      console.log(`   🚗 Category: ${car.bodyType} | ${car.fuelType} | ${car.transmission}`);
      console.log('');
    });
    
    console.log('🎉 Realistic dataset generation completed!');
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

generateRealisticDataset();
