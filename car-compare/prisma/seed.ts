// @ts-nocheck
/* eslint-disable */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ── Oregon Dealerships ──────────────────────────────────────────────────
const DEALERS = [
  // Portland Metro
  { name: "Lithia Toyota of Portland",      location: "Portland, OR",      lat: 45.5152, lng: -122.6784, website: "https://www.lithiatoyotaofportland.com" },
  { name: "Ron Tonkin Honda",               location: "Portland, OR",      lat: 45.5231, lng: -122.5589, website: "https://www.rontonkinhonda.com" },
  { name: "Kuni BMW",                       location: "Beaverton, OR",     lat: 45.4871, lng: -122.7968, website: "https://www.kunibmw.com" },
  { name: "Carr Subaru",                    location: "Beaverton, OR",     lat: 45.4865, lng: -122.8021, website: "https://www.carrsubaru.com" },
  { name: "Courtesy Ford Lincoln",          location: "Portland, OR",      lat: 45.4994, lng: -122.5703, website: "https://www.courtesyfordlincoln.com" },
  { name: "Dick Hannah Chevrolet",          location: "Vancouver, WA",     lat: 45.6387, lng: -122.6511, website: "https://www.dickhannahchevy.com" },
  { name: "Wentworth Subaru",               location: "Portland, OR",      lat: 45.4721, lng: -122.7284, website: "https://www.wentworthsubaru.com" },
  { name: "Tonkin Hillsboro Hyundai",       location: "Hillsboro, OR",     lat: 45.5229, lng: -122.9898, website: "https://www.tonkinhyundai.com" },
  // Eugene / Springfield
  { name: "Kendall Toyota of Eugene",       location: "Eugene, OR",        lat: 44.0521, lng: -123.0868, website: "https://www.kendalltoyota.com" },
  { name: "Chambers Auto Group",            location: "Eugene, OR",        lat: 44.0579, lng: -123.0183, website: "https://www.chambersford.com" },
  { name: "Lithia Honda of Eugene",         location: "Eugene, OR",        lat: 44.0443, lng: -123.0747, website: "https://www.lithiahondaofeugene.com" },
  // Salem
  { name: "Power Honda of Salem",           location: "Salem, OR",         lat: 44.9429, lng: -123.0351, website: "https://www.powerhondaofsalem.com" },
  { name: "Capitol Toyota",                 location: "Salem, OR",         lat: 44.9561, lng: -123.0249, website: "https://www.capitoltoyota.com" },
  // Bend
  { name: "Smolich Chevrolet Bend",         location: "Bend, OR",          lat: 44.0582, lng: -121.3028, website: "https://www.smolichchevy.com" },
  { name: "Kendall Ford of Bend",           location: "Bend, OR",          lat: 44.0615, lng: -121.2984, website: "https://www.kendallfordbend.com" },
  // Medford / Southern Oregon
  { name: "Lithia Chrysler Jeep Dodge Medford", location: "Medford, OR",   lat: 42.3265, lng: -122.8760, website: "https://www.lithiacjd.com" },
  { name: "Southern Oregon Subaru",         location: "Medford, OR",       lat: 42.3222, lng: -122.8624, website: "https://www.southernoregonsubaru.com" },
  // Corvallis
  { name: "Corvallis Toyota",               location: "Corvallis, OR",     lat: 44.5646, lng: -123.2620, website: "https://www.corvallistoyota.com" },
  // Albany
  { name: "Lassen Chevrolet",               location: "Albany, OR",        lat: 44.6365, lng: -123.1059, website: "https://www.lassenchevrolet.com" },
  // Roseburg
  { name: "Lithia Nissan of Roseburg",      location: "Roseburg, OR",      lat: 43.2165, lng: -123.3417, website: "https://www.lithianissanroseburg.com" },
];

// ── Car inventory: 120 cars across all Oregon dealers ───────────────────
const CARS = [
  // ─── TOYOTA (very popular in Oregon) ──────────────
  { make: "Toyota", model: "Camry SE",            year: 2025, mileage: 850,   bodyType: "Sedan",  color: "Ice Cap White",        transmission: "Automatic", fuelType: "Gasoline", driveType: "FWD", dealers: [0,8,12], prices: [29500,28900,30200] },
  { make: "Toyota", model: "Camry XSE",           year: 2024, mileage: 8200,  bodyType: "Sedan",  color: "Midnight Black",       transmission: "Automatic", fuelType: "Gasoline", driveType: "FWD", dealers: [0,12],   prices: [31800,32500] },
  { make: "Toyota", model: "Camry LE Hybrid",     year: 2024, mileage: 12400, bodyType: "Sedan",  color: "Celestial Silver",     transmission: "CVT",       fuelType: "Hybrid",   driveType: "AWD", dealers: [8,0,12], prices: [30200,31500,29800] },
  { make: "Toyota", model: "Corolla SE",          year: 2025, mileage: 1200,  bodyType: "Sedan",  color: "Blueprint",            transmission: "CVT",       fuelType: "Gasoline", driveType: "FWD", dealers: [0,8],    prices: [24500,23900] },
  { make: "Toyota", model: "Corolla Cross LE",    year: 2025, mileage: 3400,  bodyType: "SUV",    color: "Ruby Flare Pearl",     transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [12,0,8], prices: [26900,27500,26200] },
  { make: "Toyota", model: "RAV4 XLE",            year: 2025, mileage: 2100,  bodyType: "SUV",    color: "Lunar Rock",           transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [0,8,12,17], prices: [34200,33800,35100,34500] },
  { make: "Toyota", model: "RAV4 Hybrid XSE",     year: 2024, mileage: 9800,  bodyType: "SUV",    color: "Cavalry Blue",         transmission: "CVT",       fuelType: "Hybrid",   driveType: "AWD", dealers: [0,8],    prices: [37900,38500] },
  { make: "Toyota", model: "RAV4 Prime SE",       year: 2024, mileage: 5600,  bodyType: "SUV",    color: "Blizzard Pearl",       transmission: "CVT",       fuelType: "Plug-In Hybrid", driveType: "AWD", dealers: [0], prices: [43200] },
  { make: "Toyota", model: "Highlander XLE",      year: 2024, mileage: 14300, bodyType: "SUV",    color: "Cement",               transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [0,8,12], prices: [42800,43500,41900] },
  { make: "Toyota", model: "4Runner TRD Off-Road",year: 2025, mileage: 1800,  bodyType: "SUV",    color: "Army Green",           transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [0,8,14], prices: [44500,45200,43800] },
  { make: "Toyota", model: "Tacoma TRD Sport",    year: 2025, mileage: 4200,  bodyType: "Truck",  color: "Ice Cap White",        transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [0,8,12,14], prices: [39800,40500,38900,41200] },
  { make: "Toyota", model: "Tundra SR5",          year: 2024, mileage: 16500, bodyType: "Truck",  color: "Magnetic Gray",        transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [0,12],   prices: [44200,45800] },
  { make: "Toyota", model: "Prius LE",            year: 2025, mileage: 2900,  bodyType: "Hatchback", color: "Wind Chill Pearl",  transmission: "CVT",       fuelType: "Hybrid",   driveType: "FWD", dealers: [0,8,17], prices: [29800,28900,30500] },
  { make: "Toyota", model: "GR86 Premium",        year: 2024, mileage: 7800,  bodyType: "Coupe",  color: "Track bRED",           transmission: "Manual",    fuelType: "Gasoline", driveType: "RWD", dealers: [0],      prices: [33500] },
  // ─── HONDA ────────────────────────────────────────
  { make: "Honda", model: "Civic Sport",          year: 2025, mileage: 1100,  bodyType: "Sedan",  color: "Rallye Red",           transmission: "CVT",       fuelType: "Gasoline", driveType: "FWD", dealers: [1,10,11], prices: [26800,27200,26100] },
  { make: "Honda", model: "Civic Sport Touring",  year: 2024, mileage: 9500,  bodyType: "Hatchback", color: "Sonic Gray Pearl",  transmission: "CVT",       fuelType: "Gasoline", driveType: "FWD", dealers: [1,11],   prices: [31500,30800] },
  { make: "Honda", model: "Civic Si",             year: 2024, mileage: 6200,  bodyType: "Sedan",  color: "Boost Blue Pearl",     transmission: "Manual",    fuelType: "Gasoline", driveType: "FWD", dealers: [1],      prices: [30200] },
  { make: "Honda", model: "Accord Sport",         year: 2025, mileage: 2800,  bodyType: "Sedan",  color: "Platinum White Pearl", transmission: "CVT",       fuelType: "Gasoline", driveType: "FWD", dealers: [1,10,11], prices: [31900,32500,31200] },
  { make: "Honda", model: "Accord Hybrid Sport-L",year: 2024, mileage: 11200, bodyType: "Sedan",  color: "Crystal Black Pearl",  transmission: "CVT",       fuelType: "Hybrid",   driveType: "FWD", dealers: [1,11],   prices: [34800,35500] },
  { make: "Honda", model: "CR-V Sport",           year: 2025, mileage: 3500,  bodyType: "SUV",    color: "Lunar Silver Metallic",transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [1,10,11], prices: [34500,35200,33800] },
  { make: "Honda", model: "CR-V Hybrid Sport-L",  year: 2024, mileage: 8900,  bodyType: "SUV",    color: "Urban Gray Pearl",     transmission: "CVT",       fuelType: "Hybrid",   driveType: "AWD", dealers: [1,11],   prices: [38200,37500] },
  { make: "Honda", model: "Passport TrailSport",  year: 2025, mileage: 1900,  bodyType: "SUV",    color: "Diffused Sky Blue",    transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [1,10],   prices: [44800,45500] },
  { make: "Honda", model: "Pilot Touring",        year: 2024, mileage: 15200, bodyType: "SUV",    color: "Platinum White Pearl", transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [1,11],   prices: [48500,49200] },
  { make: "Honda", model: "HR-V Sport",           year: 2025, mileage: 4100,  bodyType: "SUV",    color: "Milan Red",            transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [1,10,11], prices: [28200,27800,28900] },
  { make: "Honda", model: "Ridgeline RTL",        year: 2024, mileage: 12800, bodyType: "Truck",  color: "Sonic Gray Pearl",     transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [1],      prices: [42800] },
  // ─── SUBARU (huge in Oregon / PNW) ────────────────
  { make: "Subaru", model: "Outback Premium",     year: 2025, mileage: 2200,  bodyType: "Wagon",  color: "Autumn Green",         transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [3,6,16], prices: [34500,33800,35200] },
  { make: "Subaru", model: "Outback Wilderness",  year: 2024, mileage: 11500, bodyType: "Wagon",  color: "Geyser Blue",          transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [3,6],    prices: [39800,40500] },
  { make: "Subaru", model: "Forester Sport",      year: 2025, mileage: 3800,  bodyType: "SUV",    color: "Crimson Red Pearl",    transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [3,6,16], prices: [34200,33500,34800] },
  { make: "Subaru", model: "Crosstrek Premium",   year: 2025, mileage: 1500,  bodyType: "SUV",    color: "Offshore Blue Pearl",  transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [3,6,16], prices: [30800,30200,31500] },
  { make: "Subaru", model: "Crosstrek Wilderness", year: 2024, mileage: 8900, bodyType: "SUV",    color: "Oasis Blue",           transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [3,6],    prices: [33500,34200] },
  { make: "Subaru", model: "WRX Premium",         year: 2024, mileage: 5600,  bodyType: "Sedan",  color: "WR Blue Pearl",        transmission: "Manual",    fuelType: "Gasoline", driveType: "AWD", dealers: [3],      prices: [34800] },
  { make: "Subaru", model: "Ascent Touring",      year: 2025, mileage: 4200,  bodyType: "SUV",    color: "Crystal White Pearl",  transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [3,6,16], prices: [42500,43200,41800] },
  { make: "Subaru", model: "Impreza Sport",       year: 2025, mileage: 1800,  bodyType: "Hatchback", color: "Ice Silver Metallic", transmission: "CVT",     fuelType: "Gasoline", driveType: "AWD", dealers: [3,6],    prices: [26200,25800] },
  { make: "Subaru", model: "Solterra Premium",    year: 2024, mileage: 6800,  bodyType: "SUV",    color: "Harbor Mist Pearl",    transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [3],      prices: [42500] },
  { make: "Subaru", model: "BRZ Premium",         year: 2024, mileage: 4500,  bodyType: "Coupe",  color: "Sapphire Blue Pearl",  transmission: "Manual",    fuelType: "Gasoline", driveType: "RWD", dealers: [6],      prices: [32800] },
  // ─── FORD ─────────────────────────────────────────
  { make: "Ford", model: "F-150 XLT",             year: 2025, mileage: 3200,  bodyType: "Truck",  color: "Iconic Silver",        transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [4,9,14], prices: [45800,46500,44900] },
  { make: "Ford", model: "F-150 Lariat",          year: 2024, mileage: 14800, bodyType: "Truck",  color: "Agate Black",          transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [4,14],   prices: [55200,56800] },
  { make: "Ford", model: "F-150 Lightning XLT",   year: 2024, mileage: 8500,  bodyType: "Truck",  color: "Iced Blue Silver",     transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [4],      prices: [52900] },
  { make: "Ford", model: "Bronco Big Bend",       year: 2025, mileage: 2800,  bodyType: "SUV",    color: "Cactus Gray",          transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [4,9,14], prices: [39800,40500,38900] },
  { make: "Ford", model: "Bronco Sport Outer Banks", year: 2024, mileage: 9200, bodyType: "SUV", color: "Area 51",              transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [4,9],    prices: [36500,37200] },
  { make: "Ford", model: "Escape ST-Line",        year: 2025, mileage: 1600,  bodyType: "SUV",    color: "Rapid Red",            transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [4,9,14], prices: [33200,34500,32800] },
  { make: "Ford", model: "Explorer XLT",          year: 2024, mileage: 18200, bodyType: "SUV",    color: "Oxford White",         transmission: "Automatic", fuelType: "Gasoline", driveType: "RWD", dealers: [4,14],   prices: [39800,40500] },
  { make: "Ford", model: "Maverick XLT Hybrid",   year: 2024, mileage: 7500,  bodyType: "Truck",  color: "Alto Blue",            transmission: "CVT",       fuelType: "Hybrid",   driveType: "FWD", dealers: [4,9],    prices: [28500,29200] },
  { make: "Ford", model: "Mustang EcoBoost",      year: 2025, mileage: 1200,  bodyType: "Coupe",  color: "Grabber Blue",         transmission: "Automatic", fuelType: "Gasoline", driveType: "RWD", dealers: [4],      prices: [34800] },
  { make: "Ford", model: "Mustang GT",            year: 2024, mileage: 5800,  bodyType: "Coupe",  color: "Race Red",             transmission: "Manual",    fuelType: "Gasoline", driveType: "RWD", dealers: [4,9],    prices: [44500,45200] },
  // ─── CHEVROLET ────────────────────────────────────
  { make: "Chevrolet", model: "Silverado 1500 LT", year: 2025, mileage: 4500, bodyType: "Truck",  color: "Summit White",         transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [5,13,18], prices: [47800,48500,47200] },
  { make: "Chevrolet", model: "Silverado 1500 RST", year: 2024, mileage: 16800, bodyType: "Truck", color: "Black",               transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [5,13],   prices: [50200,51800] },
  { make: "Chevrolet", model: "Equinox RS",       year: 2025, mileage: 2100,  bodyType: "SUV",    color: "Radiant Red Tintcoat", transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [5,13,18], prices: [33500,34200,32800] },
  { make: "Chevrolet", model: "Equinox EV 2RS",   year: 2025, mileage: 800,   bodyType: "SUV",    color: "Riptide Blue",         transmission: "Automatic", fuelType: "Electric", driveType: "FWD", dealers: [5],      prices: [35900] },
  { make: "Chevrolet", model: "Traverse LT",      year: 2025, mileage: 3600,  bodyType: "SUV",    color: "Sterling Gray",        transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [5,13],   prices: [40200,41800] },
  { make: "Chevrolet", model: "Tahoe LT",         year: 2024, mileage: 19500, bodyType: "SUV",    color: "Black",                transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [5,13],   prices: [55800,57200] },
  { make: "Chevrolet", model: "Colorado Z71",     year: 2024, mileage: 11200, bodyType: "Truck",  color: "Glacier Blue",         transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [5,13,18], prices: [38500,39200,37800] },
  { make: "Chevrolet", model: "Malibu RS",        year: 2024, mileage: 14500, bodyType: "Sedan",  color: "Lakeshore Blue",       transmission: "CVT",       fuelType: "Gasoline", driveType: "FWD", dealers: [5,18],   prices: [24500,25200] },
  { make: "Chevrolet", model: "Camaro 1LT",       year: 2024, mileage: 6800,  bodyType: "Coupe",  color: "Vivid Orange",         transmission: "Automatic", fuelType: "Gasoline", driveType: "RWD", dealers: [5],      prices: [32500] },
  // ─── BMW ──────────────────────────────────────────
  { make: "BMW", model: "330i xDrive",             year: 2025, mileage: 1800,  bodyType: "Sedan",  color: "Alpine White",         transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [2],      prices: [47200] },
  { make: "BMW", model: "X3 xDrive30i",           year: 2024, mileage: 12500, bodyType: "SUV",    color: "Phytonic Blue",        transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [2],      prices: [48500] },
  { make: "BMW", model: "X5 xDrive40i",           year: 2024, mileage: 9200,  bodyType: "SUV",    color: "Black Sapphire",       transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [2],      prices: [62800] },
  { make: "BMW", model: "iX xDrive50",            year: 2024, mileage: 5600,  bodyType: "SUV",    color: "Mineral White",        transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [2],      prices: [78500] },
  { make: "BMW", model: "M3 Competition",         year: 2024, mileage: 3200,  bodyType: "Sedan",  color: "Isle of Man Green",    transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [2],      prices: [78900] },
  { make: "BMW", model: "230i Coupe",             year: 2024, mileage: 7500,  bodyType: "Coupe",  color: "Thundernight Metallic", transmission: "Automatic", fuelType: "Gasoline", driveType: "RWD", dealers: [2],     prices: [41200] },
  // ─── HYUNDAI ──────────────────────────────────────
  { make: "Hyundai", model: "Tucson SEL",          year: 2025, mileage: 2800,  bodyType: "SUV",    color: "Amazon Gray",          transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [7,5],    prices: [32500,33200] },
  { make: "Hyundai", model: "Tucson Hybrid SEL",   year: 2024, mileage: 10500, bodyType: "SUV",    color: "Shimmering Silver",    transmission: "Automatic", fuelType: "Hybrid",   driveType: "AWD", dealers: [7],      prices: [35800] },
  { make: "Hyundai", model: "Santa Fe XRT",        year: 2025, mileage: 1500,  bodyType: "SUV",    color: "Hampton Gray",         transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [7],      prices: [38500] },
  { make: "Hyundai", model: "Ioniq 5 SE Long Range", year: 2025, mileage: 3200, bodyType: "SUV",  color: "Cyber Gray",           transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [7],      prices: [45800] },
  { make: "Hyundai", model: "Elantra SEL",         year: 2025, mileage: 4100,  bodyType: "Sedan",  color: "Intense Blue",         transmission: "CVT",       fuelType: "Gasoline", driveType: "FWD", dealers: [7,5],    prices: [24500,25200] },
  { make: "Hyundai", model: "Sonata SEL Plus",     year: 2024, mileage: 15800, bodyType: "Sedan",  color: "Quartz White",         transmission: "Automatic", fuelType: "Gasoline", driveType: "FWD", dealers: [7],      prices: [29200] },
  { make: "Hyundai", model: "Kona N Line",         year: 2025, mileage: 1800,  bodyType: "SUV",    color: "Ecotronic Gray",       transmission: "DCT",       fuelType: "Gasoline", driveType: "AWD", dealers: [7],      prices: [30800] },
  { make: "Hyundai", model: "Palisade Calligraphy", year: 2024, mileage: 13200, bodyType: "SUV",   color: "Hyper White",          transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [7],      prices: [51500] },
  // ─── KIA ──────────────────────────────────────────
  { make: "Kia", model: "Telluride SX",            year: 2025, mileage: 2500,  bodyType: "SUV",    color: "Glacial White Pearl",  transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [7,5],    prices: [48200,49500] },
  { make: "Kia", model: "Sportage X-Line",         year: 2025, mileage: 4800,  bodyType: "SUV",    color: "Dawning Red",          transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [7],      prices: [36500] },
  { make: "Kia", model: "Sorento SX Prestige",     year: 2024, mileage: 9800,  bodyType: "SUV",    color: "Wolf Gray",            transmission: "DCT",       fuelType: "Gasoline", driveType: "AWD", dealers: [7,5],    prices: [42800,43500] },
  { make: "Kia", model: "EV6 GT-Line",             year: 2024, mileage: 6200,  bodyType: "SUV",    color: "Glacier",              transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [7],      prices: [50800] },
  { make: "Kia", model: "Forte GT",                year: 2024, mileage: 11500, bodyType: "Sedan",  color: "Runway Red",           transmission: "DCT",       fuelType: "Gasoline", driveType: "FWD", dealers: [7],      prices: [25200] },
  { make: "Kia", model: "K5 GT-Line",              year: 2025, mileage: 1200,  bodyType: "Sedan",  color: "Wolf Gray",            transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [7],      prices: [32500] },
  // ─── NISSAN ───────────────────────────────────────
  { make: "Nissan", model: "Rogue SV",             year: 2025, mileage: 3200,  bodyType: "SUV",    color: "Gun Metallic",         transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [19,5],   prices: [33200,34500] },
  { make: "Nissan", model: "Pathfinder SL",        year: 2024, mileage: 14500, bodyType: "SUV",    color: "Pearl White",          transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [19],     prices: [41500] },
  { make: "Nissan", model: "Altima SR",            year: 2024, mileage: 10800, bodyType: "Sedan",  color: "Scarlet Ember",        transmission: "CVT",       fuelType: "Gasoline", driveType: "FWD", dealers: [19,5],   prices: [27800,28500] },
  { make: "Nissan", model: "Frontier SV",          year: 2024, mileage: 8200,  bodyType: "Truck",  color: "Tactical Green",       transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [19],     prices: [37500] },
  { make: "Nissan", model: "Ariya Venture+",       year: 2024, mileage: 5600,  bodyType: "SUV",    color: "Aurora Green",         transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [19],     prices: [47200] },
  { make: "Nissan", model: "Sentra SR",            year: 2025, mileage: 1500,  bodyType: "Sedan",  color: "Electric Blue",        transmission: "CVT",       fuelType: "Gasoline", driveType: "FWD", dealers: [19],     prices: [23800] },
  // ─── MAZDA ────────────────────────────────────────
  { make: "Mazda", model: "CX-5 Carbon Edition",   year: 2025, mileage: 2800,  bodyType: "SUV",    color: "Polymetal Gray",       transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [1,10],   prices: [32800,33500] },
  { make: "Mazda", model: "CX-50 Turbo Premium Plus", year: 2024, mileage: 7500, bodyType: "SUV", color: "Zircon Sand",          transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [1,10],   prices: [42200,43500] },
  { make: "Mazda", model: "CX-90 Turbo S Premium", year: 2024, mileage: 5200,  bodyType: "SUV",    color: "Artisan Red",          transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [1],      prices: [50800] },
  { make: "Mazda", model: "Mazda3 Turbo Premium",  year: 2024, mileage: 9800,  bodyType: "Hatchback", color: "Soul Red Crystal", transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [1],      prices: [34500] },
  { make: "Mazda", model: "MX-5 Miata Club",       year: 2024, mileage: 4200,  bodyType: "Convertible", color: "Snowflake White", transmission: "Manual",   fuelType: "Gasoline", driveType: "RWD", dealers: [1],      prices: [36800] },
  // ─── JEEP ─────────────────────────────────────────
  { make: "Jeep", model: "Grand Cherokee Limited", year: 2025, mileage: 3500,  bodyType: "SUV",    color: "Baltic Gray",          transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [15,5],   prices: [48200,49500] },
  { make: "Jeep", model: "Wrangler Sahara",        year: 2024, mileage: 8900,  bodyType: "SUV",    color: "Sarge Green",          transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [15],     prices: [46800] },
  { make: "Jeep", model: "Wrangler Rubicon",       year: 2025, mileage: 1200,  bodyType: "SUV",    color: "Firecracker Red",      transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [15,5],   prices: [52500,53800] },
  { make: "Jeep", model: "Grand Cherokee 4xe",     year: 2024, mileage: 6500,  bodyType: "SUV",    color: "Diamond Black",        transmission: "Automatic", fuelType: "Plug-In Hybrid", driveType: "4WD", dealers: [15], prices: [62800] },
  { make: "Jeep", model: "Compass Latitude",       year: 2025, mileage: 2200,  bodyType: "SUV",    color: "Bright White",         transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [15],     prices: [33200] },
  // ─── VOLKSWAGEN ───────────────────────────────────
  { make: "Volkswagen", model: "Tiguan SE",        year: 2025, mileage: 3800,  bodyType: "SUV",    color: "Platinum Gray",        transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [2,9],    prices: [34200,34800] },
  { make: "Volkswagen", model: "Atlas Cross Sport SE", year: 2024, mileage: 11200, bodyType: "SUV", color: "Kingfisher Blue",     transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [2],      prices: [38500] },
  { make: "Volkswagen", model: "ID.4 Pro S Plus",  year: 2024, mileage: 6800,  bodyType: "SUV",    color: "Dusk Blue",            transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [2],      prices: [45800] },
  { make: "Volkswagen", model: "Jetta GLI",        year: 2025, mileage: 1500,  bodyType: "Sedan",  color: "Kings Red",            transmission: "DSG",       fuelType: "Gasoline", driveType: "FWD", dealers: [2],      prices: [32200] },
  { make: "Volkswagen", model: "Golf R",           year: 2024, mileage: 4800,  bodyType: "Hatchback", color: "Lapiz Blue",        transmission: "DSG",       fuelType: "Gasoline", driveType: "AWD", dealers: [2],      prices: [46500] },
  // ─── TESLA ────────────────────────────────────────
  { make: "Tesla", model: "Model 3 Long Range",    year: 2024, mileage: 8500,  bodyType: "Sedan",  color: "Ultra White",          transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [0,1],    prices: [42500,43200] },
  { make: "Tesla", model: "Model Y Long Range",    year: 2025, mileage: 2200,  bodyType: "SUV",    color: "Quicksilver",          transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [0,1,8],  prices: [48500,49200,47800] },
  { make: "Tesla", model: "Model Y Performance",   year: 2024, mileage: 6800,  bodyType: "SUV",    color: "Ultra Red",            transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [0],      prices: [52800] },
  { make: "Tesla", model: "Model S Long Range",    year: 2023, mileage: 18500, bodyType: "Sedan",  color: "Pearl White",          transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [0],      prices: [68500] },
  // ─── LEXUS ────────────────────────────────────────
  { make: "Lexus", model: "RX 350 Premium",        year: 2025, mileage: 3200,  bodyType: "SUV",    color: "Nori Green Pearl",     transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [0,8],    prices: [52800,53500] },
  { make: "Lexus", model: "NX 350h Premium",       year: 2024, mileage: 9800,  bodyType: "SUV",    color: "Eminent White Pearl",  transmission: "CVT",       fuelType: "Hybrid",   driveType: "AWD", dealers: [0],      prices: [46200] },
  { make: "Lexus", model: "ES 350 F Sport",        year: 2024, mileage: 7200,  bodyType: "Sedan",  color: "Ultra Sonic Blue",     transmission: "Automatic", fuelType: "Gasoline", driveType: "FWD", dealers: [0],      prices: [47500] },
  { make: "Lexus", model: "IS 500 F Sport",        year: 2024, mileage: 4500,  bodyType: "Sedan",  color: "Incognito",            transmission: "Automatic", fuelType: "Gasoline", driveType: "RWD", dealers: [0],      prices: [60800] },
  // ─── AUDI ─────────────────────────────────────────
  { make: "Audi", model: "Q5 Premium Plus",        year: 2024, mileage: 8500,  bodyType: "SUV",    color: "Navarra Blue",         transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [2],      prices: [49800] },
  { make: "Audi", model: "Q7 Premium",             year: 2024, mileage: 14200, bodyType: "SUV",    color: "Glacier White",        transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [2],      prices: [58200] },
  { make: "Audi", model: "A4 Premium Plus",        year: 2024, mileage: 6800,  bodyType: "Sedan",  color: "Mythos Black",         transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [2],      prices: [45500] },
  { make: "Audi", model: "e-tron GT Premium Plus", year: 2024, mileage: 4200,  bodyType: "Sedan",  color: "Ascari Blue",          transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [2],      prices: [105800] },
  // ─── RAM / DODGE ──────────────────────────────────
  { make: "Ram", model: "1500 Big Horn",           year: 2025, mileage: 3800,  bodyType: "Truck",  color: "Patriot Blue",         transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [15,5],   prices: [46800,47500] },
  { make: "Ram", model: "1500 Laramie",            year: 2024, mileage: 12500, bodyType: "Truck",  color: "Diamond Black",        transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [15],     prices: [55200] },
  { make: "Dodge", model: "Hornet R/T Plus",       year: 2024, mileage: 7800,  bodyType: "SUV",    color: "Hot Tamale",           transmission: "Automatic", fuelType: "Plug-In Hybrid", driveType: "AWD", dealers: [15], prices: [41500] },
  { make: "Dodge", model: "Durango R/T",           year: 2024, mileage: 11200, bodyType: "SUV",    color: "Vapor Gray",           transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [15],     prices: [52800] },
  // ─── GMC ──────────────────────────────────────────
  { make: "GMC", model: "Sierra 1500 SLE",         year: 2025, mileage: 4500,  bodyType: "Truck",  color: "Summit White",         transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [5,13],   prices: [49200,50500] },
  { make: "GMC", model: "Terrain AT4",             year: 2025, mileage: 2200,  bodyType: "SUV",    color: "Volcanic Red Tintcoat",transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [5,13],   prices: [38500,39200] },
  { make: "GMC", model: "Acadia Denali",           year: 2024, mileage: 13800, bodyType: "SUV",    color: "White Frost",          transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [5],      prices: [49800] },
  // ─── VOLVO ────────────────────────────────────────
  { make: "Volvo", model: "XC60 B5 Plus",          year: 2024, mileage: 8200,  bodyType: "SUV",    color: "Crystal White",        transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [2],      prices: [48500] },
  { make: "Volvo", model: "XC90 Recharge",         year: 2024, mileage: 5500,  bodyType: "SUV",    color: "Denim Blue",           transmission: "Automatic", fuelType: "Plug-In Hybrid", driveType: "AWD", dealers: [2], prices: [62800] },
  { make: "Volvo", model: "EX40 Plus",             year: 2025, mileage: 1800,  bodyType: "SUV",    color: "Sage Green",           transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [2],      prices: [38200] },
  // ─── ACURA ────────────────────────────────────────
  { make: "Acura", model: "Integra A-Spec",        year: 2025, mileage: 2500,  bodyType: "Hatchback", color: "Performance Red",   transmission: "CVT",       fuelType: "Gasoline", driveType: "FWD", dealers: [1,10],   prices: [36800,37500] },
  { make: "Acura", model: "MDX Type S",            year: 2024, mileage: 9200,  bodyType: "SUV",    color: "Liquid Carbon",        transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [1],      prices: [62500] },
  { make: "Acura", model: "TLX A-Spec",            year: 2024, mileage: 7800,  bodyType: "Sedan",  color: "Apex Blue Pearl",      transmission: "DCT",       fuelType: "Gasoline", driveType: "AWD", dealers: [1],      prices: [47200] },
  // ─── GENESIS ──────────────────────────────────────
  { make: "Genesis", model: "GV70 2.5T Sport",     year: 2024, mileage: 6500,  bodyType: "SUV",    color: "Vik Black",            transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [7],      prices: [48500] },
  { make: "Genesis", model: "G70 3.3T Sport",      year: 2024, mileage: 8200,  bodyType: "Sedan",  color: "Siberian Ice",         transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [7],      prices: [44800] },
  // ─── LINCOLN ──────────────────────────────────────
  { make: "Lincoln", model: "Aviator Reserve",     year: 2024, mileage: 10500, bodyType: "SUV",    color: "Pristine White",       transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [4],      prices: [56800] },
  { make: "Lincoln", model: "Corsair Reserve",     year: 2025, mileage: 2800,  bodyType: "SUV",    color: "Crystal Red",          transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [4],      prices: [45200] },
  // ─── CADILLAC ─────────────────────────────────────
  { make: "Cadillac", model: "Lyriq Sport",        year: 2024, mileage: 5800,  bodyType: "SUV",    color: "Celestial Metallic",   transmission: "Automatic", fuelType: "Electric", driveType: "AWD", dealers: [5],      prices: [62500] },
  { make: "Cadillac", model: "XT5 Premium Luxury", year: 2024, mileage: 11500, bodyType: "SUV",    color: "Summit White",         transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [5],      prices: [49800] },
  // ─── OLDER / PRE-OWNED POPULAR ────────────────────
  { make: "Toyota", model: "Tacoma SR5",           year: 2021, mileage: 42500, bodyType: "Truck",  color: "Magnetic Gray",        transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [0,8,12], prices: [31800,32500,30900] },
  { make: "Honda", model: "CR-V EX",               year: 2022, mileage: 35800, bodyType: "SUV",    color: "Modern Steel",         transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [1,11],   prices: [28500,29200] },
  { make: "Subaru", model: "Outback Limited",      year: 2022, mileage: 28900, bodyType: "Wagon",  color: "Brilliant Bronze",     transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [3,6],    prices: [29800,30500] },
  { make: "Ford", model: "Explorer ST",            year: 2021, mileage: 38200, bodyType: "SUV",    color: "Rapid Red",            transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [4,9],    prices: [35800,36500] },
  { make: "Chevrolet", model: "Silverado 1500 Trail Boss", year: 2022, mileage: 31500, bodyType: "Truck", color: "Cherry Red", transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [5,13], prices: [42500,43800] },
  { make: "Toyota", model: "Camry TRD",            year: 2022, mileage: 25800, bodyType: "Sedan",  color: "Wind Chill Pearl",     transmission: "Automatic", fuelType: "Gasoline", driveType: "FWD", dealers: [0,12],   prices: [27500,28200] },
  { make: "Honda", model: "Accord Touring",        year: 2022, mileage: 29500, bodyType: "Sedan",  color: "Still Night Pearl",    transmission: "CVT",       fuelType: "Gasoline", driveType: "FWD", dealers: [1,11],   prices: [28800,29500] },
  { make: "Hyundai", model: "Santa Fe Limited",    year: 2022, mileage: 33200, bodyType: "SUV",    color: "Twilight Black",       transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [7],      prices: [31200] },
  { make: "Nissan", model: "Murano Platinum",      year: 2022, mileage: 27800, bodyType: "SUV",    color: "Pearl White",          transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [19],     prices: [31500] },
  { make: "Mazda", model: "CX-5 Signature",        year: 2022, mileage: 24500, bodyType: "SUV",    color: "Machine Gray",         transmission: "Automatic", fuelType: "Gasoline", driveType: "AWD", dealers: [1,10],   prices: [30200,31500] },
  { make: "Jeep", model: "Wrangler Unlimited Sport", year: 2022, mileage: 26800, bodyType: "SUV", color: "Hydro Blue",           transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [15],     prices: [35800] },
  { make: "Subaru", model: "Forester Wilderness",  year: 2023, mileage: 19500, bodyType: "SUV",    color: "Jasper Green",         transmission: "CVT",       fuelType: "Gasoline", driveType: "AWD", dealers: [3,6,16], prices: [32500,33200,31800] },
  { make: "Toyota", model: "Tundra TRD Pro",       year: 2023, mileage: 22100, bodyType: "Truck",  color: "Solar Octane",         transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [0],      prices: [55800] },
  { make: "Ford", model: "Ranger Lariat",          year: 2024, mileage: 9800,  bodyType: "Truck",  color: "Carbonized Gray",      transmission: "Automatic", fuelType: "Gasoline", driveType: "4WD", dealers: [4,14],   prices: [42500,43200] },
  { make: "Chevrolet", model: "Trax RS",           year: 2025, mileage: 1200,  bodyType: "SUV",    color: "Cayenne Orange",       transmission: "Automatic", fuelType: "Gasoline", driveType: "FWD", dealers: [5,13,18], prices: [24800,25500,24200] },
  { make: "Honda", model: "Civic Type R",          year: 2024, mileage: 3500,  bodyType: "Hatchback", color: "Championship White", transmission: "Manual",   fuelType: "Gasoline", driveType: "FWD", dealers: [1],      prices: [44800] },
  { make: "Toyota", model: "GR Corolla Core",      year: 2024, mileage: 5200,  bodyType: "Hatchback", color: "Supersonic Red",    transmission: "Manual",    fuelType: "Gasoline", driveType: "AWD", dealers: [0],      prices: [38500] },
];

async function main() {
  // Clear existing data
  await prisma.listing.deleteMany();
  await prisma.car.deleteMany();
  await prisma.dealer.deleteMany();

  // Create dealers
  const dealers = await Promise.all(
    DEALERS.map((d) => prisma.dealer.create({ data: d }))
  );

  console.log(`Created ${dealers.length} Oregon dealerships.`);

  // Create cars and listings
  let totalListings = 0;
  for (const c of CARS) {
    const car = await prisma.car.create({
      data: {
        make: c.make,
        model: c.model,
        year: c.year,
        mileage: c.mileage,
        bodyType: c.bodyType,
        imageUrl: null,
        color: c.color,
        transmission: c.transmission,
        fuelType: c.fuelType,
        driveType: c.driveType,
      },
    });

    for (let i = 0; i < c.dealers.length; i++) {
      await prisma.listing.create({
        data: {
          price: c.prices[i],
          url: dealers[c.dealers[i]].website || undefined,
          source: "seed",
          carId: car.id,
          dealerId: dealers[c.dealers[i]].id,
        },
      });
      totalListings++;
    }
  }

  console.log(`Seed complete: ${CARS.length} cars with ${totalListings} total dealer listings across ${dealers.length} Oregon dealerships.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
