/**
 * Converts a File object to a Base64 string
 * @param file - The file to convert
 * @returns Promise<string> - The Base64 encoded string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to Base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Formats a number as currency (Philippine Peso)
 * @param amount - The amount to format
 * @returns string - Formatted currency string
 */
export function formatCurrency(amount: number | string): string {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(numericAmount);
}
