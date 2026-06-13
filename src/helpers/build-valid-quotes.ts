import { Amount } from "@/value-objects/amount";
import { Currency } from "@/value-objects/currency";
import { Quote } from "@/value-objects/quote";

export type QuoteFormRow = {
  toCurrency: string;
  toAmount: number;
};

const isValidCurrency = (value: string): value is Currency => {
  return Object.values(Currency).includes(value as Currency);
};

/**
 * Maps raw quote-form rows into Quote value objects, keeping only the rows that
 * are complete and valid (currency selected and amount greater than zero).
 * Incomplete rows are skipped silently instead of throwing, so the form can be
 * persisted while the user is still filling it in.
 */
export const buildValidQuotes = (
  fromCurrency: Currency,
  rows: QuoteFormRow[],
): Quote[] => {
  return rows.reduce<Quote[]>((quotes, row) => {
    if (!isValidCurrency(row.toCurrency) || row.toAmount <= Amount.ZERO) {
      return quotes;
    }

    const toAmount = new Amount(row.toAmount.toString());
    quotes.push(new Quote(fromCurrency, row.toCurrency, toAmount));

    return quotes;
  }, []);
};
