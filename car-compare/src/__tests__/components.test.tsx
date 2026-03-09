import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

// Mock next/link for testing
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children);
});

describe("Footer Component", () => {
  test("renders CarCompare branding", () => {
    render(<Footer />);
    expect(screen.getByText("Car")).toBeInTheDocument();
    expect(screen.getByText("Compare")).toBeInTheDocument();
  });

  test("renders tagline", () => {
    render(<Footer />);
    expect(
      screen.getByText("Find the best deal on your next car.")
    ).toBeInTheDocument();
  });

  test("renders copyright with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`${year} CarCompare`))
    ).toBeInTheDocument();
  });
});
