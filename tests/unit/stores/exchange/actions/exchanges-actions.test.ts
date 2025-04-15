import { exchangesActions } from "@stores/exchange/actions/exchanges-actions";
import { ExchangeState } from "@stores/exchange/exchange-state";
import { Amount } from "@value-objects/amount";
import { Currency } from "@value-objects/currency";
import { Exchange } from "@value-objects/exchange";
import { Quote } from "@value-objects/quote";
import { Uuid } from "@value-objects/uuid";

describe("ExchangesActions", () => {
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

  it("should set exchanges", () => {
    const exchange = new Exchange(
      Uuid.generate(),
      Currency.UNITED_STATES_DOLLAR,
      new Amount("100"),
      null,
      null,
      [],
    );

    exchangesActions.set(mockSet)([exchange]);

    expect(state.exchanges).toHaveLength(1);
    expect(state.exchanges[0]).toBe(exchange);
  });

  it("should clear exchanges", () => {
    const exchange = new Exchange(
      Uuid.generate(),
      Currency.UNITED_STATES_DOLLAR,
      new Amount("100"),
      null,
      null,
      [],
    );

    state.exchanges = [exchange];

    exchangesActions.clear(mockSet)();

    expect(state.exchanges).toHaveLength(0);
  });

  it("should calculate and add an exchange", () => {
    const id = Uuid.generate();
    const value = new Amount("100");
    const taxPercent = new Amount("10");
    const tipPercent = new Amount("5");

    state.quotes = [
      new Quote(
        Currency.UNITED_STATES_DOLLAR,
        Currency.BRAZILIAN_REAL,
        new Amount("5.00"),
      ),
    ];

    exchangesActions.calculate(mockSet)(id, value, taxPercent, tipPercent);

    expect(state.exchanges).toHaveLength(1);
    const exchange = state.exchanges[0];
    expect(exchange.fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);
    expect(exchange.fromAmount.value).toBe("100.0000000000");
    expect(exchange.fromTax?.amount.value).toBe("10.0000000000");
    expect(exchange.fromTip?.amount.value).toBe("5.0000000000");
    expect(exchange.conversions).toHaveLength(1);
    expect(exchange.conversions[0].currency).toBe(Currency.BRAZILIAN_REAL);
    expect(exchange.conversions[0].amount.value).toBe("500.0000000000");
  });

  it("should calculate and add an exchange with null tax and tip", () => {
    const id = Uuid.generate();
    const value = new Amount("100");
    const taxPercent = null; // Simulate null tax
    const tipPercent = null; // Simulate null tip

    state.quotes = [
      new Quote(
        Currency.UNITED_STATES_DOLLAR,
        Currency.BRAZILIAN_REAL,
        new Amount("5.00"),
      ),
    ];

    exchangesActions.calculate(mockSet)(id, value, taxPercent, tipPercent);

    expect(state.exchanges).toHaveLength(1);
    const exchange = state.exchanges[0];
    expect(exchange.fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);
    expect(exchange.fromAmount.value).toBe("100.0000000000");
    expect(exchange.fromTax).toBeNull(); // Ensure tax is null
    expect(exchange.fromTip).toBeNull(); // Ensure tip is null
    expect(exchange.conversions).toHaveLength(1);
    expect(exchange.conversions[0].currency).toBe(Currency.BRAZILIAN_REAL);
    expect(exchange.conversions[0].amount.value).toBe("500.0000000000");
  });

  it("should remove an exchange by ID", () => {
    const id = Uuid.generate();
    const exchange = new Exchange(
      id,
      Currency.UNITED_STATES_DOLLAR,
      new Amount("100"),
      null,
      null,
      [],
    );

    state.exchanges = [exchange];

    exchangesActions.remove(mockSet)(id);

    expect(state.exchanges).toHaveLength(0);
  });

  it("should throw an error if calculate is called without quotes", () => {
    const id = Uuid.generate();
    const value = new Amount("100");
    const taxPercent = new Amount("10");
    const tipPercent = new Amount("5");

    state.quotes = [];

    expect(() =>
      exchangesActions.calculate(mockSet)(id, value, taxPercent, tipPercent),
    ).toThrow("Missing quote settings");
  });

  it("should throw an error if calculate is called without fromCurrency", () => {
    const id = Uuid.generate();
    const value = new Amount("100");
    const taxPercent = new Amount("10");
    const tipPercent = new Amount("5");

    state.fromCurrency = null; // Simulate missing fromCurrency
    state.quotes = [
      new Quote(
        Currency.UNITED_STATES_DOLLAR,
        Currency.BRAZILIAN_REAL,
        new Amount("5.00"),
      ),
    ];

    expect(() =>
      exchangesActions.calculate(mockSet)(id, value, taxPercent, tipPercent),
    ).toThrow("Missing quote settings");
  });
});
