import { ExchangeStore } from "./exchange-store";

export const firstExchangeSelector = (store: ExchangeStore) => {
  return store.exchanges[0];
};

export const exchangesWithoutFirstSelector = (store: ExchangeStore) => {
  if (store.exchanges.length <= 1) {
    return [];
  }

  return store.exchanges.slice(1);
};
