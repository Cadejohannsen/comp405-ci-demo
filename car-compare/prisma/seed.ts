// @ts-nocheck
/* eslint-disable */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.listing.deleteMany();
  await prisma.car.deleteMany();
  await prisma.dealer.deleteMany();

  // Create dealers
  const dealers = await Promise.all([
    prisma.dealer.create({
      data: {
        name: "AutoNation Ford",
        location: "Dallas, TX",
        website: "https://www.autonation.com",
      },
    }),
    prisma.dealer.create({
      data: {
        name: "Hendrick Toyota",
        location: "Charlotte, NC",
        website: "https://www.hendricktoyota.com",
      },
    }),
    prisma.dealer.create({
      data: {
        name: "Penske Honda",
        location: "Indianapolis, IN",
        website: "https://www.penskeautomotive.com",
      },
    }),
    prisma.dealer.create({
      data: {
        name: "Sewell BMW",
        location: "Dallas, TX",
        website: "https://www.sewell.com",
      },
    }),
    prisma.dealer.create({
      data: {
        name: "Park Place Mercedes",
        location: "Dallas, TX",
        website: "https://www.parkplace.com",
      },
    }),
    prisma.dealer.create({
      data: {
        name: "Larry H. Miller Chevrolet",
        location: "Salt Lake City, UT",
        website: "https://www.lhm.com",
      },
    }),
    prisma.dealer.create({
      data: {
        name: "Galpin Motors",
        location: "Los Angeles, CA",
        website: "https://www.galpin.com",
      },
    }),
    prisma.dealer.create({
      data: {
        name: "Carvana",
        location: "Phoenix, AZ",
        website: "https://www.carvana.com",
      },
    }),
  ]);

  // Car data with multiple listings per car
  const carsData = [
    {
      make: "Toyota",
      model: "Camry SE",
      year: 2023,
      mileage: 12500,
      bodyType: "Sedan",
      imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
      prices: [28500, 29200, 27800, 30100],
      dealerIndices: [1, 7, 6, 0],
    },
    {
      make: "Honda",
      model: "Civic Sport",
      year: 2024,
      mileage: 3200,
      bodyType: "Sedan",
      imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19ba27a5?w=600",
      prices: [26800, 27500, 25900],
      dealerIndices: [2, 7, 6],
    },
    {
      make: "Ford",
      model: "F-150 XLT",
      year: 2023,
      mileage: 18700,
      bodyType: "Truck",
      imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600",
      prices: [42500, 44200, 41800, 45000, 43100],
      dealerIndices: [0, 5, 6, 7, 1],
    },
    {
      make: "BMW",
      model: "330i xDrive",
      year: 2023,
      mileage: 8900,
      bodyType: "Sedan",
      imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600",
      prices: [45200, 43800, 46500],
      dealerIndices: [3, 7, 4],
    },
    {
      make: "Tesla",
      model: "Model 3 Long Range",
      year: 2024,
      mileage: 1200,
      bodyType: "Sedan",
      imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600",
      prices: [42900, 44100, 41500],
      dealerIndices: [7, 6, 0],
    },
    {
      make: "Chevrolet",
      model: "Tahoe LT",
      year: 2023,
      mileage: 22000,
      bodyType: "SUV",
      imageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600",
      prices: [52800, 54500, 51200, 55900],
      dealerIndices: [5, 0, 7, 6],
    },
    {
      make: "Mercedes-Benz",
      model: "C300 4MATIC",
      year: 2024,
      mileage: 4500,
      bodyType: "Sedan",
      imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600",
      prices: [48900, 47200, 50100],
      dealerIndices: [4, 7, 3],
    },
    {
      make: "Jeep",
      model: "Grand Cherokee Limited",
      year: 2023,
      mileage: 15800,
      bodyType: "SUV",
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600",
      prices: [44200, 42800, 45600, 43500],
      dealerIndices: [0, 7, 6, 5],
    },
    {
      make: "Subaru",
      model: "Outback Premium",
      year: 2024,
      mileage: 6200,
      bodyType: "Wagon",
      imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600",
      prices: [34500, 33200, 35800],
      dealerIndices: [2, 7, 6],
    },
    {
      make: "Audi",
      model: "Q5 Premium Plus",
      year: 2023,
      mileage: 11200,
      bodyType: "SUV",
      imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600",
      prices: [47800, 46200, 49500],
      dealerIndices: [3, 7, 4],
    },
    {
      make: "Toyota",
      model: "RAV4 XLE",
      year: 2024,
      mileage: 2800,
      bodyType: "SUV",
      imageUrl: "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=600",
      prices: [33200, 34800, 32500, 35100],
      dealerIndices: [1, 0, 7, 6],
    },
    {
      make: "Ford",
      model: "Mustang GT",
      year: 2024,
      mileage: 1500,
      bodyType: "Coupe",
      imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=600",
      prices: [44900, 46200, 43500],
      dealerIndices: [0, 6, 7],
    },
    {
      make: "Hyundai",
      model: "Tucson SEL",
      year: 2024,
      mileage: 5100,
      bodyType: "SUV",
      imageUrl: "https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=600",
      prices: [31200, 29800, 32500],
      dealerIndices: [7, 6, 2],
    },
    {
      make: "Nissan",
      model: "Altima SR",
      year: 2023,
      mileage: 19500,
      bodyType: "Sedan",
      imageUrl: "https://images.unsplash.com/photo-1625231334401-6f3ae8cde8b0?w=600",
      prices: [24800, 25500, 23900],
      dealerIndices: [1, 0, 7],
    },
    {
      make: "Kia",
      model: "Telluride SX",
      year: 2024,
      mileage: 3800,
      bodyType: "SUV",
      imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600",
      prices: [47500, 46200, 48800, 45900],
      dealerIndices: [7, 2, 6, 5],
    },
    {
      make: "Dodge",
      model: "Charger R/T",
      year: 2023,
      mileage: 14200,
      bodyType: "Sedan",
      imageUrl: "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=600",
      prices: [38900, 40200, 37500],
      dealerIndices: [0, 6, 7],
    },
    {
      make: "Volkswagen",
      model: "Jetta GLI",
      year: 2024,
      mileage: 2100,
      bodyType: "Sedan",
      imageUrl: "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=600",
      prices: [31500, 30800, 32200],
      dealerIndices: [3, 7, 6],
    },
    {
      make: "Lexus",
      model: "RX 350 Premium",
      year: 2024,
      mileage: 4800,
      bodyType: "SUV",
      imageUrl: "https://images.unsplash.com/photo-1622836845016-25d79e0a9f9f?w=600",
      prices: [52800, 51200, 54500],
      dealerIndices: [4, 7, 3],
    },
  ];

  for (const carData of carsData) {
    const car = await prisma.car.create({
      data: {
        make: carData.make,
        model: carData.model,
        year: carData.year,
        mileage: carData.mileage,
        bodyType: carData.bodyType,
        imageUrl: carData.imageUrl,
      },
    });

    for (let i = 0; i < carData.prices.length; i++) {
      await prisma.listing.create({
        data: {
          price: carData.prices[i],
          url: dealers[carData.dealerIndices[i]].website || undefined,
          carId: car.id,
          dealerId: dealers[carData.dealerIndices[i]].id,
        },
      });
    }
  }

  console.log("Seed complete: 18 cars with multiple dealer listings created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
