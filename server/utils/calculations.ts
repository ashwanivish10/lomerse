// --- Type Definitions ---

// Shape of an item coming from the client
interface InvoiceItemInput {
  item: string;
  description: string;
  quantity: number | string; // Can be string or number from JSON
  unit_price: number | string; // Can be string or number from JSON
}

// Shape of the data coming from the client
interface InvoiceDataInput {
  invoice_nr: number;
  date?: string; // Date is optional, will be set on server
  taxRate: number | string;
  customer: {
    name: string;
    address: string;
    city: string;
  };
  items: InvoiceItemInput[];
  templateName: string;
  theme: {
    primary: string;
    accent: string;
    secondary: string;
  };
}

// Shape of a calculated item
interface CalculatedItem extends InvoiceItemInput {
  total_price: number;
}

// Shape of the final calculated data
interface CalculatedInvoiceData extends InvoiceDataInput {
  items: CalculatedItem[]; // Items will now have total_price
  subtotal: number;
  tax: number;
  total: number;
  date: string; // Date is guaranteed to be a string
}

/**
 * Securely calculates subtotal, tax, and total on the server.
 * @param invoice The raw invoice data from the client.
 * @returns A new invoice object with calculated totals and a guaranteed date.
 */
export function calculateTotals(invoice: InvoiceDataInput): CalculatedInvoiceData {
  let subtotal = 0;
  
  // Ensure items is an array, default to empty
  const items = invoice.items || [];

  const calculatedItems: CalculatedItem[] = items.map((item) => {
    const qty = parseFloat(String(item.quantity)) || 0;
    const price = parseFloat(String(item.unit_price)) || 0;
    const total_price = qty * price;
    subtotal += total_price;
    
    // Return a new item object with the calculated total_price
    return { ...item, total_price };
  });

  // Get tax rate from client, or default to 0
  const taxRate = parseFloat(String(invoice.taxRate)) || 0; 
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Return a new object with all data
  return {
    ...invoice,
    items: calculatedItems,
    subtotal,
    tax,
    total,
    // Set date on the server if not provided by client
    date: invoice.date || new Date().toLocaleDateString("en-US"), 
  };
}
