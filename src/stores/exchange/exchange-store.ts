import { create } from "zustand";
import { actions, ExchangeActions } from "./exchange-actions";
import { exchangeMiddleware } from "./exchange-middleware";
import { ExchangeState, initialState } from "./exchange-state";

export type ExchangeStore = ExchangeState & ExchangeActions;

export const useExchangeStore = create<ExchangeStore>()(
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
