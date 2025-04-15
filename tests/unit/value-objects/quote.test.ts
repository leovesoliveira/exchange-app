import { Amount } from "@/value-objects/amount";
import { Currency } from "@/value-objects/currency";
import { Quote } from "@/value-objects/quote";

describe("Quote", () => {
  const validJSON = {
    fromCurrency: "USD",
    toCurrency: "BRL",
    amount: "100",
  };

  it("should create a Quote instance from JSON", () => {
    const quote = Quote.fromJSON(validJSON);

    expect(quote.fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);
    expect(quote.toCurrency).toBe(Currency.BRAZILIAN_REAL);

    const expectedAmount = new Amount("100");
    expect(quote.amount.value).toBe(expectedAmount.value);
  });

  it("should serialize a Quote instance to JSON", () => {
    const quote = Quote.fromJSON(validJSON);
    const jsonOutput = quote.toJSON();

    expect(jsonOutput).toEqual({
      fromCurrency: "USD",
      toCurrency: "BRL",
      amount: new Amount("100").toJSON(),
    });
  });

  it("should throw an error when invalid currency is provided", () => {
    const invalidJSON = {
      fromCurrency: "INVALID",
      toCurrency: "BRL",
      amount: "100",
    };

    expect(() => Quote.fromJSON(invalidJSON)).toThrow();
  });

  it("should have getters returning correct instances", () => {
    const quote = Quote.fromJSON(validJSON);

    expect(quote.fromCurrency).toBeDefined();
    expect(quote.toCurrency).toBeDefined();
    expect(quote.amount).toBeInstanceOf(Amount);
  });
});
