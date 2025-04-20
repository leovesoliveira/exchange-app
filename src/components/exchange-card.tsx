import {
  currencyFormatter,
  dateFormatter,
  moneyFormatter,
  percentageFormatter,
} from "@/helpers";
import { Amount } from "@/value-objects/amount";
import { Currency } from "@/value-objects/currency";
import { Exchange } from "@/value-objects/exchange";
import { Tax } from "@/value-objects/tax";
import { useTranslation } from "react-i18next";
import { CountryFlag } from "./country-flag";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

type ExchangeCardProps = {
  exchange: Exchange;
};

export const ExchangeCard = ({
  exchange: {
    id,
    fromCurrency,
    fromAmount,
    fromTax,
    fromTip,
    total,
    conversions,
    exchangedAt,
  },
}: ExchangeCardProps) => {
  const { i18n } = useTranslation();

  return (
    <div className="">
      <Item
        currency={fromCurrency}
        amount={fromAmount}
        tax={fromTax}
        tip={fromTip}
        total={total}
      />

      <div>
        {conversions.map((conversion) => (
          <Item
            key={`${id.toString()}-${conversion.currency.toString()}-${exchangedAt.toISOString()}`}
            currency={conversion.currency}
            amount={conversion.amount}
            tax={conversion.tax}
            tip={conversion.tip}
            total={conversion.total}
          />
        ))}
      </div>

      <span className="text-primary/50 mt-1 block w-full px-2 text-right text-xs italic">
        {dateFormatter(i18n.language).format(exchangedAt)}
      </span>
    </div>
  );
};

const Item = ({
  currency,
  amount,
  tax,
  tip,
  total,
}: {
  currency: Currency;
  amount: Amount;
  tax: Tax | null;
  tip: Tax | null;
  total: Amount;
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Card className="relative overflow-hidden rounded-xs py-1">
      <CardContent className="relative z-10 flex flex-col gap-0.5 px-1">
        <div className="flex items-center justify-between">
          <div className="ml-1 flex items-center gap-2">
            <span className="font-mono text-lg font-normal">{currency}</span>
            <CountryFlag currency={currency} />
          </div>

          <span className="flex items-center gap-2 text-right">
            <span>{t("exchange.card.total")}</span>
            <span className="font-medium">
              {currencyFormatter(i18n.language, currency).format(
                parseFloat(total.toString()),
              )}
            </span>
          </span>
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <AmountLabeled
            label={t("exchange.calculation.form.tax.label")}
            amount={tax ? tax.amount.toString() : "0"}
            percentage={tax ? tax.percent.toString() : "0"}
          />

          <AmountLabeled
            label={t("exchange.calculation.form.tip.label")}
            amount={tip ? tip.amount.toString() : "0"}
            percentage={tip ? tip.percent.toString() : "0"}
          />

          <AmountLabeled
            label={t("exchange.calculation.form.amount.label")}
            amount={amount.toString()}
          />
        </div>
      </CardContent>

      <div className="absolute right-2 bottom-0 z-0 scale-[250%] -rotate-12 opacity-15">
        <CountryFlag currency={currency} noBorder />
      </div>
    </Card>
  );
};

const AmountLabeled = ({
  label,
  amount,
  percentage,
}: {
  label: string;
  amount: string;
  percentage?: string;
}) => {
  const { i18n } = useTranslation();

  return (
    <div className="flex min-w-10 items-center justify-between gap-0.5">
      <span className="text-xs">{label}</span>

      <span className="text-xs">
        {moneyFormatter(i18n.language).format(parseFloat(amount))}
      </span>

      {percentage && (
        <span className="text-[0.625rem] font-medium opacity-75">
          (
          {percentage &&
            percentageFormatter(i18n.language).format(parseFloat(percentage))}
          %)
        </span>
      )}
    </div>
  );
};
