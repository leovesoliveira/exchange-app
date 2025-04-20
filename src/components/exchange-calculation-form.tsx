import { useExchangeStore } from "@/stores/exchange/exchange-store";
import { Amount } from "@/value-objects/amount";
import { Uuid } from "@/value-objects/uuid";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CurrencyInput } from "./currency-input";
import { PercentageInput } from "./percentage-input";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";

type CalculateFormData = {
  amount: number;
  tax: number;
  tip: number;
};

export const ExchangeCalculationForm = () => {
  const { t, i18n } = useTranslation();
  const { fromCurrency, calculeExchange } = useExchangeStore();

  const calculateForm = useForm<CalculateFormData>({
    defaultValues: {
      amount: 0,
      tax: 0,
      tip: 0,
    },
  });

  const handleCalculate: SubmitHandler<CalculateFormData> = (data) => {
    const amount = new Amount(data.amount.toString());
    const tax = data.tax > 0 ? new Amount(data.tax.toString()) : null;
    const tip = data.tip > 0 ? new Amount(data.tip.toString()) : null;

    calculeExchange(Uuid.generate(), amount, tax, tip);
  };

  return (
    <Form {...calculateForm}>
      <form
        onSubmit={calculateForm.handleSubmit(handleCalculate)}
        className="mt-2 flex flex-col gap-2"
      >
        <FormField
          control={calculateForm.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("exchange.calculation.form.amount.label")}
              </FormLabel>

              <FormControl>
                <CurrencyInput
                  currency={fromCurrency!}
                  locale={i18n.language}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <FormField
            control={calculateForm.control}
            name="tax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("exchange.calculation.form.tax.label")}
                </FormLabel>

                <FormControl>
                  <PercentageInput
                    locale={i18n.language}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={calculateForm.control}
            name="tip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("exchange.calculation.form.tip.label")}
                </FormLabel>

                <FormControl>
                  <PercentageInput
                    locale={i18n.language}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">{t("exchange.calculation.form.button")}</Button>
      </form>
    </Form>
  );
};
