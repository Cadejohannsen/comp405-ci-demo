import CarCardListings from "./CarCardListings";
import { CarWithMarketData } from "@/lib/deal-scoring";

interface CarGridProps {
  cars: CarWithMarketData[];
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {cars.map((car) => (
        <CarCardListings
          key={car.id}
          car={car}
          maxListings={3}
        />
      ))}
    </div>
  );
}
