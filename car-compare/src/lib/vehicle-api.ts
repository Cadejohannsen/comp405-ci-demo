// Vehicle API Service - fetches real automotive data from NHTSA (free, no key needed)

const NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api";

export interface VehicleModel {
  Make_Name: string;
  Model_Name: string;
}

export interface DecodedVehicle {
  make: string;
  model: string;
  year: number;
  bodyClass: string;
  transmission: string;
  driveType: string;
  fuelType: string;
  engineCylinders: string;
  displacementL: string;
}

// Rate limiter to respect API limits
class RateLimiter {
  private timestamps: number[] = [];
  private maxPerMinute: number;

  constructor(maxPerMinute: number) {
    this.maxPerMinute = maxPerMinute;
  }

  async wait(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < 60000);
    if (this.timestamps.length >= this.maxPerMinute) {
      const oldest = this.timestamps[0];
      const waitMs = 60000 - (now - oldest) + 100;
      await new Promise((r) => setTimeout(r, waitMs));
    }
    this.timestamps.push(Date.now());
  }
}

const nhtsaLimiter = new RateLimiter(80);

// Retry with exponential backoff
async function retryFetch<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error("retryFetch: should not reach here");
}

// Fetch all models for a make + year from NHTSA
export async function getModelsForMakeYear(
  make: string,
  year: number
): Promise<VehicleModel[]> {
  await nhtsaLimiter.wait();
  return retryFetch(async () => {
    const res = await fetch(
      `${NHTSA_BASE}/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`
    );
    if (!res.ok) throw new Error(`NHTSA ${res.status}`);
    const json = await res.json();
    return (json.Results ?? []) as VehicleModel[];
  });
}

// Decode a VIN to get vehicle details
export async function decodeVIN(vin: string): Promise<DecodedVehicle | null> {
  await nhtsaLimiter.wait();
  return retryFetch(async () => {
    const res = await fetch(
      `${NHTSA_BASE}/vehicles/DecodeVin/${vin}?format=json`
    );
    if (!res.ok) throw new Error(`NHTSA ${res.status}`);
    const json = await res.json();
    const map: Record<string, string> = {};
    for (const r of json.Results ?? []) {
      if (r.Value) map[r.Variable] = r.Value;
    }
    return {
      make: map["Make"] ?? "",
      model: map["Model"] ?? "",
      year: parseInt(map["Model Year"] ?? "0"),
      bodyClass: map["Body Class"] ?? "",
      transmission: map["Transmission Style"] ?? "",
      driveType: map["Drive Type"] ?? "",
      fuelType: map["Fuel Type - Primary"] ?? "",
      engineCylinders: map["Engine Number of Cylinders"] ?? "",
      displacementL: map["Displacement (L)"] ?? "",
    };
  });
}

// Map NHTSA body class strings to our simpler body types
export function normalizeBodyType(nhtsaBodyClass: string): string {
  const lower = nhtsaBodyClass.toLowerCase();
  if (lower.includes("sedan") || lower.includes("saloon")) return "Sedan";
  if (lower.includes("suv") || lower.includes("sport utility")) return "SUV";
  if (lower.includes("pickup") || lower.includes("truck")) return "Truck";
  if (lower.includes("coupe")) return "Coupe";
  if (lower.includes("convertible") || lower.includes("cabriolet")) return "Convertible";
  if (lower.includes("hatchback")) return "Hatchback";
  if (lower.includes("van") || lower.includes("minivan")) return "Minivan";
  if (lower.includes("wagon")) return "Wagon";
  if (lower.includes("crossover")) return "SUV";
  return "Sedan"; // fallback
}

// Generate realistic pricing
export function generatePrice(
  make: string,
  year: number,
  bodyType: string,
  mileage: number
): number {
  const age = new Date().getFullYear() - year;
  const basePrices: Record<string, number> = {
    BMW: 45000, "Mercedes-Benz": 50000, Audi: 42000, Lexus: 40000,
    Acura: 35000, Infiniti: 38000, Cadillac: 40000, Lincoln: 38000,
    Genesis: 42000, Tesla: 55000, Volvo: 42000, Porsche: 80000,
    "Land Rover": 60000, Jaguar: 55000,
    Toyota: 28000, Honda: 26000, Ford: 32000, Chevrolet: 30000,
    Nissan: 27000, Hyundai: 25000, Kia: 24000, Mazda: 27000,
    Subaru: 29000, Volkswagen: 28000, Mitsubishi: 23000,
    Ram: 40000, Jeep: 35000, GMC: 38000, Buick: 32000,
    Dodge: 30000, Chrysler: 28000, FIAT: 18000,
  };
  let base = basePrices[make] || 26000;

  const bodyMult: Record<string, number> = {
    Sedan: 1.0, SUV: 1.3, Truck: 1.4, Coupe: 1.1,
    Convertible: 1.2, Hatchback: 0.9, Minivan: 1.25, Wagon: 1.05,
  };
  base *= bodyMult[bodyType] || 1.0;
  base *= Math.pow(0.85, age); // 15% depreciation/yr
  const expectedMi = age * 12000;
  base *= Math.max(0.7, 1 - (mileage - expectedMi) / 100000);
  base *= 0.92 + Math.random() * 0.16; // +/- ~8%
  return Math.round(Math.max(base, 3500) / 100) * 100;
}

// Generate realistic mileage
export function generateMileage(year: number): number {
  const age = new Date().getFullYear() - year;
  const base = age * 12000;
  return Math.max(0, Math.floor(base * (0.7 + Math.random() * 0.6)));
}
