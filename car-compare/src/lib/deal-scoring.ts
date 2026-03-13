// Define interfaces locally to avoid circular dependency
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

export interface DealScore {
  score: number; // 0-100
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  marketAverage: number;
  priceDifference: number;
  priceDifferencePercent: number;
  reasoning: string;
}

export interface ListingWithScore extends ListingWithDealer {
  dealScore: DealScore;
}

export interface CarWithMarketData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  bodyType: string;
  imageUrl?: string | null;
  listings: ListingWithScore[];
  marketAverage: number;
  bestDeal: ListingWithScore;
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

/**
 * Calculate market average price for a specific car model
 */
export function calculateMarketAverage(
  make: string,
  model: string,
  year: number,
  allCars: CarData[]
): number {
  const similarCars = allCars.filter(
    car => car.make === make && car.model === model && car.year === year
  );

  if (similarCars.length === 0) return 0;

  // Get all listings for similar cars
  const allPrices: number[] = [];
  similarCars.forEach(car => {
    if (car.listings) {
      car.listings.forEach((listing: ListingWithDealer) => {
        allPrices.push(listing.price);
      });
    }
  });

  if (allPrices.length === 0) return 0;

  const sum = allPrices.reduce((acc, price) => acc + price, 0);
  return sum / allPrices.length;
}

/**
 * Calculate deal score based on price comparison to market average
 */
export function calculateDealScore(
  listingPrice: number,
  marketAverage: number,
  carMileage: number,
  averageMileage?: number
): DealScore {
  if (marketAverage === 0) {
    return {
      score: 50,
      rating: 'fair',
      marketAverage,
      priceDifference: 0,
      priceDifferencePercent: 0,
      reasoning: 'Insufficient market data'
    };
  }

  const priceDifference = marketAverage - listingPrice;
  const priceDifferencePercent = (priceDifference / marketAverage) * 100;

  // Base score from price difference
  const baseScore = 50 + priceDifferencePercent;

  // Mileage adjustment (lower mileage = better deal)
  const mileageAdjustment = averageMileage 
    ? ((averageMileage - carMileage) / averageMileage) * 10
    : 0;

  // Final score with bounds
  let finalScore = Math.round(baseScore + mileageAdjustment);
  finalScore = Math.max(0, Math.min(100, finalScore));

  // Determine rating
  let rating: 'excellent' | 'good' | 'fair' | 'poor';
  if (finalScore >= 80) rating = 'excellent';
  else if (finalScore >= 60) rating = 'good';
  else if (finalScore >= 40) rating = 'fair';
  else rating = 'poor';

  // Generate reasoning
  let reasoning = '';
  if (priceDifferencePercent > 10) {
    reasoning = `Significantly below market average by ${Math.abs(priceDifferencePercent).toFixed(1)}%`;
  } else if (priceDifferencePercent > 5) {
    reasoning = `Below market average by ${Math.abs(priceDifferencePercent).toFixed(1)}%`;
  } else if (priceDifferencePercent < -5) {
    reasoning = `Above market average by ${Math.abs(priceDifferencePercent).toFixed(1)}%`;
  } else {
    reasoning = 'Near market average price';
  }

  return {
    score: finalScore,
    rating,
    marketAverage,
    priceDifference,
    priceDifferencePercent,
    reasoning
  };
}

/**
 * Get average mileage for a car model/year
 */
export function getAverageMileage(
  make: string,
  model: string,
  year: number,
  allCars: CarData[]
): number {
  const similarCars = allCars.filter(
    car => car.make === make && car.model === model && car.year === year
  );

  if (similarCars.length === 0) return 50000; // Default average

  const totalMileage = similarCars.reduce((acc, car) => acc + car.mileage, 0);
  return totalMileage / similarCars.length;
}

/**
 * Process car data with market analysis and deal scoring
 */
export function processCarsWithMarketData(
  cars: CarData[]
): CarWithMarketData[] {
  // Calculate market averages for all cars
  const marketAverages = new Map<string, number>();
  
  cars.forEach(car => {
    const key = `${car.make}-${car.model}-${car.year}`;
    if (!marketAverages.has(key)) {
      const similarCars = cars.filter(
        c => c.make === car.make && c.model === car.model && c.year === car.year
      );
      
      const allPrices: number[] = [];
      similarCars.forEach(similarCar => {
        if (similarCar.listings) {
          similarCar.listings.forEach((listing: ListingWithDealer) => {
            allPrices.push(listing.price);
          });
        }
      });
      
      if (allPrices.length > 0) {
        const average = allPrices.reduce((acc, price) => acc + price, 0) / allPrices.length;
        marketAverages.set(key, average);
      }
    }
  });

  return cars.map(car => {
    // Get listings for this car
    const carListings = car.listings || [];

    // Calculate market average
    const key = `${car.make}-${car.model}-${car.year}`;
    const marketAverage = marketAverages.get(key) || 0;

    // Get average mileage for scoring
    const averageMileage = getAverageMileage(
      car.make,
      car.model,
      car.year,
      cars
    );

    // Calculate deal scores for each listing
    const listingsWithScores: ListingWithScore[] = carListings.map((listing: ListingWithDealer) => ({
      ...listing,
      car,
      dealScore: calculateDealScore(
        listing.price,
        marketAverage,
        car.mileage,
        averageMileage
      )
    }));

    // Sort by deal score (best deals first)
    listingsWithScores.sort((a, b) => b.dealScore.score - a.dealScore.score);

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
      bestDeal: {} as ListingWithScore,
      dealRange: {
        lowest: 0,
        highest: 0,
        spread: 0
      }
    };
  });
}

/**
 * Get color for deal score
 */
export function getDealScoreColor(score: number): string {
  if (score >= 80) return '#dc2626'; // accent red
  if (score >= 60) return '#ef4444'; // light red
  if (score >= 40) return '#f59e0b'; // amber
  return '#991b1b'; // dark red
}

/**
 * Get deal score rating text
 */
export function getDealScoreText(score: number): string {
  if (score >= 80) return 'Excellent Deal';
  if (score >= 60) return 'Good Deal';
  if (score >= 40) return 'Fair Price';
  return 'Overpriced';
}
