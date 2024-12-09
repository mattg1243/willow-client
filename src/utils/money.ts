const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Takes in number of cents in USD and returns a formatted string
 * @param cents
 */
export const moneyToStr = (cents: number): string => {
  return formatter.format(cents / 100);
};
