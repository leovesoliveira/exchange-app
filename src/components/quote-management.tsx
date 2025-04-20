import { parseEnum } from "@/helpers";
import { useExchangeStore } from "@/stores/exchange/exchange-store";
import { Amount } from "@/value-objects/amount";
import { Currency } from "@/value-objects/currency";
import { Quote } from "@/value-objects/quote";
import { ArrowRightLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CurrencyInput } from "./currency-input";
import { CurrencySelect } from "./currency-select";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type QuotesFormData = {
  quotes: {
    toCurrency: string;
    toAmount: number;
  }[];
};

export const QuoteManagement = () => {
  const { t, i18n } = useTranslation();
  const { fromCurrency, quotes, setQuotes } = useExchangeStore();

  const quotesForm = useForm<QuotesFormData>({
    defaultValues: {
      quotes:
        quotes && quotes.length > 0
          ? quotes.map((quote) => ({
              toCurrency: quote.toCurrency.toString(),
              toAmount: parseFloat(quote.amount.toString()),
            }))
          : [],
    },
  });

  useEffect(() => {
    quotesForm.reset({
      quotes:
        quotes && quotes.length > 0
          ? quotes.map((quote) => ({
              toCurrency: quote.toCurrency.toString(),
              toAmount: parseFloat(quote.amount.toString()),
            }))
          : [],
    });
  }, [quotes]);

  const { fields, append, remove } = useFieldArray({
    name: "quotes",
    control: quotesForm.control,
  });

  const handleQuote: SubmitHandler<QuotesFormData> = (data) => {
    if (!fromCurrency) {
      throw new Error("From currency is not set");
    }

    const quotes = data.quotes.map((quote) => {
      const toCurrency = parseEnum(Currency, quote.toCurrency);
      const toAmount = new Amount(quote.toAmount.toString());
      return new Quote(fromCurrency, toCurrency, toAmount);
    });

    setQuotes(quotes);
  };

  return (
    <div className="px-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2">
          <ArrowRightLeftIcon width={20} height={20} />

          <span className="text-sm font-medium">
            {t("quote.management.title")}
          </span>
        </h3>

        <Button
          variant="outline"
          onClick={quotesForm.handleSubmit(handleQuote)}
        >
          {t("quote.management.save")}
        </Button>
      </div>

      <form className="my-2">
        {fields.length > 0 ? (
          fields.map((field, index) => {
            const toCurrency = quotesForm.watch(`quotes.${index}.toCurrency`);
            return (
              <div key={field.id} className="relative my-4">
                <div className="flex flex-col">
                  <Controller
                    control={quotesForm.control}
                    name={`quotes.${index}.toCurrency`}
                    render={({ field }) => (
                      <CurrencySelect
                        id={`toCurrency${index}`}
                        currency={field.value as Currency}
                        setCurrency={field.onChange}
                      />
                    )}
                  />

                  {toCurrency && (
                    <Controller
                      control={quotesForm.control}
                      name={`quotes.${index}.toAmount`}
                      render={({ field }) => (
                        <CurrencyInput
                          id={`toAmount${index}`}
                          currency={toCurrency as Currency}
                          locale={i18n.language}
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      )}
                    />
                  )}
                </div>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => remove(index)}
                  className="absolute top-4 -right-4 scale-75 rounded-full"
                  title={t("quote.management.item.remove")}
                >
                  <Trash2Icon />
                </Button>
              </div>
            );
          })
        ) : (
          <>
            <Separator />
            <div className="flex flex-col items-center justify-center gap-2 py-3">
              <span className="text-muted-foreground text-sm">
                {t("quote.management.empty")}
              </span>
            </div>
            <Separator />
          </>
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={() => append({ toCurrency: "", toAmount: 0 })}
          className="w-full"
        >
          <PlusIcon />
          {t("quote.management.item.add")}
        </Button>
      </form>
    </div>
  );
};
