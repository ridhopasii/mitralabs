/**
 * Utility to download a specific URL as a PDF
 * It works by temporarily rendering the page in a hidden iframe or 
 * by navigating and triggering the PDF generation.
 * 
 * For Next.js client-side, the most reliable way without a backend 
 * is to use html2pdf on the actual target page.
 */

export const downloadInvoicePDF = (invoiceNumber: string) => {
  const url = `/invoice/${invoiceNumber}?download=true`;
  const win = window.open(url, '_blank');
  
  if (!win || win.closed || typeof win.closed === 'undefined') {
    alert("Mohon izinkan pop-up untuk situs ini agar invoice bisa diunduh.");
    return false;
  }
  
  return true;
};
