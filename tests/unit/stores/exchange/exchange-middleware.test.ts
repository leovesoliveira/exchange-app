import { actions } from "@stores/exchange/exchange-actions";
import { exchangeMiddleware } from "@stores/exchange/exchange-middleware";
import { initialState } from "@stores/exchange/exchange-state";
import { ExchangeStore } from "@stores/exchange/exchange-store";
import { act } from "@testing-library/react";
import { Amount } from "@value-objects/amount";
import { Currency } from "@value-objects/currency";
import { Exchange } from "@value-objects/exchange";
import { Quote } from "@value-objects/quote";
import { Uuid } from "@value-objects/uuid";
import { create } from "zustand";

describe("ExchangeMiddleware", () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    // Mock localStorage for the persist middleware
    vi.spyOn(Storage.prototype, "setItem").mockImplementation((key, value) => {
      mockStorage[key] = value;
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      return mockStorage[key] || null;
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation((key) => {
      delete mockStorage[key];
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createTestStore = () =>
    create<ExchangeStore>()(
      exchangeMiddleware((set) => ({
        ...initialState,
        setFromCurrency: actions.fromCurrency.set(set),
        setQuotes: actions.quotes.set(set),
        clearQuotes: actions.quotes.clear(set),
        setExchanges: actions.exchanges.set(set),
        clearExchanges: actions.exchanges.clear(set),
        calculeExchange: actions.exchanges.calculate(set),
        removeExchange: actions.exchanges.remove(set),
      })),
    );

  it("should persist and rehydrate the fromCurrency state", async () => {
    const useStore = createTestStore();

    act(() => {
      useStore.getState().setFromCurrency(Currency.UNITED_STATES_DOLLAR);
    });

    expect(useStore.getState().fromCurrency).toBe(
      Currency.UNITED_STATES_DOLLAR,
    );

    // Simulate rehydration
    const rehydratedState = JSON.stringify({
      state: { fromCurrency: "USD" },
    });
    mockStorage["ExchangeStore"] = rehydratedState;

    const rehydratedStore = createTestStore();
    await act(async () => {
      await rehydratedStore.persist.rehydrate();
    });

    expect(rehydratedStore.getState().fromCurrency).toBe(
      Currency.UNITED_STATES_DOLLAR,
    );
  });

  it("should persist and rehydrate quotes", async () => {
    const useStore = createTestStore();
    const quotes = [
      new Quote(
        Currency.UNITED_STATES_DOLLAR,
        Currency.BRAZILIAN_REAL,
        new Amount("5.00"),
      ),
    ];

    act(() => {
      useStore.getState().setQuotes(quotes);
    });

    expect(useStore.getState().quotes).toHaveLength(1);
    expect(useStore.getState().quotes[0].toCurrency).toBe(
      Currency.BRAZILIAN_REAL,
    );

    // Simulate rehydration
    const rehydratedState = JSON.stringify({
      state: {
        quotes: quotes.map((quote) => quote.toJSON()),
      },
    });
    mockStorage["ExchangeStore"] = rehydratedState;

    const rehydratedStore = createTestStore();
    await act(async () => {
      await rehydratedStore.persist.rehydrate();
    });

    expect(rehydratedStore.getState().quotes).toHaveLength(1);
    expect(rehydratedStore.getState().quotes[0].toCurrency).toBe(
      Currency.BRAZILIAN_REAL,
    );
  });

  it("should persist and rehydrate exchanges", async () => {
    const useStore = createTestStore();
    const exchanges = [
      new Exchange(
        Uuid.generate(),
        Currency.UNITED_STATES_DOLLAR,
        new Amount("100"),
        null,
        null,
        [],
        new Date(),
      ),
    ];

    act(() => {
      useStore.getState().setExchanges(exchanges);
    });

    expect(useStore.getState().exchanges).toHaveLength(1);
    expect(useStore.getState().exchanges[0].fromCurrency).toBe(
      Currency.UNITED_STATES_DOLLAR,
    );

    // Simulate rehydration
    const rehydratedState = JSON.stringify({
      state: {
        exchanges: exchanges.map((exchange) => exchange.toJSON()),
      },
    });
    mockStorage["ExchangeStore"] = rehydratedState;

    const rehydratedStore = createTestStore();
    await act(async () => {
      await rehydratedStore.persist.rehydrate();
    });

    expect(rehydratedStore.getState().exchanges).toHaveLength(1);
    expect(rehydratedStore.getState().exchanges[0].fromCurrency).toBe(
      Currency.UNITED_STATES_DOLLAR,
    );
  });
});
