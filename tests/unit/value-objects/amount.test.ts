import { Amount } from "@/value-objects/amount";

describe("Amount", () => {
  it("should create an Amount with a valid numeric string", () => {
    const amount = new Amount("10.1234");
    expect(amount.value).toBe("10.1234000000"); // Arredondado com SCALE = 10
  });

  it("should throw an error when value is not a number", () => {
    expect(() => new Amount("abc")).toThrow(
      "Amount need to be a numeric value",
    );
  });

  it("should throw an error when value is zero or negative", () => {
    expect(() => new Amount("0")).toThrow("Amount cannot be zero or negative");
    expect(() => new Amount("-5")).toThrow("Amount cannot be zero or negative");
  });

  it("should return the correct sum with plus()", () => {
    const a = new Amount("10");
    const b = new Amount("5.5");
    const result = a.plus(b);
    expect(result.value).toBe("15.5000000000");
  });

  it("should return the correct product with times()", () => {
    const a = new Amount("2");
    const b = new Amount("3");
    const result = a.times(b);
    expect(result.value).toBe("6.0000000000");
  });

  it("should return the correct quotient with dividedBy()", () => {
    const a = new Amount("10");
    const b = new Amount("2");
    const result = a.dividedBy(b);
    expect(result.value).toBe("5.0000000000");
  });

  it("should return the correct percentage", () => {
    const a = new Amount("200");
    const percent = new Amount("10"); // 10%
    const result = a.percentage(percent);
    expect(result.value).toBe("20.0000000000");
  });

  it("should return the same instance if no argument is passed", () => {
    const a = new Amount("5");
    expect(a.plus()).toBe(a);
    expect(a.times()).toBe(a);
    expect(a.dividedBy()).toBe(a);
    expect(a.percentage()).toBe(a);
  });

  it("should return the string representation with toString()", () => {
    const a = new Amount("1");
    expect(a.toString()).toBe("1.0000000000");
  });

  it("should return the correct value in toJSON()", () => {
    const a = new Amount("9.99");
    expect(a.toJSON()).toBe("9.9900000000");
  });

  it("should create an Amount from JSON string", () => {
    const jsonValue = "25.00";
    const a = Amount.fromJSON(jsonValue);
    expect(a.value).toBe("25.0000000000");
  });
});
