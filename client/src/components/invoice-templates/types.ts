export interface InvoiceData {
  // Existing Fields
  invoiceNumber: string;
  invoiceDate: string; // Still useful, can be aliased to 'date'
  dueDate: string;
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
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;

  // --- NEW FIELDS ---
  // Added to match the "Business Service Bill" template
  date: string;          // For the "Date: 03/04/22" field
  amountPaid: number;  // For the "AMOUT PAID: $2.50" field
  taxRate: string;       // For the "TAX : 0%" field (as a string)
}

// --- Theme Interface (Your code is correct) ---
// This will control the accent colors of the new template
export interface ThemeClasses {
  primary: string;       // For text: Company Name, TOTAL
  bgAccent: string;      // For backgrounds: Item Header Bar
  borderAccent: string;  // For borders: Dashed lines
  accentColor?: string;  // For accent color styling
}