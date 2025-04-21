import { exchangesWithoutFirstSelector } from "@/stores/exchange/exchange-selectors";
import { useExchangeStore } from "@/stores/exchange/exchange-store";
import { CircleOffIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";
import { ExchangeCard } from "./exchange-card";
import { Button } from "./ui/button";

export const ExchangeList = () => {
  const { t } = useTranslation();
  const { removeExchange } = useExchangeStore();
  const exchanges = useExchangeStore(useShallow(exchangesWithoutFirstSelector));

  return (
    <div className="py-4">
      {exchanges.length > 0 ? (
        <ul className="flex flex-col gap-4 opacity-75">
          {exchanges.map((exchange) => (
            <li key={exchange.id.toString()} className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExchange(exchange.id)}
                className="absolute -bottom-2 -left-4 z-10 scale-[65%] opacity-50"
              >
                <Trash2Icon />
                <span className="leading-none uppercase">
                  {t("exchange.item.remove")}
                </span>
              </Button>

              <ExchangeCard exchange={exchange} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-primary flex flex-col items-center justify-center gap-2 opacity-15">
          <CircleOffIcon className="opacity-75" width={48} height={48} />

          <span className="text-center text-lg font-medium">
            {t("exchange.history.list.empty")}
          </span>
        </div>
      )}
    </div>
  );
};
