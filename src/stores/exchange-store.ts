import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { parseEnum } from "../helpers";
import { Amount } from "../value-objects/amount";
import { Conversion } from "../value-objects/conversion";
import { Currency } from "../value-objects/currency";
import { Exchange } from "../value-objects/exchange";
import { Quote } from "../value-objects/quote";
import { Tax } from "../value-objects/tax";

const middlewares = (
  store: StateCreator<ExchangeStore, [["zustand/persist", unknown]]>,
) =>
  persist(store, {
    name: "ExchangeStore",
    onRehydrateStorage: () => (state) => {
      if (state?.fromCurrency) {
        state?.setFromCurrency(parseEnum(Currency, state.fromCurrency));
      }

      if (state?.quotes && state?.quotes.length > 0) {
        state?.setQuotes(state.quotes.map((quote) => Quote.fromJSON(quote)));
      }

      if (state?.exchanges && state?.exchanges.length > 0) {
        state?.setExchanges(
          state.exchanges.map((exchange) => Exchange.fromJSON(exchange)),
        );
      }
    },
  });

type ExchangeState = {
  // From Currency
  fromCurrency: Currency | null;
  // Quotes
  quotes: Quote[];
  // Exchanges
  exchanges: Exchange[];
};

type ExchangeActions = {
  // From Currency
  setFromCurrency: (currency: Currency) => void;
  // Quotes
  setQuotes: (quotes: Quote[]) => void;
  clearQuotes: () => void;
  // Exchanges
  setExchanges: (exchanges: Exchange[]) => void;
  clearExchanges: () => void;
  calculeExchange: (
    value: Amount,
    taxPercent: Amount | null,
    tipPercent: Amount | null,
  ) => void;
};

type ExchangeStore = ExchangeState & ExchangeActions;

export const useExchangeStore = create<ExchangeStore>()(
  middlewares((set) => ({
    // From Currency
    fromCurrency: null,
    setFromCurrency: (fromCurrency) => {
      set((state) => ({ ...state, fromCurrency }));
    },
    // Quotes
    quotes: [],
    setQuotes: (quotes) => {
      set((state) => ({ ...state, quotes }));
    },
    clearQuotes: () => {
      set((state) => ({ ...state, quotes: [] }));
    },
    // Exchanges
    exchanges: [],
    setExchanges: (exchanges) => {
      set((state) => ({ ...state, exchanges }));
    },
    clearExchanges: () => {
      set((state) => ({ ...state, exchanges: [] }));
    },
    calculeExchange: (value, taxPercent, tipPercent) => {
      set((state) => {
        if (!state.fromCurrency || !state.quotes) {
          throw new Error("Missing quote settings");
        }

        let fromTax: Tax | null = null;
        if (taxPercent) {
          const taxAmount = value.percentage(taxPercent);
          fromTax = new Tax(taxAmount, taxPercent);
        }

        let fromTip: Tax | null = null;
        if (tipPercent) {
          const tipAmount = value.percentage(tipPercent);
          fromTip = new Tax(tipAmount, tipPercent);
        }

        const conversions = state.quotes.map((quote) => {
          const convertedAmount = value.times(quote.amount);
          const convertedTax = fromTax
            ? new Tax(fromTax.amount.times(quote.amount), fromTax.percent)
            : null;
          const convertedTip = fromTip
            ? new Tax(fromTip.amount.times(quote.amount), fromTip.percent)
            : null;

          return new Conversion(
            quote.toCurrency,
            quote.amount,
            convertedAmount,
            convertedTax,
            convertedTip,
          );
        });

        const exchange = new Exchange(
          state.fromCurrency,
          value,
          fromTax,
          fromTip,
          conversions,
        );

        return { ...state, exchanges: [exchange, ...state.exchanges] };
      });
    },
  })),
);
