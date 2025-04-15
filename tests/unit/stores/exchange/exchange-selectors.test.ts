import {
  exchangesWithoutFirstSelector,
  firstExchangeSelector,
} from "@/stores/exchange/exchange-selectors";
import { useExchangeStore } from "@/stores/exchange/exchange-store";
import { Amount } from "@/value-objects/amount";
import { Currency } from "@/value-objects/currency";
import { Exchange } from "@/value-objects/exchange";
import { Uuid } from "@/value-objects/uuid";
import { act } from "@testing-library/react";

describe("ExchangeSelectors", () => {
  const mockExchange = (
    id: Uuid,
    fromCurrency: Currency,
    fromAmount: string,
  ): Exchange => {
    return new Exchange(
      id,
      fromCurrency,
      new Amount(fromAmount),
      null,
      null,
      [],
      new Date(),
    );
  };

  beforeEach(() => {
    // Reset the Zustand store state before each test
    act(() => {
      useExchangeStore.setState(useExchangeStore.getState(), true);
    });
  });

  it("should return the first exchange using firstExchangeSelector", () => {
    const exchanges = [
      mockExchange(Uuid.generate(), Currency.UNITED_STATES_DOLLAR, "100"),
      mockExchange(Uuid.generate(), Currency.BRAZILIAN_REAL, "200"),
    ];

    act(() => {
      useExchangeStore.getState().setExchanges(exchanges);
    });

    const result = firstExchangeSelector(useExchangeStore.getState());
    expect(result).toBe(exchanges[0]);
  });

  it("should return undefined if there are no exchanges in firstExchangeSelector", () => {
    act(() => {
      useExchangeStore.getState().clearExchanges();
    });

    const result = firstExchangeSelector(useExchangeStore.getState());
    expect(result).toBeUndefined();
  });

  it("should return all exchanges except the first using exchangesWithoutFirstSelector", () => {
    const exchanges = [
      mockExchange(Uuid.generate(), Currency.UNITED_STATES_DOLLAR, "100"),
      mockExchange(Uuid.generate(), Currency.BRAZILIAN_REAL, "200"),
      mockExchange(Uuid.generate(), Currency.EURO, "300"),
    ];

    act(() => {
      useExchangeStore.getState().setExchanges(exchanges);
    });

    const result = exchangesWithoutFirstSelector(useExchangeStore.getState());
    expect(result).toHaveLength(2);
    expect(result).toEqual([exchanges[1], exchanges[2]]);
  });

  it("should return an empty array if there is only one exchange in exchangesWithoutFirstSelector", () => {
    const exchanges = [
      mockExchange(Uuid.generate(), Currency.UNITED_STATES_DOLLAR, "100"),
    ];

    act(() => {
      useExchangeStore.getState().setExchanges(exchanges);
    });

    const result = exchangesWithoutFirstSelector(useExchangeStore.getState());
    expect(result).toEqual([]);
  });

  it("should return an empty array if there are no exchanges in exchangesWithoutFirstSelector", () => {
    act(() => {
      useExchangeStore.getState().clearExchanges();
    });

    const result = exchangesWithoutFirstSelector(useExchangeStore.getState());
    expect(result).toEqual([]);
  });
});
