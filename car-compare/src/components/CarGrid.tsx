import CarCard from "./CarCard";

interface CarWithListings {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  bodyType: string;
  imageUrl?: string | null;
  listings: { price: number }[];
}

interface CarGridProps {
  cars: CarWithListings[];
}

export default function CarGrid({ cars }: CarGridProps) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-heading text-3xl font-bold uppercase mb-2">
          No cars found
        </p>
        <p className="text-muted-foreground">
          Try adjusting your search filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => {
        const lowestPrice =
          car.listings.length > 0
            ? Math.min(...car.listings.map((l) => l.price))
            : undefined;
        return (
          <CarCard
            key={car.id}
            id={car.id}
            make={car.make}
            model={car.model}
            year={car.year}
            mileage={car.mileage}
            bodyType={car.bodyType}
            imageUrl={car.imageUrl}
            lowestPrice={lowestPrice}
            listingCount={car.listings.length}
          />
        );
      })}
    </div>
  );
}
