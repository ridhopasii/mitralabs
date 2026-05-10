/**
 * Utility to download a specific URL as a PDF
 * It works by temporarily rendering the page in a hidden iframe or 
 * by navigating and triggering the PDF generation.
 * 
 * For Next.js client-side, the most reliable way without a backend 
 * is to use html2pdf on the actual target page.
 */

export const downloadInvoicePDF = (invoiceNumber: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Prevent duplicate iframes
    const existingIframe = document.getElementById('pdf-worker-iframe');
    if (existingIframe) {
      document.body.removeChild(existingIframe);
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'pdf-worker-iframe';
    // Hide completely
    iframe.style.position = 'fixed';
    iframe.style.right = '-9999px';
    iframe.style.bottom = '-9999px';
    iframe.style.width = '1000px'; // Needs width to render properly
    iframe.style.height = '1000px';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';

    // Listen for completion
    const messageListener = (event: MessageEvent) => {
      if (event.data?.type === 'PDF_DOWNLOAD_COMPLETE' && event.data?.invoiceNumber === invoiceNumber) {
        window.removeEventListener('message', messageListener);
        setTimeout(() => {
          if (document.getElementById('pdf-worker-iframe')) {
            document.body.removeChild(iframe);
          }
        }, 1000);
        resolve(true);
      } else if (event.data?.type === 'PDF_DOWNLOAD_ERROR') {
        window.removeEventListener('message', messageListener);
        resolve(false);
      }
    };

    window.addEventListener('message', messageListener);
    
    // Trigger the silent generation
    iframe.src = `/invoice/${invoiceNumber}?silent_download=true`;
    document.body.appendChild(iframe);
    
    // Safety timeout just in case it hangs (20 seconds)
    setTimeout(() => {
      window.removeEventListener('message', messageListener);
      if (document.getElementById('pdf-worker-iframe')) {
        document.body.removeChild(iframe);
      }
      resolve(false);
    }, 20000);
  });
};
