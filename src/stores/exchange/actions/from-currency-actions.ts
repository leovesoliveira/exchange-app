import { Action, ExchangeActions } from "../exchange-actions";

type FromCurrencyActions = {
  set: Action<ExchangeActions["setFromCurrency"]>;
};

export const fromCurrencyActions: FromCurrencyActions = {
  set: (set) => (fromCurrency) => {
    set((state) => ({ ...state, fromCurrency }));
  },
};
