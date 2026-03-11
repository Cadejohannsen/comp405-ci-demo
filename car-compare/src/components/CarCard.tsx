import Link from "next/link";
import { Calendar, Gauge, Tag } from "lucide-react";

interface CarCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  bodyType: string;
  imageUrl?: string | null;
  lowestPrice?: number;
  listingCount?: number;
}

export default function CarCard({
  id,
  make,
  model,
  year,
  mileage,
  bodyType,
  imageUrl,
  lowestPrice,
  listingCount,
}: CarCardProps) {
  return (
    <Link href={`/car/${id}`} className="group block">
      <div className="border-2 border-black/10 hover:border-black transition-colors bg-background overflow-hidden">
        <div className="aspect-[16/10] bg-muted relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${year} ${make} ${model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="font-heading text-3xl font-bold uppercase">
                  {make}
                </p>
                <p className="text-sm uppercase tracking-wider mt-1">
                  {model}
                </p>
              </div>
            </div>
          )}
          {listingCount && listingCount > 0 && (
            <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
              {listingCount} {listingCount === 1 ? "dealer" : "dealers"}
            </div>
          )}
        </div>

        <div className="car-card-content p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-heading text-xl font-bold uppercase tracking-tight">
                {year} {make}
              </h3>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {model}
              </p>
            </div>
            {listingCount && listingCount > 0 && (
              <div className="bg-accent text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
                {listingCount} listing{listingCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge size={14} />
              <span>{mileage.toLocaleString()} mi</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag size={14} />
              <span className="capitalize">{bodyType}</span>
            </div>
          </div>

          {lowestPrice && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Starting at
                </p>
                <p className="font-heading text-2xl font-bold">
                  ${lowestPrice.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
