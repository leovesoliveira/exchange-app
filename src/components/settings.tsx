import { useExchangeStore } from "@/stores/exchange/exchange-store";
import { SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ClearExchangesButton } from "./clear-exchanges-button";
import { FromCurrencySelection } from "./from-currency-selection";
import { LanguageSelection } from "./language-selection";
import { QuoteManagement } from "./quote-management";
import { ThemeSelection } from "./theme-selection";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export const Settings = () => {
  const { t } = useTranslation();
  const { fromCurrency } = useExchangeStore();

  return (
    <div>
      <Sheet key={"options"} defaultOpen={false}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <SettingsIcon />
          </Button>
        </SheetTrigger>

        <SheetContent>
          <div className="flex h-full flex-col justify-between">
            <SheetHeader>
              <SheetTitle>{t("settings.title")}</SheetTitle>
              <SheetDescription>{t("settings.description")}</SheetDescription>
            </SheetHeader>

            <Separator />

            <div className="flex flex-1 flex-col gap-2 overflow-y-scroll py-2">
              <ThemeSelection />

              <Separator />

              <LanguageSelection />

              <Separator />

              <FromCurrencySelection />

              <Separator />

              {fromCurrency && <QuoteManagement />}
            </div>

            <Separator />

            <SheetFooter>
              <ClearExchangesButton />
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
