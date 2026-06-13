import { buildValidQuotes, QuoteFormRow } from "@/helpers/build-valid-quotes";
import { Currency } from "@/value-objects/currency";

describe("buildValidQuotes", () => {
  const fromCurrency = Currency.UNITED_STATES_DOLLAR;

  it("should map fully valid rows into Quote instances", () => {
    const rows: QuoteFormRow[] = [
      { toCurrency: "BRL", toAmount: 5.25 },
      { toCurrency: "EUR", toAmount: 0.92 },
    ];

    const quotes = buildValidQuotes(fromCurrency, rows);

    expect(quotes).toHaveLength(2);
    expect(quotes[0].fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);
    expect(quotes[0].toCurrency).toBe(Currency.BRAZILIAN_REAL);
    expect(quotes[0].amount.value).toBe("5.2500000000");
    expect(quotes[1].toCurrency).toBe(Currency.EURO);
  });

  it("should skip rows whose amount is zero or negative", () => {
    const rows: QuoteFormRow[] = [
      { toCurrency: "BRL", toAmount: 0 },
      { toCurrency: "EUR", toAmount: -1 },
    ];

    expect(buildValidQuotes(fromCurrency, rows)).toEqual([]);
  });

  it("should skip rows with an empty or invalid currency", () => {
    const rows: QuoteFormRow[] = [
      { toCurrency: "", toAmount: 5 },
      { toCurrency: "INVALID", toAmount: 5 },
    ];

    expect(buildValidQuotes(fromCurrency, rows)).toEqual([]);
  });

  it("should keep only the valid rows from a mixed list", () => {
    const rows: QuoteFormRow[] = [
      { toCurrency: "BRL", toAmount: 5 },
      { toCurrency: "", toAmount: 5 },
      { toCurrency: "EUR", toAmount: 0 },
      { toCurrency: "GBP", toAmount: 1.5 },
    ];

    const quotes = buildValidQuotes(fromCurrency, rows);

    expect(quotes).toHaveLength(2);
    expect(quotes.map((quote) => quote.toCurrency)).toEqual([
      Currency.BRAZILIAN_REAL,
      Currency.BRITISH_POUND_STERLING,
    ]);
  });

  it("should return an empty array when there are no rows", () => {
    expect(buildValidQuotes(fromCurrency, [])).toEqual([]);
  });
});
