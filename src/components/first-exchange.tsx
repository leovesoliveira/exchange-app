import { firstExchangeSelector } from "@/stores/exchange/exchange-selectors";
import { useExchangeStore } from "@/stores/exchange/exchange-store";
import { ExchangeCard } from "./exchange-card";

export const FirstExchange = () => {
  const exchange = useExchangeStore(firstExchangeSelector);

  return (
    exchange && (
      <div className="mb-2">
        <ExchangeCard exchange={exchange} />
      </div>
    )
  );
};
