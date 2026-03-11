import * as fs from "fs";
import * as path from "path";

const srcDir = path.join(__dirname, "..");

describe("App Structure", () => {
  test("all required page files exist", () => {
    const requiredPages = [
      "app/page.tsx",
      "app/layout.tsx",
      "app/search/page.tsx",
      "app/car/[id]/page.tsx",
      "app/login/page.tsx",
      "app/signup/page.tsx",
    ];

    for (const page of requiredPages) {
      const filePath = path.join(srcDir, page);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });

  test("all required API routes exist", () => {
    const requiredRoutes = [
      "app/api/cars/route.ts",
      "app/api/cars/[id]/route.ts",
      "app/api/cars/nearby/route.ts",
      "app/api/auth/[...nextauth]/route.ts",
      "app/api/auth/signup/route.ts",
      "app/api/scrape/route.ts",
      "app/api/scrape/dealers/route.ts",
    ];

    for (const route of requiredRoutes) {
      const filePath = path.join(srcDir, route);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });

  test("all required components exist", () => {
    const requiredComponents = [
      "components/Navbar.tsx",
      "components/HeroSection.tsx",
      "components/SearchBar.tsx",
      "components/CarCard.tsx",
      "components/CarGrid.tsx",
      "components/FilterSidebar.tsx",
      "components/PriceComparison.tsx",
      "components/Footer.tsx",
      "components/Providers.tsx",
      "components/NearbyCars.tsx",
    ];

    for (const component of requiredComponents) {
      const filePath = path.join(srcDir, component);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });

  test("lib files exist", () => {
    const requiredLibs = ["lib/prisma.ts", "lib/auth.ts", "lib/scraper.ts", "lib/vehicle-api.ts"];

    for (const lib of requiredLibs) {
      const filePath = path.join(srcDir, lib);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });

  test("prisma schema exists", () => {
    const schemaPath = path.join(srcDir, "..", "prisma", "schema.prisma");
    expect(fs.existsSync(schemaPath)).toBe(true);
  });

  test("prisma schema contains required models", () => {
    const schemaPath = path.join(srcDir, "..", "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toContain("model User");
    expect(schema).toContain("model Car");
    expect(schema).toContain("model Dealer");
    expect(schema).toContain("model Listing");
  });

  test("prisma schema contains lat/lng fields for Dealer", () => {
    const schemaPath = path.join(srcDir, "..", "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toContain("lat");
    expect(schema).toContain("lng");
  });
});
