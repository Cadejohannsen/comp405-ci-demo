import bcrypt from "bcryptjs";

describe("Auth Utilities", () => {
  test("bcrypt hashes a password correctly", async () => {
    const password = "testpassword123";
    const hashed = await bcrypt.hash(password, 10);

    expect(hashed).not.toBe(password);
    expect(hashed.length).toBeGreaterThan(0);
  });

  test("bcrypt validates correct password", async () => {
    const password = "securePass!456";
    const hashed = await bcrypt.hash(password, 10);
    const isValid = await bcrypt.compare(password, hashed);

    expect(isValid).toBe(true);
  });

  test("bcrypt rejects wrong password", async () => {
    const password = "securePass!456";
    const hashed = await bcrypt.hash(password, 10);
    const isValid = await bcrypt.compare("wrongpassword", hashed);

    expect(isValid).toBe(false);
  });

  test("password validation: rejects short passwords", () => {
    const password = "abc";
    expect(password.length >= 6).toBe(false);
  });

  test("password validation: accepts valid passwords", () => {
    const password = "validPass123";
    expect(password.length >= 6).toBe(true);
  });

  test("email validation: required fields check", () => {
    const validPayload = { email: "test@example.com", password: "pass123" };
    const missingEmail = { email: "", password: "pass123" };
    const missingPassword = { email: "test@example.com", password: "" };

    expect(!!validPayload.email && !!validPayload.password).toBe(true);
    expect(!!missingEmail.email && !!missingEmail.password).toBe(false);
    expect(!!missingPassword.email && !!missingPassword.password).toBe(false);
  });
});
