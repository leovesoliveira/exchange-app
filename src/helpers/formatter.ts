export const currencyFormatter = (locale: string = "en", currency: string) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const moneyFormatter = (locale: string = "en") => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const percentageFormatter = (locale: string = "en") => {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  });
};

export const dateFormatter = (locale: string = "en") => {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
