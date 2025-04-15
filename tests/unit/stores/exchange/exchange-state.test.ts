import { ExchangeState, initialState } from "@stores/exchange/exchange-state";

describe("ExchangeState", () => {
  it("should have the correct initial state", () => {
    const expectedState: ExchangeState = {
      fromCurrency: null,
      quotes: [],
      exchanges: [],
    };

    expect(initialState).toEqual(expectedState);
  });
});
