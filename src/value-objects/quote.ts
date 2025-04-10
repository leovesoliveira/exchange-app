import { parseEnum } from "../helpers";
import { Amount } from "./amount";
import { Currency } from "./currency";

export class Quote {
  readonly #fromCurrency: Currency;
  readonly #toCurrency: Currency;
  readonly #amount: Amount;

  constructor(fromCurrency: Currency, toCurrency: Currency, amount: Amount) {
    this.#fromCurrency = fromCurrency;
    this.#toCurrency = toCurrency;
    this.#amount = amount;
  }

  static fromJSON(json: any): Quote {
    return new Quote(
      parseEnum(Currency, json.fromCurrency),
      parseEnum(Currency, json.toCurrency),
      Amount.fromJSON(json.amount),
    );
  }

  toJSON() {
    return {
      fromCurrency: this.#fromCurrency.toString(),
      toCurrency: this.#toCurrency.toString(),
      amount: this.#amount.toJSON(),
    };
  }

  get fromCurrency(): Currency {
    return this.#fromCurrency;
  }

  get toCurrency(): Currency {
    return this.#toCurrency;
  }

  get amount(): Amount {
    return this.#amount;
  }
}
