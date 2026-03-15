// Enhanced Deal Scoring System based on real market data analysis

export interface ListingWithDealer {
  id: string;
  price: number;
  url?: string | null;
  scrapedAt: string | Date;
  dealer: {
    id: string;
    name: string;
    location: string;
    website?: string | null;
  };
}

export interface EnhancedDealScore {
  score: number; // 0-100
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  marketPosition: 'bottom_25' | 'lower_half' | 'upper_half' | 'top_25';
  pricePercentile: number;
  marketAverage: number;
  priceDifference: number;
  priceDifferencePercent: number;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
  marketSize: number;
}

export interface ListingWithEnhancedScore extends ListingWithDealer {
  dealScore: EnhancedDealScore;
}

export interface CarWithMarketData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  bodyType: string;
  imageUrl?: string | null;
  listings: ListingWithEnhancedScore[];
  marketAverage: number;
  bestDeal: ListingWithEnhancedScore;
  dealRange: {
    lowest: number;
    highest: number;
    spread: number;
  };
}

export interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  bodyType: string;
  imageUrl?: string | null;
  listings: ListingWithDealer[];
}

// Vehicle category definitions based on market analysis
export interface VehicleCategory {
  name: string;
  priceRanges: {
    economy: [number, number];
    mid: [number, number];
    premium: [number, number];
    luxury: [number, number];
  };
  depreciationRate: number; // annual percentage
  expectedMileagePerYear: number;
}

export const VEHICLE_CATEGORIES: Record<string, VehicleCategory> = {
  'Sedan': {
    name: 'Sedan',
    priceRanges: {
      economy: [20000, 30000],
      mid: [30000, 45000],
      premium: [45000, 65000],
      luxury: [65000, 100000]
    },
    depreciationRate: 0.12,
    expectedMileagePerYear: 12000
  },
  'SUV': {
    name: 'SUV',
    priceRanges: {
      economy: [25000, 35000],
      mid: [35000, 55000],
      premium: [55000, 75000],
      luxury: [75000, 120000]
    },
    depreciationRate: 0.14,
    expectedMileagePerYear: 14000
  },
  'Truck': {
    name: 'Truck',
    priceRanges: {
      economy: [30000, 45000],
      mid: [45000, 65000],
      premium: [65000, 85000],
      luxury: [85000, 100000]
    },
    depreciationRate: 0.15,
    expectedMileagePerYear: 15000
  },
  'Coupe': {
    name: 'Coupe',
    priceRanges: {
      economy: [25000, 35000],
      mid: [35000, 55000],
      premium: [55000, 80000],
      luxury: [80000, 150000]
    },
    depreciationRate: 0.13,
    expectedMileagePerYear: 10000
  },
  'Hatchback': {
    name: 'Hatchback',
    priceRanges: {
      economy: [18000, 28000],
      mid: [28000, 40000],
      premium: [40000, 60000],
      luxury: [60000, 80000]
    },
    depreciationRate: 0.11,
    expectedMileagePerYear: 12000
  },
  'Convertible': {
    name: 'Convertible',
    priceRanges: {
      economy: [30000, 45000],
      mid: [45000, 65000],
      premium: [65000, 90000],
      luxury: [90000, 200000]
    },
    depreciationRate: 0.16,
    expectedMileagePerYear: 8000
  },
  'Wagon': {
    name: 'Wagon',
    priceRanges: {
      economy: [25000, 35000],
      mid: [35000, 50000],
      premium: [50000, 70000],
      luxury: [70000, 100000]
    },
    depreciationRate: 0.12,
    expectedMileagePerYear: 13000
  }
};

/**
 * Get vehicle category for a car body type
 */
export function getVehicleCategory(bodyType: string): VehicleCategory {
  return VEHICLE_CATEGORIES[bodyType] || VEHICLE_CATEGORIES['SUV']; // Default to SUV
}

/**
 * Get price tier for a vehicle based on its price and category
 */
export function getPriceTier(price: number, category: VehicleCategory): 'economy' | 'mid' | 'premium' | 'luxury' {
  if (price <= category.priceRanges.economy[1]) return 'economy';
  if (price <= category.priceRanges.mid[1]) return 'mid';
  if (price <= category.priceRanges.premium[1]) return 'premium';
  return 'luxury';
}

/**
 * Calculate expected mileage for a car based on its age and category
 */
export function getExpectedMileage(year: number, category: VehicleCategory): number {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);
  return age * category.expectedMileagePerYear;
}

/**
 * Calculate mileage score based on how actual mileage compares to expected
 */
export function calculateMileageScore(actualMileage: number, expectedMileage: number): number {
  if (expectedMileage === 0) return 50; // Default score if we can't calculate
  
  const mileageRatio = actualMileage / expectedMileage;
  
  // Lower mileage is better, but extremely low might be suspicious
  if (mileageRatio <= 0.5) return 85; // Very low mileage - excellent
  if (mileageRatio <= 0.8) return 95; // Low mileage - outstanding
  if (mileageRatio <= 1.0) return 80; // Average mileage - good
  if (mileageRatio <= 1.3) return 60; // High mileage - fair
  if (mileageRatio <= 1.6) return 40; // Very high mileage - poor
  return 20; // Extremely high mileage - very poor
}

/**
 * Find similar vehicles in the market (expanded matching)
 */
export function findSimilarVehicles(
  targetCar: CarData,
  allCars: CarData[],
  maxResults: number = 1000
): CarData[] {
  const currentYear = new Date().getFullYear();
  const targetAge = currentYear - targetCar.year;
  
  return allCars
    .filter(car => {
      // Same category
      if (car.bodyType !== targetCar.bodyType) return false;
      
      // Similar age (within 2 years)
      const carAge = currentYear - car.year;
      if (Math.abs(carAge - targetAge) > 2) return false;
      
      // Has listings
      if (!car.listings || car.listings.length === 0) return false;
      
      return true;
    })
    .slice(0, maxResults);
}

/**
 * Calculate market position percentile for a price within a dataset
 */
export function calculatePricePercentile(targetPrice: number, allPrices: number[]): number {
  if (allPrices.length === 0) return 50;
  
  const sortedPrices = [...allPrices].sort((a, b) => a - b);
  const lowerPrices = sortedPrices.filter(price => price < targetPrice).length;
  const equalPrices = sortedPrices.filter(price => price === targetPrice).length;
  
  // Calculate percentile (0-100)
  const percentile = ((lowerPrices + equalPrices / 2) / sortedPrices.length) * 100;
  return Math.round(percentile);
}

/**
 * Get market position category based on percentile
 */
export function getMarketPosition(percentile: number): 'bottom_25' | 'lower_half' | 'upper_half' | 'top_25' {
  if (percentile <= 25) return 'bottom_25';
  if (percentile <= 50) return 'lower_half';
  if (percentile <= 75) return 'upper_half';
  return 'top_25';
}

/**
 * Calculate enhanced deal score with multiple factors
 */
export function calculateEnhancedDealScore(
  listingPrice: number,
  targetCar: CarData,
  similarCars: CarData[]
): EnhancedDealScore {
  const category = getVehicleCategory(targetCar.bodyType);
  const priceTier = getPriceTier(listingPrice, category);
  const expectedMileage = getExpectedMileage(targetCar.year, category);
  
  // Collect all prices from similar vehicles
  const allPrices: number[] = [];
  similarCars.forEach(car => {
    if (car.listings) {
      car.listings.forEach(listing => {
        allPrices.push(listing.price);
      });
    }
  });
  
  const marketSize = allPrices.length;
  const marketAverage = marketSize > 0 ? allPrices.reduce((sum, price) => sum + price, 0) / marketSize : listingPrice;
  const pricePercentile = calculatePricePercentile(listingPrice, allPrices);
  const marketPosition = getMarketPosition(pricePercentile);
  
  // Calculate component scores
  
  // 1. Market Position Score (40% weight)
  let marketPositionScore: number;
  switch (marketPosition) {
    case 'bottom_25': marketPositionScore = 95; break; // Excellent deal
    case 'lower_half': marketPositionScore = 75; break; // Good deal
    case 'upper_half': marketPositionScore = 45; break; // Fair price
    case 'top_25': marketPositionScore = 20; break;    // Overpriced
    default: marketPositionScore = 50;
  }
  
  // 2. Mileage Score (25% weight)
  const mileageScore = calculateMileageScore(targetCar.mileage, expectedMileage);
  
  // 3. Price Tier Adjustment (20% weight)
  let priceTierScore = 50; // Neutral
  if (priceTier === 'economy' && marketPosition === 'bottom_25') priceTierScore = 90;
  if (priceTier === 'luxury' && marketPosition === 'bottom_25') priceTierScore = 85;
  if (priceTier === 'economy' && marketPosition === 'top_25') priceTierScore = 30;
  if (priceTier === 'luxury' && marketPosition === 'top_25') priceTierScore = 35;
  
  // 4. Market Activity Score (15% weight)
  let marketActivityScore = 50;
  if (marketSize >= 20) marketActivityScore = 60; // Healthy market
  if (marketSize >= 10) marketActivityScore = 50; // Moderate market
  if (marketSize < 10) marketActivityScore = 30; // Limited market
  
  // Calculate weighted final score
  const finalScore = Math.round(
    (marketPositionScore * 0.4) +
    (mileageScore * 0.25) +
    (priceTierScore * 0.2) +
    (marketActivityScore * 0.15)
  );
  
  // Determine rating
  let rating: 'excellent' | 'good' | 'fair' | 'poor';
  if (finalScore >= 85) rating = 'excellent';
  else if (finalScore >= 70) rating = 'good';
  else if (finalScore >= 50) rating = 'fair';
  else rating = 'poor';
  
  // Determine confidence based on market size
  let confidence: 'high' | 'medium' | 'low';
  if (marketSize >= 15) confidence = 'high';
  else if (marketSize >= 5) confidence = 'medium';
  else confidence = 'low';
  
  // Generate reasoning
  const priceDifference = marketAverage - listingPrice;
  const priceDifferencePercent = marketAverage > 0 ? (priceDifference / marketAverage) * 100 : 0;
  
  let reasoning = '';
  if (marketPosition === 'bottom_25') {
    reasoning = `Excellent deal - priced in bottom 25% of similar ${category.name.toLowerCase()}s`;
  } else if (marketPosition === 'lower_half') {
    reasoning = `Good deal - priced below market average for similar ${category.name.toLowerCase()}s`;
  } else if (marketPosition === 'upper_half') {
    reasoning = `Fair price - slightly above market average for similar ${category.name.toLowerCase()}s`;
  } else {
    reasoning = `Overpriced - in top 25% most expensive similar ${category.name.toLowerCase()}s`;
  }
  
  if (Math.abs(priceDifferencePercent) > 5) {
    reasoning += ` (${Math.abs(priceDifferencePercent).toFixed(1)}% ${priceDifference > 0 ? 'below' : 'above'} average)`;
  }
  
  return {
    score: Math.max(0, Math.min(100, finalScore)),
    rating,
    marketPosition,
    pricePercentile,
    marketAverage,
    priceDifference,
    priceDifferencePercent,
    reasoning,
    confidence,
    marketSize
  };
}

/**
 * Process cars with enhanced market data and deal scoring
 */
export function processCarsWithEnhancedMarketData(
  cars: CarData[]
): CarWithMarketData[] {
  return cars.map(car => {
    // Find similar vehicles for market analysis
    const similarCars = findSimilarVehicles(car, cars);
    
    // Calculate enhanced deal scores for each listing
    const listingsWithScores: ListingWithEnhancedScore[] = (car.listings || []).map(listing => ({
      ...listing,
      car,
      dealScore: calculateEnhancedDealScore(listing.price, car, similarCars)
    }));
    
    // Sort by deal score (best deals first)
    listingsWithScores.sort((a, b) => b.dealScore.score - a.dealScore.score);
    
    // Calculate market average from similar cars
    let marketAverage = 0;
    if (similarCars.length > 0) {
      const allPrices: number[] = [];
      similarCars.forEach(similarCar => {
        if (similarCar.listings) {
          similarCar.listings.forEach(listing => {
            allPrices.push(listing.price);
          });
        }
      });
      if (allPrices.length > 0) {
        marketAverage = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;
      }
    }
    
    // Calculate deal range
    if (listingsWithScores.length > 0) {
      const prices = listingsWithScores.map(l => l.price);
      const lowest = Math.min(...prices);
      const highest = Math.max(...prices);
      const spread = highest - lowest;
      
      return {
        ...car,
        listings: listingsWithScores,
        marketAverage,
        bestDeal: listingsWithScores[0],
        dealRange: {
          lowest,
          highest,
          spread
        }
      };
    }
    
    // Return car with empty listings if no listings found
    return {
      ...car,
      listings: [],
      marketAverage,
      bestDeal: {} as ListingWithEnhancedScore,
      dealRange: {
        lowest: 0,
        highest: 0,
        spread: 0
      }
    };
  });
}

/**
 * Get color for enhanced deal score
 */
export function getEnhancedDealScoreColor(score: number): string {
  if (score >= 85) return '#dc2626'; // accent red (excellent)
  if (score >= 70) return '#ef4444'; // light red (good)
  if (score >= 50) return '#f59e0b'; // amber (fair)
  return '#991b1b'; // dark red (poor)
}

/**
 * Get enhanced deal score rating text
 */
export function getEnhancedDealScoreText(score: number): string {
  if (score >= 85) return 'Excellent Deal';
  if (score >= 70) return 'Good Deal';
  if (score >= 50) return 'Fair Price';
  return 'Overpriced';
}

/**
 * Get market position display text
 */
export function getMarketPositionText(position: string): string {
  switch (position) {
    case 'bottom_25': return 'Bottom 25% (Great Deal)';
    case 'lower_half': return 'Lower Half (Good Deal)';
    case 'upper_half': return 'Upper Half (Fair Price)';
    case 'top_25': return 'Top 25% (Overpriced)';
    default: return 'Market Average';
  }
}
