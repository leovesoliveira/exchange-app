import { useExchangeStore } from "@/stores/exchange/exchange-store";
import { Currency } from "@/value-objects/currency";
import { CircleDollarSignIcon } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CurrencySelect } from "./currency-select";
import { Label } from "./ui/label";

export const FromCurrencySelection = () => {
  const { t } = useTranslation();
  const { fromCurrency, setFromCurrency, clearQuotes } = useExchangeStore();

  const handleFromCurrencyChange = useCallback(
    (currency: Currency | null) => {
      if (currency !== fromCurrency) {
        clearQuotes();
      }

      setFromCurrency(currency);
    },
    [fromCurrency, setFromCurrency, clearQuotes],
  );

  return (
    <div className="px-4 gap-4 flex justify-between items-center">
      <Label htmlFor="from-currency-selection">
        <CircleDollarSignIcon width={20} height={20} />
        {t("currency.select.label")}
      </Label>

      <div className="w-full truncate max-w-52">
        <CurrencySelect
          id="from-currency-selection"
          currency={fromCurrency}
          setCurrency={handleFromCurrencyChange}
        />
      </div>
    </div>
  );
};
