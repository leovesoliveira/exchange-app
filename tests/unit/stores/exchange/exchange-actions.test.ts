import { actions } from "@stores/exchange/exchange-actions";
import { initialState } from "@stores/exchange/exchange-state";
import { Amount } from "@value-objects/amount";
import { Currency } from "@value-objects/currency";
import { Exchange } from "@value-objects/exchange";
import { Quote } from "@value-objects/quote";
import { Uuid } from "@value-objects/uuid";

describe("ExchangeActions", () => {
  let state: typeof initialState;

  beforeEach(() => {
    // Reset state before each test
    state = { ...initialState };
  });

  it("should set the fromCurrency", () => {
    const set = (fn: (state: typeof initialState) => typeof initialState) => {
      state = fn(state);
    };

    actions.fromCurrency.set(set)(Currency.UNITED_STATES_DOLLAR);

    expect(state.fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);
  });

  it("should set and clear quotes", () => {
    const set = (fn: (state: typeof initialState) => typeof initialState) => {
      state = fn(state);
    };

    const quotes = [
      new Quote(
        Currency.UNITED_STATES_DOLLAR,
        Currency.BRAZILIAN_REAL,
        new Amount("5.00"),
      ),
    ];

    actions.quotes.set(set)(quotes);
    expect(state.quotes).toHaveLength(1);
    expect(state.quotes[0].toCurrency).toBe(Currency.BRAZILIAN_REAL);

    actions.quotes.clear(set)();
    expect(state.quotes).toHaveLength(0);
  });

  it("should set and clear exchanges", () => {
    const set = (fn: (state: typeof initialState) => typeof initialState) => {
      state = fn(state);
    };

    const exchange = new Exchange(
      Uuid.generate(),
      Currency.UNITED_STATES_DOLLAR,
      new Amount("100"),
      null,
      null,
      [],
      new Date(),
    );

    actions.exchanges.set(set)([exchange]);
    expect(state.exchanges).toHaveLength(1);
    expect(state.exchanges[0].fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);

    actions.exchanges.clear(set)();
    expect(state.exchanges).toHaveLength(0);
  });

  it("should calculate and add an exchange", () => {
    const set = (fn: (state: typeof initialState) => typeof initialState) => {
      state = fn(state);
    };

    const id = Uuid.generate();
    const value = new Amount("100");
    const taxPercent = new Amount("10");
    const tipPercent = new Amount("5");

    state.fromCurrency = Currency.UNITED_STATES_DOLLAR;
    state.quotes = [
      new Quote(
        Currency.UNITED_STATES_DOLLAR,
        Currency.BRAZILIAN_REAL,
        new Amount("5.00"),
      ),
    ];

    actions.exchanges.calculate(set)(id, value, taxPercent, tipPercent);

    expect(state.exchanges).toHaveLength(1);
    const exchange = state.exchanges[0];
    expect(exchange.fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);
    expect(exchange.fromAmount.value).toBe("100.0000000000");
    expect(exchange.fromTax?.amount.value).toBe("10.0000000000");
    expect(exchange.fromTip?.amount.value).toBe("5.0000000000");
  });

  it("should remove an exchange by ID", () => {
    const set = (fn: (state: typeof initialState) => typeof initialState) => {
      state = fn(state);
    };

    const id = Uuid.generate();
    const exchange = new Exchange(
      id,
      Currency.UNITED_STATES_DOLLAR,
      new Amount("100"),
      null,
      null,
      [],
      new Date(),
    );

    actions.exchanges.set(set)([exchange]);
    expect(state.exchanges).toHaveLength(1);

    actions.exchanges.remove(set)(id);
    expect(state.exchanges).toHaveLength(0);
  });
});
