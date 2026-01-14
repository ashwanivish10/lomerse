import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Type Definitions ---

// Shape of a single item in the invoice
interface InvoiceItem {
  item: string;
  description: string;
  quantity: number;
  unit_price: number;
}

// Shape of the customer data
interface Customer {
  name: string;
  address: string;
  city: string;
}

// Shape of the entire invoice data object
interface InvoiceData {
  invoice_nr: number;
  date: string;
  taxRate: number;
  customer: Customer;
  items: InvoiceItem[];
}

// Shape of the theme object
interface Theme {
  name?: string;
  primary: string;
  accent: string;
  secondary: string;
}

// Shape of the context value
interface InvoiceContextType {
  template: string;
  setTemplate: React.Dispatch<React.SetStateAction<string>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  invoiceData: InvoiceData;
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

// --- Default Data ---

// Define the default data structure with the InvoiceData type
const DEFAULT_INVOICE_DATA: InvoiceData = {
  invoice_nr: 1234,
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  taxRate: 0.18, // 18%
  customer: {
    name: "John Doe",
    address: "123 Client Street",
    city: "Clientville, ST 54321"
  },
  items: [
    {
      item: "Web Design",
      description: "Initial website design",
      quantity: 1,
      unit_price: 1500
    }
  ]
};

// --- Context Creation ---

// Create the context, typed to accept InvoiceContextType or undefined (for the default)
const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// --- Provider Component ---

// Define the props for the provider
interface InvoiceProviderProps {
  children: ReactNode; // ReactNode is the type for 'children'
}

export function InvoiceProvider({ children }: InvoiceProviderProps): JSX.Element {
  const [template, setTemplate] = useState<string>('modern');
  const [theme, setTheme] = useState<Theme>({ name: 'Ocean Blue', primary: '#1E293B', accent: '#3B82F6', secondary: '#64748B' });
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_INVOICE_DATA);

  // The 'value' object must match the InvoiceContextType
  const value: InvoiceContextType = {
    template,
    setTemplate,
    theme,
    setTheme,
    invoiceData,
    setInvoiceData
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
}

// --- Custom Hook ---

/**
 * Custom hook to access the InvoiceContext.
 * Throws an error if used outside of an InvoiceProvider.
 */
export function useInvoice(): InvoiceContextType {
  const context = useContext(InvoiceContext);

  // This check ensures the context is not undefined when accessed
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }

  return context;
}