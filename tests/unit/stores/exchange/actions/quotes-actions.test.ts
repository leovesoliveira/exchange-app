import { quotesActions } from "@stores/exchange/actions/quotes-actions";
import { ExchangeState } from "@stores/exchange/exchange-state";
import { Amount } from "@value-objects/amount";
import { Currency } from "@value-objects/currency";
import { Quote } from "@value-objects/quote";

describe("QuotesActions", () => {
  let state: ExchangeState;

  const mockSet = (fn: (state: ExchangeState) => ExchangeState) => {
    state = fn(state);
  };

  beforeEach(() => {
    state = {
      fromCurrency: Currency.UNITED_STATES_DOLLAR,
      quotes: [],
      exchanges: [],
    };
  });

  it("should set quotes", () => {
    const quotes = [
      new Quote(
        Currency.UNITED_STATES_DOLLAR,
        Currency.BRAZILIAN_REAL,
        new Amount("5.00"),
      ),
      new Quote(
        Currency.UNITED_STATES_DOLLAR,
        Currency.EURO,
        new Amount("0.85"),
      ),
    ];

    quotesActions.set(mockSet)(quotes);

    expect(state.quotes).toHaveLength(2);
    expect(state.quotes[0].toCurrency).toBe(Currency.BRAZILIAN_REAL);
    expect(state.quotes[1].toCurrency).toBe(Currency.EURO);
  });

  it("should clear quotes", () => {
    state.quotes = [
      new Quote(
        Currency.UNITED_STATES_DOLLAR,
        Currency.BRAZILIAN_REAL,
        new Amount("5.00"),
      ),
    ];

    quotesActions.clear(mockSet)();

    expect(state.quotes).toHaveLength(0);
  });
});
