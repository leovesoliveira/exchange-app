export class Uuid {
  readonly #value: string;

  constructor(value: string) {
    if (!this.isValidUuid(value)) {
      throw new Error("Invalid UUID format");
    }

    this.#value = value;
  }

  static generate(): Uuid {
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      (char) => {
        const r = (Math.random() * 16) | 0;
        const v = char === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );

    return new Uuid(uuid);
  }

  static fromJSON(json: string): Uuid {
    return new Uuid(json);
  }

  private isValidUuid(uuid: string): boolean {
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(uuid);
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
