import { useExchangeStore } from "@/stores/exchange/exchange-store";
import {
  ArrowRightLeftIcon,
  ArrowUpFromDot,
  CircleDollarSignIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExchangeCalculationForm } from "./exchange-calculation-form";
import { ExchangeList } from "./exchange-list";
import { FirstExchange } from "./first-exchange";
import { Logo } from "./logo";
import { Settings } from "./settings";
import { ThemeProvider } from "./theme-provider";
import { Card, CardContent } from "./ui/card";

export default function App() {
  const { t } = useTranslation();
  const { quotes, fromCurrency } = useExchangeStore();

  const exchangeFormRef = useRef<HTMLDivElement | null>(null);
  const [exchangeFormHeight, setExchangeFormrHeight] = useState(0);

  useEffect(() => {
    const updateExchangeFormRefHeight = () => {
      if (exchangeFormRef.current) {
        setExchangeFormrHeight(exchangeFormRef.current.offsetHeight);
      }
    };

    updateExchangeFormRefHeight();

    const observer = new MutationObserver(updateExchangeFormRefHeight);
    if (exchangeFormRef.current) {
      observer.observe(exchangeFormRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <div
        ref={exchangeFormRef}
        className="bg-card border-t-secondary fixed right-0 bottom-0 left-0 z-10 w-full border-t p-4 shadow-[0_-5px_15px_0] shadow-slate-900/10"
      >
        <div className="container mx-auto w-full max-w-sm">
          <FirstExchange />

          <div className="flex items-center justify-between">
            <Logo />
            <Settings />
          </div>

          {fromCurrency ? (
            quotes.length > 0 ? (
              <ExchangeCalculationForm />
            ) : (
              <Card className="relative mt-4">
                <CardContent className="flex flex-col items-center gap-2">
                  <ArrowRightLeftIcon width={48} height={48} />

                  <p className="text-center text-xl">{t("quotes.empty")}</p>
                </CardContent>

                <ArrowUpFromDot className="absolute -top-2 right-1 animate-bounce" />
              </Card>
            )
          ) : (
            <Card className="relative mt-4">
              <CardContent className="flex flex-col items-center gap-2">
                <CircleDollarSignIcon width={48} height={48} />

                <p className="text-center text-xl">
                  {t("from.currency.empty")}
                </p>
              </CardContent>

              <ArrowUpFromDot className="absolute -top-2 right-1 animate-bounce" />
            </Card>
          )}
        </div>
      </div>

      <div
        style={{ marginBottom: `${exchangeFormHeight}px` }}
        className="relative z-0 container mx-auto w-full max-w-sm px-4"
      >
        <ExchangeList />
      </div>
    </ThemeProvider>
  );
}
