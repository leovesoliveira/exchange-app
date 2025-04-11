import { ExchangeStore } from "./exchange-store";

export const firstExchangeSelector = (store: ExchangeStore) =>
  store.exchanges[0];
