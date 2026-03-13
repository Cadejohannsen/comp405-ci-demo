import SearchBar from "@/components/SearchBar";
import CarGrid from "@/components/CarGrid";
import FilterSidebar from "@/components/FilterSidebar";
import { prisma } from "@/lib/prisma";
import { processCarsWithMarketData } from "@/lib/deal-scoring";

interface SearchPageProps {
  searchParams: {
    q?: string;
    make?: string;
    model?: string;
    yearMin?: string;
    yearMax?: string;
    bodyType?: string;
    priceMin?: string;
    priceMax?: string;
    maxMileage?: string;
    sort?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const where: Record<string, unknown> = {};

  // Handle text search (q parameter)
  if (searchParams.q) {
    where.OR = [
      { make: { contains: searchParams.q } },
      { model: { contains: searchParams.q } },
    ];
  }
  
  // Handle individual filters from sidebar
  if (searchParams.make) {
    where.make = { contains: searchParams.make };
  }
  if (searchParams.model) {
    where.model = { contains: searchParams.model };
  }
  if (searchParams.yearMin || searchParams.yearMax) {
    where.year = {
      ...(searchParams.yearMin ? { gte: parseInt(searchParams.yearMin) } : {}),
      ...(searchParams.yearMax ? { lte: parseInt(searchParams.yearMax) } : {}),
    };
  }
  if (searchParams.bodyType) {
    where.bodyType = searchParams.bodyType;
  }
  if (searchParams.maxMileage) {
    where.mileage = { lte: parseInt(searchParams.maxMileage) };
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (searchParams.sort) {
    case "price_asc":
    case "price_desc":
      break;
    case "mileage_asc":
      orderBy = { mileage: "asc" };
      break;
    case "year_desc":
      orderBy = { year: "desc" };
      break;
    case "year_asc":
      orderBy = { year: "asc" };
      break;
  }

  let cars = await prisma.car.findMany({
    where,
    include: { 
      listings: {
        include: { dealer: true }
      }
    },
    orderBy,
  });

  if (searchParams.priceMin || searchParams.priceMax) {
    const priceMin = searchParams.priceMin
      ? parseFloat(searchParams.priceMin)
      : 0;
    const priceMax = searchParams.priceMax
      ? parseFloat(searchParams.priceMax)
      : Infinity;
    cars = cars.filter((car) => {
      if (car.listings.length === 0) return false;
      const minPrice = Math.min(...car.listings.map((l) => l.price));
      return minPrice >= priceMin && minPrice <= priceMax;
    });
  }

  // Process cars with market data and deal scoring
  const carsWithMarketData = processCarsWithMarketData(cars);

  // Apply deal score sorting if requested
  if (searchParams.sort === "price_asc") {
    carsWithMarketData.sort((a, b) => {
      const aMin = a.dealRange.lowest || Infinity;
      const bMin = b.dealRange.lowest || Infinity;
      return aMin - bMin;
    });
  } else if (searchParams.sort === "price_desc") {
    carsWithMarketData.sort((a, b) => {
      const aMin = a.dealRange.lowest || 0;
      const bMin = b.dealRange.lowest || 0;
      return bMin - aMin;
    });
  } else if (searchParams.sort === "deal_score") {
    carsWithMarketData.sort((a, b) => (b.bestDeal?.dealScore.score || 0) - (a.bestDeal?.dealScore.score || 0));
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-12">
        <h1 className="font-heading text-6xl md:text-7xl font-bold uppercase tracking-tight mb-6">
          Search Cars
        </h1>
        <SearchBar
          initialQuery={searchParams.q}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">
            {carsWithMarketData.length} {carsWithMarketData.length === 1 ? "result" : "results"} found
          </p>
          <CarGrid cars={carsWithMarketData} />
        </div>
      </div>
    </div>
  );
}
