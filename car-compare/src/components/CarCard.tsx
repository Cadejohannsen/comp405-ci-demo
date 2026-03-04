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
      <div className="border-2 border-black/10 hover:border-black transition-colors bg-white overflow-hidden">
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

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-heading text-xl font-bold uppercase tracking-tight">
                {year} {make}
              </h3>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {model}
              </p>
            </div>
            {lowestPrice && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  From
                </p>
                <p className="font-heading text-xl font-bold">
                  ${lowestPrice.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-3 border-t">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider">
              <Gauge size={14} />
              {mileage.toLocaleString()} mi
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider">
              <Calendar size={14} />
              {year}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider">
              <Tag size={14} />
              {bodyType}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
