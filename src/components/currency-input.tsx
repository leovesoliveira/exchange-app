import { Currency } from "@/value-objects/currency";
import { InputHTMLAttributes, useMemo, useState } from "react";
import { Input } from "./ui/input";

type CurrencyInputProps = {
  currency: Currency;
  locale?: string;
  value?: number;
  onValueChange?: (value: number) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const CurrencyInput = ({
  currency,
  locale = "en",
  value = 0,
  onValueChange,
  ...props
}: CurrencyInputProps) => {
  const [rawValue, setRawValue] = useState(value);

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toString(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [currency, locale]);

  const formatValue = (val: number) => formatter.format(val);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    const numericValue =
      parseFloat(onlyNumbers !== "" ? onlyNumbers : "0") / 100;

    setRawValue(numericValue);
    onValueChange?.(numericValue);
  };

  return (
    <Input
      {...props}
      value={formatValue(rawValue)}
      onChange={handleChange}
      inputMode="numeric"
      className="text-lg md:text-lg"
    />
  );
};
