import { Currency } from "@value-objects/currency";
import { Exchange } from "@value-objects/exchange";
import { Quote } from "@value-objects/quote";

export type ExchangeState = {
  fromCurrency: Currency | null;
  quotes: Quote[];
  exchanges: Exchange[];
};

export const initialState: ExchangeState = {
  fromCurrency: null,
  quotes: [],
  exchanges: [],
};
