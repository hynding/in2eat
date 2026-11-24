export const formatPrice = (amount: number, currency: string, locale?: string): string =>
  new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: amount % 1 === 0 ? 0 : 2 }).format(amount);
