import { parseEnum } from "../helpers";
import { Amount } from "./amount";
import { Conversion } from "./conversion";
import { Currency } from "./currency";
import { Tax } from "./tax";

export class Exchange {
  readonly #fromCurrency: Currency;
  readonly #fromAmount: Amount;
  readonly #fromTax: Tax | null;
  readonly #fromTip: Tax | null;
  readonly #conversions: Conversion[];
  readonly #exchangedAt: Date;

  constructor(
    fromCurrency: Currency,
    fromAmount: Amount,
    fromTax: Tax | null,
    fromTip: Tax | null,
    conversions: Conversion[],
    date: Date = new Date(),
  ) {
    this.#fromCurrency = fromCurrency;
    this.#fromAmount = fromAmount;
    this.#fromTax = fromTax;
    this.#fromTip = fromTip;
    this.#conversions = conversions;
    this.#exchangedAt = date;
  }

  static fromJSON(json: any): Exchange {
    return new Exchange(
      parseEnum(Currency, json.fromCurrency),
      Amount.fromJSON(json.fromAmount),
      json.fromTax ? Tax.fromJSON(json.fromTax) : null,
      json.fromTip ? Tax.fromJSON(json.fromTip) : null,
      json.conversions.map((conversion: any) =>
        Conversion.fromJSON(conversion),
      ),
      new Date(json.exchangedAt),
    );
  }

  toJSON() {
    return {
      fromCurrency: this.#fromCurrency.toString(),
      fromAmount: this.#fromAmount.toJSON(),
      fromTax: this.#fromTax?.toJSON(),
      fromTip: this.#fromTip?.toJSON(),
      conversions: this.#conversions.map((conversion) => conversion.toJSON()),
      exchangedAt: this.#exchangedAt,
    };
  }

  get fromCurrency(): Currency {
    return this.#fromCurrency;
  }

  get fromAmount(): Amount {
    return this.#fromAmount;
  }

  get fromTax(): Tax | null {
    return this.#fromTax;
  }

  get fromTip(): Tax | null {
    return this.#fromTip;
  }

  get conversions(): Conversion[] {
    return this.#conversions;
  }

  get exchangedAt(): Date {
    return this.#exchangedAt;
  }

  get total(): Amount {
    return this.#fromAmount
      .plus(this.#fromTax?.amount)
      .plus(this.#fromTip?.amount);
  }
}
