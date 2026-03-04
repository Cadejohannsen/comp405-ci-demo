import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PriceComparison from "@/components/PriceComparison";
import Link from "next/link";
import { ArrowLeft, Calendar, Gauge, Tag } from "lucide-react";

interface CarDetailPageProps {
  params: { id: string };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: {
      listings: {
        include: { dealer: true },
        orderBy: { price: "asc" },
      },
    },
  });

  if (!car) return notFound();

  const listings = car.listings.map((l) => ({
    ...l,
    scrapedAt: l.scrapedAt.toISOString(),
  }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-black transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 mb-12">
        <div className="aspect-[4/3] bg-muted border-2 border-black/10 overflow-hidden">
          {car.imageUrl ? (
            <img
              src={car.imageUrl}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="font-heading text-5xl font-bold uppercase">
                  {car.make}
                </p>
                <p className="text-lg uppercase tracking-wider text-muted-foreground mt-2">
                  {car.model}
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
            {car.bodyType}
          </p>
          <h1 className="font-heading text-5xl font-bold uppercase tracking-tight mb-2">
            {car.year} {car.make}
          </h1>
          <p className="font-heading text-3xl font-bold uppercase tracking-tight text-muted-foreground mb-6">
            {car.model}
          </p>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Gauge size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">
                {car.mileage.toLocaleString()} miles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">{car.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">{car.bodyType}</span>
            </div>
          </div>

          {car.listings.length > 0 && (
            <div className="border-2 border-black p-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Starting from
              </p>
              <p className="font-heading text-4xl font-bold">
                $
                {Math.min(
                  ...car.listings.map((l) => l.price)
                ).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                across {car.listings.length}{" "}
                {car.listings.length === 1 ? "dealer" : "dealers"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight mb-6">
          Price Comparison
        </h2>
        <PriceComparison listings={listings} />
      </div>
    </div>
  );
}
