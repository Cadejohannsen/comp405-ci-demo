import React from "react";
import { render, screen } from "@testing-library/react";
import CarCard from "@/components/CarCard";

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children);
});

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Calendar: () => React.createElement("span", { "data-testid": "calendar-icon" }),
  Gauge: () => React.createElement("span", { "data-testid": "gauge-icon" }),
  Tag: () => React.createElement("span", { "data-testid": "tag-icon" }),
}));

describe("CarCard Component", () => {
  const defaultProps = {
    id: "test-123",
    make: "Toyota",
    model: "Camry SE",
    year: 2023,
    mileage: 12500,
    bodyType: "Sedan",
    imageUrl: null,
    lowestPrice: 28500,
    listingCount: 3,
  };

  test("renders car make and year", () => {
    render(<CarCard {...defaultProps} />);
    expect(screen.getByText("2023 Toyota")).toBeInTheDocument();
  });

  test("renders car model", () => {
    render(<CarCard {...defaultProps} />);
    expect(screen.getAllByText("Camry SE").length).toBeGreaterThanOrEqual(1);
  });

  test("renders formatted price", () => {
    render(<CarCard {...defaultProps} />);
    expect(screen.getByText("$28,500")).toBeInTheDocument();
  });

  test("renders mileage", () => {
    render(<CarCard {...defaultProps} />);
    expect(screen.getByText("12,500 mi")).toBeInTheDocument();
  });

  test("renders body type", () => {
    render(<CarCard {...defaultProps} />);
    expect(screen.getByText("Sedan")).toBeInTheDocument();
  });

  test("renders listing count badge", () => {
    render(<CarCard {...defaultProps} />);
    expect(screen.getByText("3 dealers")).toBeInTheDocument();
  });

  test("renders singular 'dealer' for 1 listing", () => {
    render(<CarCard {...defaultProps} listingCount={1} />);
    expect(screen.getByText("1 dealer")).toBeInTheDocument();
  });

  test("links to correct car detail page", () => {
    render(<CarCard {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/car/test-123");
  });

  test("renders fallback when no image URL", () => {
    render(<CarCard {...defaultProps} imageUrl={null} />);
    // Should show make and model as text placeholder
    expect(screen.getAllByText("Toyota").length).toBeGreaterThanOrEqual(1);
  });

  test("renders image when imageUrl is provided", () => {
    render(<CarCard {...defaultProps} imageUrl="https://example.com/car.jpg" />);
    const img = screen.getByRole("img", { name: "2023 Toyota Camry SE" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/car.jpg");
  });
});
