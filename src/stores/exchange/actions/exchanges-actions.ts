import { Amount } from "@value-objects/amount";
import { Conversion } from "@value-objects/conversion";
import { Exchange } from "@value-objects/exchange";
import { Quote } from "@value-objects/quote";
import { Tax } from "@value-objects/tax";
import { Action, ExchangeActions } from "../exchange-actions";

type ExchangesActions = {
  set: Action<ExchangeActions["setExchanges"]>;
  clear: Action<ExchangeActions["clearExchanges"]>;
  calculate: Action<ExchangeActions["calculeExchange"]>;
  remove: Action<ExchangeActions["removeExchange"]>;
};

export const exchangesActions: ExchangesActions = {
  set: (set) => (exchanges) => {
    set((state) => ({ ...state, exchanges }));
  },
  clear: (set) => () => {
    set((state) => ({ ...state, exchanges: [] }));
  },
  calculate: (set) => (id, value, taxPercent, tipPercent) => {
    set((state) => {
      if (!state.fromCurrency || !state.quotes) {
        throw new Error("Missing quote settings");
      }

      const fromTax = taxPercent ? Tax.calculate(value, taxPercent) : null;
      const fromTip = tipPercent ? Tax.calculate(value, tipPercent) : null;
      const conversions = convert(value, fromTax, fromTip, state.quotes);

      const exchange = new Exchange(
        id,
        state.fromCurrency,
        value,
        fromTax,
        fromTip,
        conversions,
      );

      return { ...state, exchanges: [exchange, ...state.exchanges] };
    });
  },
  remove: (set) => (id) => {
    set((state) => ({
      ...state,
      exchanges: state.exchanges.filter((exchange) => exchange.id !== id),
    }));
  },
};

const convert = (
  value: Amount,
  fromTax: Tax | null,
  fromTip: Tax | null,
  quotes: Quote[],
) => {
  return quotes.map((quote) => {
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
};
