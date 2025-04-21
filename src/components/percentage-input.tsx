import { InputHTMLAttributes, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";

type PercentageInputProps = {
  locale?: string;
  value?: number;
  onValueChange?: (value: number) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const PercentageInput = ({
  locale = "en-US",
  value = 0,
  onValueChange,
  ...props
}: PercentageInputProps) => {
  const [rawValue, setRawValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [locale]);

  const formatValue = (val: number) => formatter.format(val / 100);

  const handleFocus = () => {
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        const position = input.value.length - 1;
        input.setSelectionRange(position, position);
      }
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    const numericValue =
      parseFloat(onlyNumbers !== "" ? onlyNumbers : "0") / 100;

    handleFocus();

    setRawValue(numericValue);
    onValueChange?.(numericValue);
  };

  return (
    <Input
      {...props}
      ref={inputRef}
      value={formatValue(rawValue)}
      onChange={handleChange}
      onFocus={handleFocus}
      inputMode="numeric"
      className="text-lg md:text-lg"
    />
  );
};
