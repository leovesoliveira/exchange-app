import { useExchangeStore } from "@/stores/exchange/exchange-store";
import { OctagonXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export const ClearExchangesButton = () => {
  const { t } = useTranslation();
  const { exchanges, clearExchanges } = useExchangeStore();
  const [hasExchanges, setHasExchanges] = useState(true);

  useEffect(() => setHasExchanges(exchanges.length > 0), [exchanges]);

  return (
    <Button
      onClick={() => clearExchanges()}
      className="flex w-full items-center gap-2"
      disabled={!hasExchanges}
    >
      <OctagonXIcon />
      {t("clear.exchanges.button")}
    </Button>
  );
};
