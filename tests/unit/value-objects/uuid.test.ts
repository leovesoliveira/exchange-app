import { Uuid } from "@/value-objects/uuid";

describe("Uuid", () => {
  it("should create a Uuid with a valid UUID v4 string", () => {
    const validUuid = "550e8400-e29b-41d4-a716-446655440000";
    const uuid = new Uuid(validUuid);
    expect(uuid.value).toBe(validUuid);
  });

  it("should throw an error when the UUID format is invalid", () => {
    const invalidUuids = [
      "",
      "invalid-uuid",
      "12345678-1234-1234-1234-123456789012",
      "550e8400-e29b-41d4-a716-44665544",
    ];

    for (const val of invalidUuids) {
      expect(() => new Uuid(val)).toThrow("Invalid UUID format");
    }
  });

  it("should generate a valid UUID v4", () => {
    const generated = Uuid.generate();
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(generated.value).toMatch(regex);
  });

  it("should return the UUID as string using toString()", () => {
    const uuid = new Uuid("550e8400-e29b-41d4-a716-446655440000");
    expect(uuid.toString()).toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  it("should return the UUID as string using toJSON()", () => {
    const uuid = new Uuid("550e8400-e29b-41d4-a716-446655440000");
    expect(uuid.toJSON()).toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  it("should create a Uuid from JSON", () => {
    const jsonUuid = "550e8400-e29b-41d4-a716-446655440000";
    const uuid = Uuid.fromJSON(jsonUuid);
    expect(uuid.value).toBe(jsonUuid);
  });
});
