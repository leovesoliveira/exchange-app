export class Amount {
  static readonly ZERO = 0;
  static readonly SCALE = 10;
  static readonly NORMALIZER = Math.pow(10, Amount.SCALE);

  readonly #value: string;

  constructor(value: string) {
    if (!this.isValidNumber(value)) {
      throw new Error("Amount need to be a numeric value");
    }

    if (!this.isGreaterThanZero(value)) {
      throw new Error("Amount cannot be zero or negative");
    }

    this.#value = Number(value).toFixed(Amount.SCALE);
  }

  static fromJSON(json: string): Amount {
    return new Amount(json);
  }

  private isValidNumber(value: string) {
    return !isNaN(Number(value));
  }

  private isGreaterThanZero(value: string) {
    return Number(value) > Amount.ZERO;
  }

  private normalize(amount: Amount) {
    return Number(amount.value) * Amount.NORMALIZER;
  }

  private unNormalize(value: number) {
    return value / Amount.NORMALIZER;
  }

  public plus(amount?: Amount): Amount {
    if (!amount) {
      return this;
    }

    const sum = this.normalize(this) + this.normalize(amount);

    return new Amount(this.unNormalize(sum).toString());
  }

  public times(amount?: Amount): Amount {
    if (!amount) {
      return this;
    }

    const product =
      (this.normalize(this) * this.normalize(amount)) / Amount.NORMALIZER;

    return new Amount(this.unNormalize(product).toString());
  }

  public dividedBy(amount?: Amount): Amount {
    if (!amount) {
      return this;
    }

    const quotient =
      (this.normalize(this) / this.normalize(amount)) * Amount.NORMALIZER;

    return new Amount(this.unNormalize(quotient).toString());
  }

  public percentage(amount?: Amount): Amount {
    if (!amount) {
      return this;
    }

    const product = this.times(amount);
    const quotient = product.dividedBy(new Amount("100"));

    return quotient;
  }

  toString() {
    return this.#value;
  }

  toJSON() {
    return this.#value;
  }

  get value(): string {
    return this.#value;
  }
}
