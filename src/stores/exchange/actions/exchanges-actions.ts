import { Conversion } from "@value-objects/conversion";
import { Exchange } from "@value-objects/exchange";
import { Tax } from "@value-objects/tax";
import { Action, ExchangeActions } from "../exchange-actions";

type ExchangesActions = {
  set: Action<ExchangeActions["setExchanges"]>;
  clear: Action<ExchangeActions["clearExchanges"]>;
  calculate: Action<ExchangeActions["calculeExchange"]>;
};

export const exchangesActions: ExchangesActions = {
  set: (set) => (exchanges) => {
    set((state) => ({ ...state, exchanges }));
  },
  clear: (set) => () => {
    set((state) => ({ ...state, exchanges: [] }));
  },
  calculate: (set) => (value, taxPercent, tipPercent) => {
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
};
