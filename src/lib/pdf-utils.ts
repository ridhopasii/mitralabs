/**
 * Utility to download a specific URL as a PDF
 * It works by temporarily rendering the page in a hidden iframe or 
 * by navigating and triggering the PDF generation.
 * 
 * For Next.js client-side, the most reliable way without a backend 
 * is to use html2pdf on the actual target page.
 */

export const downloadInvoicePDF = async (invoiceNumber: string) => {
  // We will trigger the download by opening the invoice page with a special query param
  // and let the invoice page handle the auto-generation and closing.
  const win = window.open(`/invoice/${invoiceNumber}?download=true`, '_blank');
  if (win) {
    win.focus();
  }
};
