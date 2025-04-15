import { useExchangeStore } from "@stores/exchange/exchange-store";
import { act, renderHook } from "@testing-library/react";
import { Amount } from "@value-objects/amount";
import { Currency } from "@value-objects/currency";
import { Exchange } from "@value-objects/exchange";
import { Quote } from "@value-objects/quote";
import { Uuid } from "@value-objects/uuid";

describe("ExchangeStore", () => {
  beforeEach(() => {
    act(() => {
      useExchangeStore.setState(useExchangeStore.getState(), true);
    });
  });

  it("should set the fromCurrency", () => {
    const { result } = renderHook(() => useExchangeStore());

    act(() => {
      result.current.setFromCurrency(Currency.UNITED_STATES_DOLLAR);
    });

    expect(result.current.fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);
  });

  it("should set and clear quotes", () => {
    const { result } = renderHook(() => useExchangeStore());
    const quotes = [
      new Quote(
        Currency.UNITED_STATES_DOLLAR,
        Currency.BRAZILIAN_REAL,
        new Amount("5.00"),
      ),
    ];

    act(() => {
      result.current.setQuotes(quotes);
    });

    expect(result.current.quotes).toHaveLength(1);
    expect(result.current.quotes[0].toCurrency).toBe(Currency.BRAZILIAN_REAL);

    act(() => {
      result.current.clearQuotes();
    });

    expect(result.current.quotes).toHaveLength(0);
  });

  it("should set and clear exchanges", () => {
    const { result } = renderHook(() => useExchangeStore());
    const exchange = new Exchange(
      Uuid.generate(),
      Currency.UNITED_STATES_DOLLAR,
      new Amount("100"),
      null,
      null,
      [],
      new Date(),
    );

    act(() => {
      result.current.setExchanges([exchange]);
    });

    expect(result.current.exchanges).toHaveLength(1);
    expect(result.current.exchanges[0].fromCurrency).toBe(
      Currency.UNITED_STATES_DOLLAR,
    );

    act(() => {
      result.current.clearExchanges();
    });

    expect(result.current.exchanges).toHaveLength(0);
  });

  it("should calculate and add an exchange", () => {
    const { result } = renderHook(() => useExchangeStore());
    const id = Uuid.generate();
    const value = new Amount("100");
    const taxPercent = new Amount("10");
    const tipPercent = new Amount("5");

    act(() => {
      result.current.setFromCurrency(Currency.UNITED_STATES_DOLLAR);
      result.current.setQuotes([
        new Quote(
          Currency.UNITED_STATES_DOLLAR,
          Currency.BRAZILIAN_REAL,
          new Amount("5.00"),
        ),
      ]);
      result.current.calculeExchange(id, value, taxPercent, tipPercent);
    });

    const exchanges = result.current.exchanges;
    expect(exchanges).toHaveLength(1);
    expect(exchanges[0].fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);
    expect(exchanges[0].fromAmount.value).toBe("100.0000000000");
    expect(exchanges[0].fromTax?.amount.value).toBe("10.0000000000");
    expect(exchanges[0].fromTip?.amount.value).toBe("5.0000000000");
  });

  it("should remove an exchange by ID", () => {
    const { result } = renderHook(() => useExchangeStore());
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

    act(() => {
      result.current.setExchanges([exchange]);
    });

    expect(result.current.exchanges).toHaveLength(1);

    act(() => {
      result.current.removeExchange(id);
    });

    expect(result.current.exchanges).toHaveLength(0);
  });
});
