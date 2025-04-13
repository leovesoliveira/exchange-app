import { parseEnum } from "@helpers/parse-enum";
import { languages } from "@i18n/languages";
import {
  exchangesWithoutFirstSelector,
  firstExchangeSelector,
} from "@stores/exchange/exchange-selectors";
import { useExchangeStore } from "@stores/exchange/exchange-store";
import { Amount } from "@value-objects/amount";
import { Currency } from "@value-objects/currency";
import { Quote } from "@value-objects/quote";
import { Uuid } from "@value-objects/uuid";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";

type FromCurrencyFormData = {
  fromCurrency: string;
};

type QuotesFormData = {
  quotes: {
    toCurrency: string;
    toAmount: string;
  }[];
};

type CalculateFormData = {
  amount: string;
  tax: string;
  tip: string;
};

export default function App() {
  const { t, i18n } = useTranslation();

  const {
    fromCurrency,
    setFromCurrency,
    quotes,
    setQuotes,
    clearQuotes,
    clearExchanges,
    calculeExchange,
    removeExchange,
  } = useExchangeStore();
  const firstExchange = useExchangeStore(firstExchangeSelector);
  const exchanges = useExchangeStore(useShallow(exchangesWithoutFirstSelector));

  const fromCurrencyForm = useForm<FromCurrencyFormData>({
    defaultValues: {
      fromCurrency: fromCurrency ? fromCurrency.toString() : "",
    },
  });

  const quotesForm = useForm<QuotesFormData>({
    defaultValues: {
      quotes:
        quotes && quotes.length > 0
          ? quotes.map((quote) => ({
              toCurrency: quote.toCurrency.toString(),
              toAmount: quote.amount.toString(),
            }))
          : [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "quotes",
    control: quotesForm.control,
  });

  const calculateForm = useForm<CalculateFormData>({
    defaultValues: {
      amount: "0",
      tax: "0",
      tip: "0",
    },
  });

  const handleFromCurrency: SubmitHandler<FromCurrencyFormData> = (data) => {
    if (fromCurrency?.toString() !== data.fromCurrency) {
      clearQuotes();
    }

    setFromCurrency(parseEnum(Currency, data.fromCurrency));
  };

  const handleQuote: SubmitHandler<QuotesFormData> = (data) => {
    if (!fromCurrency) {
      throw new Error("From currency is not set");
    }

    const quotes = data.quotes.map((quote) => {
      const toCurrency = parseEnum(Currency, quote.toCurrency);
      const toAmount = new Amount(quote.toAmount);
      return new Quote(fromCurrency, toCurrency, toAmount);
    });

    setQuotes(quotes);
  };

  const handleCalculate: SubmitHandler<CalculateFormData> = (data) => {
    const amount = new Amount(data.amount);
    const tax = parseFloat(data.tax) > 0 ? new Amount(data.tax) : null;
    const tip = parseFloat(data.tip) > 0 ? new Amount(data.tip) : null;

    calculeExchange(Uuid.generate(), amount, tax, tip);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("appName")}</h1>

      <div>
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            className="px-2 bg-gray-300"
          >
            {language.name}
          </button>
        ))}
      </div>

      <form
        onSubmit={fromCurrencyForm.handleSubmit(handleFromCurrency)}
        className="my-4"
      >
        <div>
          <label htmlFor="fromCurrency">FROM </label>
          <input
            id="fromCurrency"
            type="text"
            className="border border-black"
            {...fromCurrencyForm.register("fromCurrency")}
          />
        </div>
        <button className="px-2 bg-gray-300">Save</button>
      </form>

      <hr />

      <form onSubmit={quotesForm.handleSubmit(handleQuote)} className="my-4">
        {fields.map((field, index) => (
          <div key={field.id} className="my-4">
            <div>
              <label htmlFor={`toCurrency${index}`}>TO</label>
              <input
                id={`toCurrency${index}`}
                type="text"
                className="border border-black"
                {...quotesForm.register(`quotes.${index}.toCurrency`)}
              />
            </div>

            <div>
              <label htmlFor={`toAmount${index}`}>AMOUNT</label>
              <input
                id={`toAmount${index}`}
                type="text"
                className="border border-black"
                {...quotesForm.register(`quotes.${index}.toAmount`)}
              />
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="px-2 bg-gray-300"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ toCurrency: "", toAmount: "" })}
          className="px-2 bg-gray-300"
        >
          Add
        </button>

        <button type="submit" className="px-2 bg-gray-300">
          Save
        </button>
      </form>

      <hr />
      {firstExchange && (
        <div className="my-4">
          <hr />
          <hr />
          <p>{firstExchange.fromCurrency.toString()}</p>
          <p>{firstExchange.fromAmount.toString()}</p>
          <p>
            <span>TAX: </span>
            {firstExchange.fromTax
              ? firstExchange.fromTax.amount.toString()
              : "0.0"}
            <span> / </span>
            {firstExchange.fromTax
              ? firstExchange.fromTax.percent.toString()
              : "0"}
            %
          </p>
          <p>
            <span>TIP: </span>
            {firstExchange.fromTip
              ? firstExchange.fromTip.amount.toString()
              : "0.0"}
            <span> / </span>
            {firstExchange.fromTip
              ? firstExchange.fromTip.percent.toString()
              : "0"}
            %
          </p>
          <p>TOTAL: {firstExchange.total.toString()}</p>
          <ul>
            {firstExchange.conversions.map((conversion) => (
              <li
                key={`${firstExchange.fromCurrency.toString()}-${conversion.currency.toString()}-${conversion.amount.toString()}-${firstExchange.exchangedAt.toISOString()}`}
              >
                <hr />
                <p>TO {conversion.currency.toString()}</p>
                <p>{conversion.amount.toString()}</p>
                <p>
                  <span>TAX: </span>
                  {conversion.tax ? conversion.tax.amount.toString() : "0.0"}
                  <span> / </span>
                  {conversion.tax ? conversion.tax.percent.toString() : "0"}%
                </p>
                <p>
                  <span>TIP: </span>
                  {conversion.tip ? conversion.tip.amount.toString() : "0.0"}
                  <span> / </span>
                  {conversion.tip ? conversion.tip.percent.toString() : "0"}%
                </p>
                <p>TOTAL: {conversion.total.toString()}</p>
                <hr />
              </li>
            ))}
          </ul>
          <hr />
          <hr />
        </div>
      )}

      <form
        onSubmit={calculateForm.handleSubmit(handleCalculate)}
        className="my-4"
      >
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="text"
            className="border border-black"
            {...calculateForm.register("amount")}
          />
        </div>

        <div>
          <label htmlFor="tax">Tax</label>
          <input
            id="tax"
            type="text"
            className="border border-black"
            {...calculateForm.register("tax")}
          />
        </div>

        <div>
          <label htmlFor="tip">Tip</label>
          <input
            id="tip"
            type="text"
            className="border border-black"
            {...calculateForm.register("tip")}
          />
        </div>

        <button className="px-2 bg-gray-300">Calculate</button>
      </form>

      <hr />

      <button onClick={() => clearExchanges()}>Clear Exchanges</button>

      <div>
        {exchanges.length > 0 ? (
          <ul>
            {exchanges.map((exchange) => (
              <li
                key={`${exchange.fromCurrency.toString()}-${exchange.fromAmount.toString()}-${exchange.exchangedAt.toISOString()}`}
                className="my-4"
              >
                <hr />
                <hr />
                <button
                  type="button"
                  onClick={() => removeExchange(exchange.id)}
                  className="px-2 bg-gray-300"
                >
                  Remove
                </button>
                <p>{exchange.fromCurrency.toString()}</p>
                <p>{exchange.fromAmount.toString()}</p>
                <p>
                  <span>TAX: </span>
                  {exchange.fromTax
                    ? exchange.fromTax.amount.toString()
                    : "0.0"}
                  <span> / </span>
                  {exchange.fromTax ? exchange.fromTax.percent.toString() : "0"}
                  %
                </p>
                <p>
                  <span>TIP: </span>
                  {exchange.fromTip
                    ? exchange.fromTip.amount.toString()
                    : "0.0"}
                  <span> / </span>
                  {exchange.fromTip ? exchange.fromTip.percent.toString() : "0"}
                  %
                </p>
                <p>TOTAL: {exchange.total.toString()}</p>
                <ul>
                  {exchange.conversions.map((conversion) => (
                    <li
                      key={`${exchange.fromCurrency.toString()}-${conversion.currency.toString()}-${conversion.amount.toString()}-${exchange.exchangedAt.toISOString()}`}
                    >
                      <hr />
                      <p>TO {conversion.currency.toString()}</p>
                      <p>{conversion.amount.toString()}</p>
                      <p>
                        <span>TAX: </span>
                        {conversion.tax
                          ? conversion.tax.amount.toString()
                          : "0.0"}
                        <span> / </span>
                        {conversion.tax
                          ? conversion.tax.percent.toString()
                          : "0"}
                        %
                      </p>
                      <p>
                        <span>TIP: </span>
                        {conversion.tip
                          ? conversion.tip.amount.toString()
                          : "0.0"}
                        <span> / </span>
                        {conversion.tip
                          ? conversion.tip.percent.toString()
                          : "0"}
                        %
                      </p>
                      <p>TOTAL: {conversion.total.toString()}</p>
                      <hr />
                    </li>
                  ))}
                </ul>
                <hr />
                <hr />
              </li>
            ))}
          </ul>
        ) : (
          <p>No exchanges yet</p>
        )}
      </div>
    </div>
  );
}
