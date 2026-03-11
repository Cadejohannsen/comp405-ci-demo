"use client";

import { useState } from "react";
import { ExternalLink, TrendingDown, TrendingUp, Copy, Check } from "lucide-react";

interface ListingWithDealer {
  id: string;
  price: number;
  url?: string | null;
  scrapedAt: string;
  dealer: {
    id: string;
    name: string;
    location: string;
    website?: string | null;
  };
}

interface PriceComparisonProps {
  listings: ListingWithDealer[];
}

export default function PriceComparison({ listings }: PriceComparisonProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyDealerInfo = async (listing: ListingWithDealer) => {
    const dealerInfo = `${listing.dealer.name}\n${listing.dealer.location}\n${listing.dealer.website || 'No website'}\n\nPrice: $${listing.price.toLocaleString()}`;
    
    try {
      await navigator.clipboard.writeText(dealerInfo);
      setCopiedId(listing.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (listings.length === 0) {
    return (
      <div className="border-2 border-black/10 p-8 text-center">
        <p className="font-heading text-xl font-bold uppercase mb-2">
          No listings available
        </p>
        <p className="text-muted-foreground text-sm">
          Check back soon for dealer pricing
        </p>
      </div>
    );
  }

  const sorted = [...listings].sort((a, b) => a.price - b.price);
  const lowestPrice = sorted[0].price;
  const highestPrice = sorted[sorted.length - 1].price;
  const avgPrice = sorted.reduce((sum, l) => sum + l.price, 0) / sorted.length;

  return (
    <div>
      <div className="text-sm text-muted-foreground mb-4">
        <p>💡 <strong>Note:</strong> External links go to dealer websites. Some sites may be unavailable - use the copy button to save dealer info.</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border-2 border-black p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
            <TrendingDown size={16} />
            <span className="text-xs uppercase tracking-wider font-medium">
              Lowest
            </span>
          </div>
          <p className="font-heading text-2xl font-bold">
            ${lowestPrice.toLocaleString()}
          </p>
        </div>
        <div className="border-2 border-black/20 p-4 text-center">
          <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">
            Average
          </p>
          <p className="font-heading text-2xl font-bold">
            ${Math.round(avgPrice).toLocaleString()}
          </p>
        </div>
        <div className="border-2 border-black/20 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs uppercase tracking-wider font-medium">
              Highest
            </span>
          </div>
          <p className="font-heading text-2xl font-bold">
            ${highestPrice.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="border-2 border-black">
        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 py-3 bg-black text-white">
          <span className="text-xs font-medium uppercase tracking-wider">
            Dealer
          </span>
          <span className="text-xs font-medium uppercase tracking-wider">
            Location
          </span>
          <span className="text-xs font-medium uppercase tracking-wider">
            Price
          </span>
          <span className="text-xs font-medium uppercase tracking-wider">
            Actions
          </span>
        </div>
        {sorted.map((listing, i) => {
          const savings = listing.price - lowestPrice;
          return (
            <div
              key={listing.id}
              className={`grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 py-4 items-center ${
                i !== sorted.length - 1 ? "border-b" : ""
              } ${i === 0 ? "bg-green-50" : ""}`}
            >
              <div>
                <p className="font-medium text-sm">{listing.dealer.name}</p>
                {i === 0 && (
                  <span className="text-xs text-green-600 font-medium uppercase">
                    Best Price
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {listing.dealer.location}
              </p>
              <div className="text-right">
                <p className="font-heading text-lg font-bold">
                  ${listing.price.toLocaleString()}
                </p>
                {savings > 0 && (
                  <p className="text-xs text-red-500">
                    +${savings.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                {listing.url ? (
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Visit ${listing.dealer.name} website`}
                    className="flex items-center justify-center w-8 h-8 border border-black/20 hover:bg-black hover:text-white transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 border border-black/10 text-muted-foreground">
                    <ExternalLink size={14} />
                  </div>
                )}
                <button
                  onClick={() => copyDealerInfo(listing)}
                  title={`Copy ${listing.dealer.name} info`}
                  className="flex items-center justify-center w-8 h-8 border border-black/20 hover:bg-black hover:text-white transition-colors"
                >
                  {copiedId === listing.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
