import { SubmitHandler, useForm } from "react-hook-form";
import { parseEnum } from "../helpers";
import { useExchangeStore } from "../stores/exchange-store";
import { Amount } from "../value-objects/amount";
import { Currency } from "../value-objects/currency";
import { Quote } from "../value-objects/quote";

type FromCurrencyFormData = {
  fromCurrency: string;
};

type QuotesFormData = {
  toCurrency: string;
  toAmount: string;
};

type CalculateFormData = {
  amount: string;
  tax: string;
  tip: string;
};

export default function App() {
  const {
    fromCurrency,
    setFromCurrency,
    quotes,
    setQuotes,
    clearQuotes,
    exchanges,
    clearExchanges,
    calculeExchange,
  } = useExchangeStore();

  const fromCurrencyForm = useForm<FromCurrencyFormData>({
    defaultValues: {
      fromCurrency: fromCurrency ? fromCurrency.toString() : "",
    },
  });

  const quotesForm = useForm<QuotesFormData>({
    defaultValues: {
      toCurrency:
        quotes && quotes.length > 0 ? quotes[0].toCurrency.toString() : "",
      toAmount: quotes && quotes.length > 0 ? quotes[0].amount.toString() : "",
    },
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
    const toCurrency = parseEnum(Currency, data.toCurrency);
    const toAmount = new Amount(data.toAmount);

    setQuotes([
      new Quote(
        parseEnum(Currency, fromCurrency),
        toCurrency,
        new Amount(data.toAmount),
      ),
    ]);

    quotesForm.reset({
      toCurrency: toCurrency.toString(),
      toAmount: toAmount.toString(),
    });
  };

  const handleCalculate: SubmitHandler<CalculateFormData> = (data) => {
    const amount = new Amount(data.amount);
    const tax = parseFloat(data.tax) > 0 ? new Amount(data.tax) : null;
    const tip = parseFloat(data.tip) > 0 ? new Amount(data.tip) : null;

    calculeExchange(amount, tax, tip);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">ExchangeApp</h1>

      <form onSubmit={fromCurrencyForm.handleSubmit(handleFromCurrency)}>
        <div>
          <label htmlFor="fromCurrency">FROM</label>
          <input
            id="fromCurrency"
            type="text"
            {...fromCurrencyForm.register("fromCurrency")}
          />
        </div>
        <button>Save</button>
      </form>

      <hr />

      <form onSubmit={quotesForm.handleSubmit(handleQuote)}>
        <div>
          <label htmlFor="toCurrency">TO</label>
          <input
            id="toCurrency"
            type="text"
            {...quotesForm.register("toCurrency")}
          />
        </div>

        <div>
          <label htmlFor="toAmount">AMOUNT</label>
          <input
            id="toAmount"
            type="text"
            {...quotesForm.register("toAmount")}
          />
        </div>

        <button>Save</button>
      </form>

      <hr />

      <form onSubmit={calculateForm.handleSubmit(handleCalculate)}>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="text"
            {...calculateForm.register("amount")}
          />
        </div>
        <div>
          <label htmlFor="tax">Tax</label>
          <input id="tax" type="text" {...calculateForm.register("tax")} />
        </div>
        <div>
          <label htmlFor="tip">Tip</label>
          <input id="tip" type="text" {...calculateForm.register("tip")} />
        </div>
        <button>Calculate</button>
      </form>

      <hr />

      <button onClick={() => clearExchanges()}>Clear Exchanges</button>

      <div>
        {exchanges.length > 0 ? (
          <ul>
            {exchanges.map((exchange) => (
              <li
                key={`${exchange.fromCurrency.toString()}-${exchange.fromAmount.toString()}-${exchange.exchangedAt.toISOString()}`}
              >
                <hr />
                <hr />
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
