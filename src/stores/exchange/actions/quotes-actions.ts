import { Action, ExchangeActions } from "../exchange-actions";

type QuotesActions = {
  set: Action<ExchangeActions["setQuotes"]>;
  clear: Action<ExchangeActions["clearQuotes"]>;
};

export const quotesActions: QuotesActions = {
  set: (set) => (quotes) => {
    set((state) => ({ ...state, quotes }));
  },
  clear: (set) => () => {
    set((state) => ({ ...state, quotes: [] }));
  },
};
