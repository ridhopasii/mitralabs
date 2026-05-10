/**
 * Utility to download invoice as PDF directly without opening print dialog
 * Opens invoice page in new tab with auto-download parameter
 */

export const downloadInvoicePDF = (invoiceNumber: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Open invoice page in new tab with download parameter
      // The invoice page will auto-generate and download PDF, then close
      const downloadUrl = `/invoice/${invoiceNumber}?download=true`;
      window.open(downloadUrl, '_blank');

      // Resolve immediately since we're opening in new tab
      resolve(true);
    } catch (error) {
      console.error('Error opening invoice for download:', error);
      resolve(false);
    }
  });
};
