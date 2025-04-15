import { parseEnum } from "@/helpers";
import { Amount } from "./amount";
import { Conversion } from "./conversion";
import { Currency } from "./currency";
import { Tax } from "./tax";
import { Uuid } from "./uuid";

export class Exchange {
  readonly #id: Uuid;
  readonly #fromCurrency: Currency;
  readonly #fromAmount: Amount;
  readonly #fromTax: Tax | null;
  readonly #fromTip: Tax | null;
  readonly #conversions: Conversion[];
  readonly #exchangedAt: Date;

  constructor(
    id: Uuid,
    fromCurrency: Currency,
    fromAmount: Amount,
    fromTax: Tax | null,
    fromTip: Tax | null,
    conversions: Conversion[],
    date: Date = new Date(),
  ) {
    this.#id = id;
    this.#fromCurrency = fromCurrency;
    this.#fromAmount = fromAmount;
    this.#fromTax = fromTax;
    this.#fromTip = fromTip;
    this.#conversions = conversions;
    this.#exchangedAt = date;
  }

  static fromJSON(json: ExchangeJSON): Exchange {
    return new Exchange(
      Uuid.fromJSON(json.id),
      parseEnum(Currency, json.fromCurrency),
      Amount.fromJSON(json.fromAmount),
      json.fromTax ? Tax.fromJSON(json.fromTax) : null,
      json.fromTip ? Tax.fromJSON(json.fromTip) : null,
      json.conversions.map(
        (conversion: {
          currency: string;
          rate: string;
          amount: string;
          tax?: { amount: string; percent: string };
          tip?: { amount: string; percent: string };
        }) => Conversion.fromJSON(conversion),
      ),
      new Date(json.exchangedAt),
    );
  }

  toJSON() {
    return {
      id: this.#id.toJSON(),
      fromCurrency: this.#fromCurrency.toString(),
      fromAmount: this.#fromAmount.toJSON(),
      fromTax: this.#fromTax?.toJSON(),
      fromTip: this.#fromTip?.toJSON(),
      conversions: this.#conversions.map((conversion) => conversion.toJSON()),
      exchangedAt: this.#exchangedAt,
    };
  }

  get id(): Uuid {
    return this.#id;
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

export type ExchangeJSON = {
  id: string;
  fromCurrency: string;
  fromAmount: string;
  fromTax: { amount: string; percent: string } | null;
  fromTip: { amount: string; percent: string } | null;
  conversions: {
    currency: string;
    rate: string;
    amount: string;
    tax?: { amount: string; percent: string };
    tip?: { amount: string; percent: string };
  }[];
  exchangedAt: string;
};
