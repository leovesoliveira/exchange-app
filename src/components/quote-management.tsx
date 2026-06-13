import { buildValidQuotes } from "@/helpers";
import { useDebouncedEffect } from "@/hooks/use-debounced-effect";
import { useExchangeStore } from "@/stores/exchange/exchange-store";
import { Currency } from "@/value-objects/currency";
import {
  ArrowRightLeftIcon,
  CheckIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CurrencyInput } from "./currency-input";
import { CurrencySelect } from "./currency-select";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const AUTOSAVE_DELAY = 600;
const SAVED_FEEDBACK_DURATION = 2000;

type SaveStatus = "idle" | "saving" | "saved";

type QuotesFormData = {
  quotes: {
    toCurrency: string;
    toAmount: number;
  }[];
};

export const QuoteManagement = () => {
  const { t, i18n } = useTranslation();
  const { fromCurrency, quotes, setQuotes } = useExchangeStore();

  const [status, setStatus] = useState<SaveStatus>("idle");

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

  const { fields, append, remove } = useFieldArray({
    name: "quotes",
    control: quotesForm.control,
  });

  // The form is the single source of truth while editing; autosave flows
  // one-way form -> store, so we watch the form rather than the store.
  const watchedQuotes = useWatch({
    control: quotesForm.control,
    name: "quotes",
  });

  // `isDirty` is true only after the user actually edits a field, so it tells
  // real changes apart from the form merely initializing when the panel opens.
  const { isDirty } = quotesForm.formState;

  // Show "saving" as soon as the user changes the form.
  useEffect(() => {
    if (!isDirty) {
      return;
    }

    setStatus("saving");
  }, [watchedQuotes, isDirty]);

  // Persist the valid rows once the user stops typing.
  useDebouncedEffect(
    () => {
      if (!isDirty || !fromCurrency) {
        return;
      }

      setQuotes(buildValidQuotes(fromCurrency, watchedQuotes ?? []));
      setStatus("saved");
    },
    [watchedQuotes],
    AUTOSAVE_DELAY,
  );

  // Auto-hide the "saved" confirmation after a short while.
  useEffect(() => {
    if (status !== "saved") {
      return;
    }

    const timeout = setTimeout(
      () => setStatus("idle"),
      SAVED_FEEDBACK_DURATION,
    );

    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <div className="px-4">
      <div className="flex min-h-9 items-center justify-between">
        <h3 className="flex items-center gap-2">
          <ArrowRightLeftIcon width={20} height={20} />

          <span className="text-sm font-medium">
            {t("quote.management.title")}
          </span>
        </h3>

        {status === "saving" && (
          <span className="text-muted-foreground text-sm">
            {t("quote.management.saving")}
          </span>
        )}

        {status === "saved" && (
          <span className="text-muted-foreground flex items-center gap-1 text-sm">
            <CheckIcon width={16} height={16} />
            {t("quote.management.saved")}
          </span>
        )}
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
