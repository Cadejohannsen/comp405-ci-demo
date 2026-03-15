import React from "react";
import Link from "next/link";
import { Calendar, Gauge, Tag, TrendingDown, TrendingUp, Minus } from "lucide-react";
import DealScore from "./DealScore";
import { CarWithMarketData, ListingWithEnhancedScore } from "@/lib/enhanced-deal-scoring";

interface CarCardListingsProps {
  car: CarWithMarketData;
  maxListings?: number;
}

export default function CarCardListings({ car, maxListings = 3 }: CarCardListingsProps) {
  const listingsToShow = car.listings.slice(0, maxListings);
  const hasMoreListings = car.listings.length > maxListings;

  return (
    <Link href={`/car/${car.id}`} className="group block">
      <div className="border-4 border-black hover:border-black transition-colors bg-white overflow-hidden">
        {/* Header with car info */}
        <div className="p-4 border-b border-black/10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-heading text-xl font-bold uppercase tracking-tight">
                {car.year} {car.make}
              </h3>
              <p className="text-sm text-gray-700 uppercase tracking-wider">
                {car.model}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {car.bestDeal && (
                <DealScore 
                  score={car.bestDeal.dealScore.score} 
                  size="small" 
                  showText={false}
                />
              )}
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Best</p>
                <p className="text-lg font-bold text-accent">
                  ${car.dealRange.lowest.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge size={14} />
              <span>{car.mileage.toLocaleString()} mi</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag size={14} />
              <span className="capitalize">{car.bodyType}</span>
            </div>
          </div>
        </div>

        {/* Listings section */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm uppercase tracking-wider">
              Dealer Listings ({car.listings.length})
            </h4>
            {car.marketAverage > 0 && (
              <div className="text-xs text-muted-foreground">
                Market Avg: ${car.marketAverage.toLocaleString()}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {listingsToShow.map((listing, index) => (
              <ListingRow 
                key={listing.id} 
                listing={listing} 
                isBestDeal={index === 0 && car.bestDeal?.id === listing.id}
                marketAverage={car.marketAverage}
                carMileage={car.mileage}
              />
            ))}
          </div>

          {hasMoreListings && (
            <div className="text-center pt-2">
              <div className="text-xs text-gray-600 uppercase tracking-wider">
                +{car.listings.length - maxListings} more listings
              </div>
            </div>
          )}
        </div>

        {/* Footer with deal range */}
        {car.dealRange.spread > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between text-xs text-gray-700">
              <span>Market Avg:</span>
              <span className="flex items-center gap-2">
                ${car.marketAverage.toLocaleString()}
                {car.bestDeal && car.bestDeal.dealScore.priceDifferencePercent !== 0 && (
                  <span className={`text-xs font-medium ${
                    car.bestDeal.dealScore.priceDifferencePercent > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({Math.abs(car.bestDeal.dealScore.priceDifferencePercent).toFixed(1)}% {car.bestDeal.dealScore.priceDifferencePercent > 0 ? 'below' : 'above'} avg)
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-700 mt-1">
              <span>Price Range:</span>
              <span>
                ${car.dealRange.lowest.toLocaleString()} - ${car.dealRange.highest.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-700 mt-1">
              <span>Spread:</span>
              <span>${car.dealRange.spread.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

interface ListingRowProps {
  listing: ListingWithEnhancedScore;
  isBestDeal: boolean;
  marketAverage: number;
}

function ListingRow({ listing, isBestDeal, marketAverage, carMileage }: ListingRowProps & { carMileage: number }) {
  const priceVsMarket = marketAverage > 0 
    ? ((listing.price - marketAverage) / marketAverage) * 100 
    : 0;

  const priceIcon = priceVsMarket > 5 ? TrendingUp : priceVsMarket < -5 ? TrendingDown : Minus;
  const priceColor = priceVsMarket > 5 ? 'text-accent' : priceVsMarket < -5 ? 'text-accent-light' : 'text-muted-foreground';

  return (
    <div className={`p-4 rounded-lg border transition-all ${
      isBestDeal ? 'border-accent bg-gradient-to-r from-accent/5 to-accent/10 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      {/* Dealer name horizontal across top */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isBestDeal && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-accent to-accent-dark text-white border border-accent/20 shadow-sm">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.005 1.603-.921 1.902 0l1.07-3.292a1 1 0 00.364-1.118L16.453 8.91a1 1 0 00-.588-1.81h-3.462a1 1 0 00-.95-.69l-1.07-3.292z"/>
                </svg>
                Best Deal
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-accent">
              ${listing.price.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="w-full">
          <p className="font-medium text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded-md text-center">
            {listing.dealer.name}
          </p>
          <p className="text-xs text-gray-600 mt-1 text-center">
            {listing.dealer.location}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Gauge size={12} />
            <span>{carMileage.toLocaleString()} mi</span>
          </div>
          <div className="text-right">
            <DealScore 
              score={listing.dealScore.score} 
              size="small" 
              showText={false}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {React.createElement(priceIcon, { size: 12, className: priceColor })}
          <span className={`text-xs ${priceColor}`}>
            {Math.abs(priceVsMarket).toFixed(1)}%
          </span>
        </div>
      </div>
      {/* Enhanced deal info */}
      <div className="mt-1 flex items-center gap-1">
        {listing.dealScore.marketPosition === 'bottom_25' && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Excellent
          </span>
        )}
        {listing.dealScore.marketPosition === 'lower_half' && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Good Deal
          </span>
        )}
        {listing.dealScore.marketPosition === 'upper_half' && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z" clipRule="evenodd"/>
            </svg>
            Fair Price
          </span>
        )}
        {listing.dealScore.marketPosition === 'top_25' && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            Overpriced
          </span>
        )}
        {listing.dealScore.confidence === 'low' && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            Limited Data
          </span>
        )}
      </div>
    </div>
  );
}
