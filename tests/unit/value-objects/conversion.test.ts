import { Amount } from "@/value-objects/amount";
import { Conversion } from "@/value-objects/conversion";
import { Currency } from "@/value-objects/currency";
import { Tax } from "@/value-objects/tax";

describe("Conversion", () => {
  const validFullJSON = {
    currency: "USD",
    rate: "4.00",
    amount: "100",
    tax: {
      amount: "15.0000000000",
      percent: "15.0000000000",
    },
    tip: {
      amount: "5.0000000000",
      percent: "10.0000000000",
    },
  };

  const validPartialJSON = {
    currency: "BRL",
    rate: "5.50",
    amount: "200",
    tax: null,
    tip: null,
  };

  it("should create a Conversion instance from JSON with tax and tip", () => {
    const conversion = Conversion.fromJSON(validFullJSON);

    expect(conversion.currency).toBe(Currency.UNITED_STATES_DOLLAR);

    const expectedRate = Amount.fromJSON(validFullJSON.rate);
    const expectedAmount = Amount.fromJSON(validFullJSON.amount);
    expect(conversion.rate.value).toBe(expectedRate.value);
    expect(conversion.amount.value).toBe(expectedAmount.value);

    const expectedTax = Tax.fromJSON(validFullJSON.tax);
    const expectedTip = Tax.fromJSON(validFullJSON.tip);
    expect(conversion.tax?.amount.value).toBe(expectedTax.amount.value);
    expect(conversion.tip?.amount.value).toBe(expectedTip.amount.value);
  });

  it("should create a Conversion instance from JSON with tax and tip null", () => {
    const conversion = Conversion.fromJSON(validPartialJSON);

    expect(conversion.currency).toBe(Currency.BRAZILIAN_REAL);
    const expectedRate = Amount.fromJSON(validPartialJSON.rate);
    const expectedAmount = Amount.fromJSON(validPartialJSON.amount);
    expect(conversion.rate.value).toBe(expectedRate.value);
    expect(conversion.amount.value).toBe(expectedAmount.value);

    expect(conversion.tax).toBeNull();
    expect(conversion.tip).toBeNull();
  });

  it("should serialize a Conversion instance to JSON", () => {
    const conversion = Conversion.fromJSON(validFullJSON);
    const jsonOutput = conversion.toJSON();

    expect(jsonOutput).toEqual({
      currency: "USD",
      rate: Amount.fromJSON(validFullJSON.rate).toJSON(),
      amount: Amount.fromJSON(validFullJSON.amount).toJSON(),
      tax: Tax.fromJSON(validFullJSON.tax).toJSON(),
      tip: Tax.fromJSON(validFullJSON.tip).toJSON(),
    });
  });

  it("should calculate total amount correctly", () => {
    const conversion = Conversion.fromJSON(validFullJSON);
    const total = conversion.total;
    expect(total.value).toBe("120.0000000000");
  });

  it("should calculate total as the base amount if tax and tip are null", () => {
    const conversion = Conversion.fromJSON(validPartialJSON);
    const total = conversion.total;
    expect(total.value).toBe(conversion.amount.value);
  });

  it("should throw an error when an invalid currency is provided", () => {
    const invalidJSON = {
      currency: "INVALID",
      rate: "4.00",
      amount: "100",
      tax: null,
      tip: null,
    };
    expect(() => Conversion.fromJSON(invalidJSON)).toThrow();
  });
});
