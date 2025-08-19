export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Takes in number of cents in USD and returns a formatted string.
 * Optionally pads the string with spaces to align the dollar sign.
 * @param cents The amount in cents.
 * @param totalWidth The desired total width of the padded string.
 */
export const moneyToStr = (cents: number, totalWidth?: number): string => {
  const formattedString = formatter.format(cents / 100);
  console.log("max width: ", totalWidth);

  // If no totalWidth is provided, return the unpadded string
  if (totalWidth === undefined || totalWidth <= 0) {
    return formattedString;
  }

  // Get the currency symbol (e.g., "$") and the number part (e.g., "12.34")
  const currencySymbol = formattedString.slice(0, 1);
  const numberString = formattedString.slice(1);

  // Pad the number string with spaces to align the decimal point
  const paddedNumberString = numberString.padStart(
    totalWidth - currencySymbol.length,
    " "
  );

  // Return the combined string
  return currencySymbol + paddedNumberString;
};
