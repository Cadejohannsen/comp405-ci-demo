// Test the haversine distance calculation used in nearby cars feature

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

describe("Haversine Distance Calculator", () => {
  test("should return 0 for same coordinates", () => {
    const distance = haversineDistance(32.7767, -96.797, 32.7767, -96.797);
    expect(distance).toBe(0);
  });

  test("should calculate correct distance between Dallas and Charlotte (~936 miles)", () => {
    const distance = haversineDistance(32.7767, -96.797, 35.2271, -80.8431);
    expect(distance).toBeGreaterThan(900);
    expect(distance).toBeLessThan(970);
  });

  test("should calculate correct distance between Dallas and Los Angeles (~1,240 miles)", () => {
    const distance = haversineDistance(32.7767, -96.797, 34.0522, -118.2437);
    expect(distance).toBeGreaterThan(1200);
    expect(distance).toBeLessThan(1300);
  });

  test("should calculate correct distance between Dallas and Phoenix (~887 miles)", () => {
    const distance = haversineDistance(32.7767, -96.797, 33.4484, -112.074);
    expect(distance).toBeGreaterThan(850);
    expect(distance).toBeLessThan(920);
  });

  test("should be symmetric (A->B == B->A)", () => {
    const dAB = haversineDistance(32.7767, -96.797, 35.2271, -80.8431);
    const dBA = haversineDistance(35.2271, -80.8431, 32.7767, -96.797);
    expect(Math.abs(dAB - dBA)).toBeLessThan(0.001);
  });

  test("should return positive values", () => {
    const distance = haversineDistance(32.7767, -96.797, 40.7608, -111.891);
    expect(distance).toBeGreaterThan(0);
  });
});
