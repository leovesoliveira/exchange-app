import { Amount } from "./amount";

export class Tax {
  readonly #amount: Amount;
  readonly #percent: Amount;

  constructor(amount: Amount, percent: Amount) {
    this.#amount = amount;
    this.#percent = percent;
  }

  static fromJSON(json: { amount: string; percent: string }): Tax {
    return new Tax(Amount.fromJSON(json.amount), Amount.fromJSON(json.percent));
  }

  static calculate(value: Amount, taxPercent: Amount): Tax {
    const taxAmount = value.percentage(taxPercent);
    return new Tax(taxAmount, taxPercent);
  }

  toJSON() {
    return {
      amount: this.#amount.toJSON(),
      percent: this.#percent.toJSON(),
    };
  }

  get amount(): Amount {
    return this.#amount;
  }

  get percent(): Amount {
    return this.#percent;
  }
}
