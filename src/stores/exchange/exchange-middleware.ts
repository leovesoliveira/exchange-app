import { parseEnum } from "@/helpers";
import { Currency } from "@/value-objects/currency";
import { Exchange, ExchangeJSON } from "@/value-objects/exchange";
import { Quote, QuoteJSON } from "@/value-objects/quote";
import { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { ExchangeState } from "./exchange-state";
import { ExchangeStore } from "./exchange-store";

export const exchangeMiddleware = (
  store: StateCreator<ExchangeStore, [["zustand/persist", unknown]]>,
) =>
  persist(store, {
    name: "ExchangeStore",
    onRehydrateStorage: () => (store) => {
      const handlers: {
        [K in keyof ExchangeState]: () => void;
      } = {
        fromCurrency: () => {
          if (store?.fromCurrency) {
            store.setFromCurrency(parseEnum(Currency, store.fromCurrency));
          }
        },
        quotes: () => {
          if (store?.quotes && store.quotes.length > 0) {
            store?.setQuotes(
              store.quotes.map((quote: unknown) =>
                Quote.fromJSON(quote as QuoteJSON),
              ),
            );
          }
        },
        exchanges: () => {
          if (store?.exchanges && store.exchanges.length > 0) {
            store?.setExchanges(
              store.exchanges.map((exchange: unknown) =>
                Exchange.fromJSON(exchange as ExchangeJSON),
              ),
            );
          }
        },
      };

      Object.values(handlers).forEach((handler) => handler());
    },
  });
