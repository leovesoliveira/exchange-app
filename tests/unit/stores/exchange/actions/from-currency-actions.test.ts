import { fromCurrencyActions } from "@stores/exchange/actions/from-currency-actions";
import { ExchangeState } from "@stores/exchange/exchange-state";
import { Currency } from "@value-objects/currency";

describe("FromCurrencyActions", () => {
  let state: ExchangeState;

  const mockSet = (fn: (state: ExchangeState) => ExchangeState) => {
    state = fn(state);
  };

  beforeEach(() => {
    state = {
      fromCurrency: null,
      quotes: [],
      exchanges: [],
    };
  });

  it("should set the fromCurrency", () => {
    fromCurrencyActions.set(mockSet)(Currency.UNITED_STATES_DOLLAR);

    expect(state.fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);
  });

  it("should overwrite the existing fromCurrency", () => {
    state.fromCurrency = Currency.EURO;

    fromCurrencyActions.set(mockSet)(Currency.BRAZILIAN_REAL);

    expect(state.fromCurrency).toBe(Currency.BRAZILIAN_REAL);
  });

  it("should set the fromCurrency to null", () => {
    state.fromCurrency = Currency.UNITED_STATES_DOLLAR;

    fromCurrencyActions.set(mockSet)(null);

    expect(state.fromCurrency).toBeNull();
  });
});
