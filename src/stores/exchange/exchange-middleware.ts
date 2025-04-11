import { parseEnum } from "@helpers/parse-enum";
import { Currency } from "@value-objects/currency";
import { Exchange } from "@value-objects/exchange";
import { Quote } from "@value-objects/quote";
import { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { ExchangeState } from "./exchange-state";
import { ExchangeStore } from "./exchange-store";

export const exchangeMiddleware = (
  store: StateCreator<ExchangeStore, [["zustand/persist", unknown]]>,
) =>
  persist(store, {
    name: "ExchangeStore",
    onRehydrateStorage: () => (state) => {
      const handlers: {
        [K in keyof ExchangeState]: () => void;
      } = {
        fromCurrency: () => {
          if (state?.fromCurrency) {
            state.setFromCurrency(parseEnum(Currency, state.fromCurrency));
          }
        },
        quotes: () => {
          if (state?.quotes && state.quotes.length > 0) {
            state?.setQuotes(
              state.quotes.map((quote) => Quote.fromJSON(quote)),
            );
          }
        },
        exchanges: () => {
          if (state?.exchanges && state.exchanges.length > 0) {
            state?.setExchanges(
              state.exchanges.map((exchange) => Exchange.fromJSON(exchange)),
            );
          }
        },
      };

      Object.values(handlers).forEach((handler) => handler());
    },
  });
