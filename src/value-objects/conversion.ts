import { parseEnum } from "@helpers/parse-enum";
import { Amount } from "./amount";
import { Currency } from "./currency";
import { Tax } from "./tax";

export class Conversion {
  readonly #currency: Currency;
  readonly #rate: Amount;
  readonly #amount: Amount;
  readonly #tax: Tax | null;
  readonly #tip: Tax | null;

  constructor(
    currency: Currency,
    rate: Amount,
    amount: Amount,
    tax: Tax | null,
    tip: Tax | null,
  ) {
    this.#currency = currency;
    this.#rate = rate;
    this.#amount = amount;
    this.#tax = tax;
    this.#tip = tip;
  }

  static fromJSON(json: {
    currency: string;
    rate: string;
    amount: string;
    tax?: { amount: string; percent: string };
    tip?: { amount: string; percent: string };
  }): Conversion {
    return new Conversion(
      parseEnum(Currency, json.currency),
      Amount.fromJSON(json.rate),
      Amount.fromJSON(json.amount),
      json.tax ? Tax.fromJSON(json.tax) : null,
      json.tip ? Tax.fromJSON(json.tip) : null,
    );
  }

  toJSON() {
    return {
      currency: this.#currency.toString(),
      rate: this.#rate.toJSON(),
      amount: this.#amount.toJSON(),
      tax: this.#tax?.toJSON(),
      tip: this.#tip?.toJSON(),
    };
  }

  get currency(): Currency {
    return this.#currency;
  }

  get rate(): Amount {
    return this.#rate;
  }

  get amount(): Amount {
    return this.#amount;
  }

  get tax(): Tax | null {
    return this.#tax;
  }

  get tip(): Tax | null {
    return this.#tip;
  }

  get total(): Amount {
    return this.#amount.plus(this.#tax?.amount).plus(this.#tip?.amount);
  }
}
