import { Amount } from "@value-objects/amount";
import { Tax } from "@value-objects/tax";

describe("Tax", () => {
  it("should create a Tax instance with amount and percent", () => {
    const amount = new Amount("20");
    const percent = new Amount("10");
    const tax = new Tax(amount, percent);

    expect(tax.amount.value).toBe("20.0000000000");
    expect(tax.percent.value).toBe("10.0000000000");
  });

  it("should create a Tax instance from JSON", () => {
    const json = {
      amount: "15.0000000000",
      percent: "5.0000000000",
    };

    const tax = Tax.fromJSON(json);

    expect(tax.amount.value).toBe("15.0000000000");
    expect(tax.percent.value).toBe("5.0000000000");
  });

  it("should calculate tax correctly from value and percent", () => {
    const value = new Amount("100");
    const percent = new Amount("15");

    const tax = Tax.calculate(value, percent);

    expect(tax.amount.value).toBe("15.0000000000");
    expect(tax.percent.value).toBe("15.0000000000");
  });

  it("should serialize to correct JSON format", () => {
    const amount = new Amount("12.50");
    const percent = new Amount("25");

    const tax = new Tax(amount, percent);

    expect(tax.toJSON()).toEqual({
      amount: "12.5000000000",
      percent: "25.0000000000",
    });
  });

  it("should return correct values from getters", () => {
    const amount = new Amount("8.75");
    const percent = new Amount("7");

    const tax = new Tax(amount, percent);

    expect(tax.amount).toBeInstanceOf(Amount);
    expect(tax.percent).toBeInstanceOf(Amount);
    expect(tax.amount.value).toBe("8.7500000000");
    expect(tax.percent.value).toBe("7.0000000000");
  });
});
