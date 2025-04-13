import { Amount } from "@value-objects/amount";
import { Currency } from "@value-objects/currency";
import { Exchange } from "@value-objects/exchange";
import { Quote } from "@value-objects/quote";
import { Uuid } from "@value-objects/uuid";
import { exchangesActions } from "./actions/exchanges-actions";
import { fromCurrencyActions } from "./actions/from-currency-actions";
import { quotesActions } from "./actions/quotes-actions";
import { ExchangeState } from "./exchange-state";

export type ExchangeActions = {
  setFromCurrency: (currency: Currency) => void;
  setQuotes: (quotes: Quote[]) => void;
  clearQuotes: () => void;
  setExchanges: (exchanges: Exchange[]) => void;
  clearExchanges: () => void;
  calculeExchange: (
    id: Uuid,
    value: Amount,
    taxPercent: Amount | null,
    tipPercent: Amount | null,
  ) => void;
  removeExchange: (id: Uuid) => void;
};

export type Action<T> = (
  set: (fn: (state: ExchangeState) => ExchangeState) => void,
) => T;

export const actions = {
  fromCurrency: fromCurrencyActions,
  quotes: quotesActions,
  exchanges: exchangesActions,
};
