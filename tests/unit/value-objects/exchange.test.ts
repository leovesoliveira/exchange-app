import { Amount } from "@value-objects/amount";
import { Conversion } from "@value-objects/conversion";
import { Currency } from "@value-objects/currency";
import { Exchange } from "@value-objects/exchange";
import { Tax } from "@value-objects/tax";
import { Uuid } from "@value-objects/uuid";

describe("Exchange", () => {
  const conversionJSON = {
    currency: "BRL",
    rate: "4.00",
    amount: "100",
    tax: {
      amount: "15.0000000000",
      percent: "15.0000000000",
    },
    tip: {
      amount: "5.0000000000",
      percent: "10.0000000000",
    },
  };

  const validExchangeJSON = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    fromCurrency: "USD",
    fromAmount: "100",
    fromTax: {
      amount: "15.0000000000",
      percent: "15.0000000000",
    },
    fromTip: {
      amount: "5.0000000000",
      percent: "10.0000000000",
    },
    conversions: [conversionJSON],
    exchangedAt: "2023-04-13T12:00:00Z",
  };

  const partialExchangeJSON = {
    id: "550e8400-e29b-41d4-a716-446655440001",
    fromCurrency: "BRL",
    fromAmount: "200",
    fromTax: null,
    fromTip: null,
    conversions: [],
    exchangedAt: "2023-04-14T08:30:00Z",
  };

  it("should create an Exchange instance from JSON (with tax, tip, and conversions)", () => {
    const exchange = Exchange.fromJSON(validExchangeJSON);

    expect(exchange.id.value).toBe(validExchangeJSON.id);

    expect(exchange.fromCurrency).toBe(Currency.UNITED_STATES_DOLLAR);

    const expectedFromAmount = Amount.fromJSON(validExchangeJSON.fromAmount);
    expect(exchange.fromAmount.value).toBe(expectedFromAmount.value);

    const expectedFromTax = Tax.fromJSON(validExchangeJSON.fromTax);
    const expectedFromTip = Tax.fromJSON(validExchangeJSON.fromTip);
    expect(exchange.fromTax?.amount.value).toBe(expectedFromTax.amount.value);
    expect(exchange.fromTip?.amount.value).toBe(expectedFromTip.amount.value);

    expect(exchange.conversions).toHaveLength(1);
    const conversion = exchange.conversions[0];
    expect(conversion.currency).toBe(Currency.BRAZILIAN_REAL);
    const expectedConversionAmount = Amount.fromJSON(conversionJSON.amount);
    expect(conversion.amount.value).toBe(expectedConversionAmount.value);

    expect(exchange.exchangedAt.toISOString()).toBe(
      new Date(validExchangeJSON.exchangedAt).toISOString(),
    );
  });

  it("should create an Exchange instance from JSON (with null tax/tip and no conversions)", () => {
    const exchange = Exchange.fromJSON(partialExchangeJSON);

    expect(exchange.id.value).toBe(partialExchangeJSON.id);
    expect(exchange.fromCurrency).toBe(Currency.BRAZILIAN_REAL);
    const expectedFromAmount = Amount.fromJSON(partialExchangeJSON.fromAmount);
    expect(exchange.fromAmount.value).toBe(expectedFromAmount.value);
    expect(exchange.fromTax).toBeNull();
    expect(exchange.fromTip).toBeNull();
    expect(exchange.conversions).toHaveLength(0);
    expect(exchange.exchangedAt.toISOString()).toBe(
      new Date(partialExchangeJSON.exchangedAt).toISOString(),
    );
  });

  it("should compute total correctly", () => {
    const exchange = Exchange.fromJSON(validExchangeJSON);
    const total = exchange.total;
    expect(total.value).toBe("120.0000000000");
  });

  it("should serialize an Exchange instance to JSON", () => {
    const exchange = Exchange.fromJSON(validExchangeJSON);
    const jsonOutput = exchange.toJSON();

    expect(jsonOutput.id).toBe(Uuid.fromJSON(validExchangeJSON.id).toJSON());
    expect(jsonOutput.fromCurrency).toBe("USD");
    expect(jsonOutput.fromAmount).toBe(
      Amount.fromJSON(validExchangeJSON.fromAmount).toJSON(),
    );
    expect(jsonOutput.fromTax).toStrictEqual(
      Tax.fromJSON(validExchangeJSON.fromTax).toJSON(),
    );
    expect(jsonOutput.fromTip).toStrictEqual(
      Tax.fromJSON(validExchangeJSON.fromTip).toJSON(),
    );

    expect(jsonOutput.conversions).toHaveLength(
      validExchangeJSON.conversions.length,
    );
    const conversionJSONOutput = jsonOutput.conversions[0];
    const expectedConversionJSON = Conversion.fromJSON(conversionJSON).toJSON();
    expect(conversionJSONOutput).toEqual(expectedConversionJSON);

    expect(new Date(jsonOutput.exchangedAt).toISOString()).toBe(
      new Date(validExchangeJSON.exchangedAt).toISOString(),
    );
  });
});
