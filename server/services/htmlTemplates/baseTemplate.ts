/**
 * Base HTML Wrapper with Tailwind CSS and Fonts
 * Used by all invoice HTML templates
 */

export interface InvoiceData {
  from: {
    name: string;
    address: string;
    email: string;
  };
  to: {
    name: string;
    company?: string;
    address: string;
    email?: string;
  };
  invoiceNumber: string | number;
  invoiceDate: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
  notes?: string;
}

export interface ThemeConfig {
  accentColor?: string;
  primary?: string;
  secondary?: string;
  borderAccent?: string;
  bgAccent?: string;
}

/**
 * Wraps the invoice body HTML with proper document structure,
 * Tailwind CSS, fonts, and print-specific styles
 */
export function wrapHtml(bodyContent: string, title: string = "Invoice"): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts - Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    /* Base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      line-height: 1.5;
    }
    
    /* Table alignment fixes */
    table {
      border-collapse: collapse;
      width: 100%;
    }
    
    th, td {
      vertical-align: middle !important;
      line-height: 1.5;
      padding: 12px 16px;
    }
    
    /* Grid-based table rows alignment */
    .invoice-item,
    .invoice-row,
    [class*="grid-cols"] {
      line-height: 1.5;
    }
    
    .invoice-item > div,
    .invoice-row > div,
    [class*="grid-cols"] > div {
      display: flex;
      align-items: center;
      min-height: 24px;
      line-height: 1.5;
    }
    
    /* Centered text columns */
    .text-center {
      text-align: center !important;
      justify-content: center !important;
    }
    
    .text-right {
      text-align: right !important;
      justify-content: flex-end !important;
    }
    
    /* Print-specific styles */
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      .no-print {
        display: none !important;
      }
      
      .page-break-before {
        page-break-before: always;
      }
      
      .page-break-after {
        page-break-after: always;
      }
      
      .avoid-break {
        page-break-inside: avoid;
      }
      
      /* Ensure proper alignment in print */
      th, td {
        vertical-align: middle !important;
        line-height: 1.5 !important;
      }
      
      .invoice-item > div,
      .invoice-row > div {
        display: flex !important;
        align-items: center !important;
      }
    }
    
    /* Page break handling for long item lists */
    .invoice-item {
      page-break-inside: avoid;
    }
    
    /* Keep header and footer fixed */
    .invoice-header {
      page-break-inside: avoid;
      page-break-after: avoid;
    }
    
    .invoice-footer {
      page-break-inside: avoid;
      page-break-before: avoid;
    }
    
    .invoice-totals {
      page-break-inside: avoid;
    }
    
    /* Ensure table rows don't break */
    tr {
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

/**
 * Format number as Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return `&#8377;${amount.toFixed(2)}`;
}

/**
 * Pad invoice number with leading zeros
 */
export function formatInvoiceNumber(num: string | number): string {
  return String(num).padStart(5, "0");
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
