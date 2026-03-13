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
            {car.bestDeal && (
              <DealScore 
                score={car.bestDeal.dealScore.score} 
                size="small" 
                showText={false}
              />
            )}
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

function ListingRow({ listing, isBestDeal, marketAverage }: ListingRowProps) {
  const priceVsMarket = marketAverage > 0 
    ? ((listing.price - marketAverage) / marketAverage) * 100 
    : 0;

  const priceIcon = priceVsMarket > 5 ? TrendingUp : priceVsMarket < -5 ? TrendingDown : Minus;
  const priceColor = priceVsMarket > 5 ? 'text-accent' : priceVsMarket < -5 ? 'text-accent-light' : 'text-muted-foreground';

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${
      isBestDeal ? 'border-accent bg-accent/5' : 'border-2 bg-gray-50'
    }`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {listing.dealer.name}
          </span>
          {isBestDeal && (
            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              Best Deal
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>{listing.dealer.location}</span>
          <span>•</span>
          <span>${listing.price.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <DealScore 
            score={listing.dealScore.score} 
            size="small" 
            showText={false}
          />
        </div>
        <div className="flex items-center gap-1">
          {React.createElement(priceIcon, { size: 12, className: priceColor })}
          <span className={`text-xs ${priceColor}`}>
            {Math.abs(priceVsMarket).toFixed(1)}%
          </span>
        </div>
      </div>
      {/* Enhanced deal info */}
      <div className="text-xs text-gray-500 mt-1">
        {listing.dealScore.marketPosition === 'bottom_25' && '🔥 Excellent Deal'}
        {listing.dealScore.marketPosition === 'lower_half' && '✅ Good Deal'}
        {listing.dealScore.marketPosition === 'upper_half' && '⚖️ Fair Price'}
        {listing.dealScore.marketPosition === 'top_25' && '⚠️ Overpriced'}
        {listing.dealScore.confidence === 'low' && ' (Limited data)'}
      </div>
    </div>
  );
}
