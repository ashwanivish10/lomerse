// import React from "react";
// import { useInvoice } from "../contexts/InvoiceContext";

// // ------------------ Types ------------------
// interface InvoiceItem {
//   item: string;
//   description: string;
//   quantity: number;
//   unit_price: number;
// }

// interface Customer {
//   name: string;
//   address: string;
//   city: string;
// }

// interface InvoiceData {
//   invoice_nr: number;
//   date: string;
//   taxRate: number;
//   customer: Customer;
//   items: InvoiceItem[];
// }

// type CalculatedItem = InvoiceItem & { total_price: number };

// interface CalculatedTotals {
//   items: CalculatedItem[];
//   subtotal: number;
//   tax: number;
//   total: number;
// }

// // ------------------ Calculator ------------------
// function calculatePreviewTotals(invoiceData: InvoiceData): CalculatedTotals {
//   let subtotal = 0;

//   const items = invoiceData.items.map((item) => {
//     const qty = Number(item.quantity) || 0;
//     const price = Number(item.unit_price) || 0;
//     const total_price = qty * price;
//     subtotal += total_price;
//     return { ...item, total_price };
//   });

//   const tax = subtotal * (Number(invoiceData.taxRate) || 0);
//   const total = subtotal + tax;

//   return { items, subtotal, tax, total };
// }

// // ------------------ UI Component ------------------
// function InvoicePreview(): JSX.Element {
//   const { invoiceData, theme } = useInvoice();

//   const { items, subtotal, tax, total } = calculatePreviewTotals(invoiceData);

//   return (
//     <div className="w-full max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
//       {/* Header */}
//       <header className="flex justify-between items-start border-b pb-6 mb-6">
//         {/* Company Info */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Your Company Inc.</h2>
//           <p className="text-gray-600">123 Main Street</p>
//           <p className="text-gray-600">City, State, 12345</p>
//         </div>

//         {/* Invoice Details */}
//         <div className="text-right">
//           <h1
//             className="text-4xl font-extrabold tracking-wide"
//             style={{ color: theme.accent }}
//           >
//             INVOICE
//           </h1>

//           <p className="mt-3 text-gray-700">
//             <strong>Invoice #:</strong> {invoiceData.invoice_nr}
//           </p>
//           <p className="text-gray-700">
//             <strong>Date:</strong> {invoiceData.date}
//           </p>
//           <p className="text-xl font-semibold mt-1" style={{ color: theme.primary }}>
//             Balance Due: ${total.toFixed(2)}
//           </p>
//         </div>
//       </header>

//       {/* Customer Info */}
//       <section className="mb-6">
//         <h3 className="font-semibold text-lg mb-1 text-gray-700">Bill To:</h3>
//         <div className="bg-gray-50 p-4 rounded-xl border">
//           <p className="text-gray-800 font-medium">{invoiceData.customer.name}</p>
//           <p className="text-gray-600">{invoiceData.customer.address}</p>
//           <p className="text-gray-600">{invoiceData.customer.city}</p>
//         </div>
//       </section>

//       {/* Items Table */}
//       <section>
//         <table className="w-full border rounded-xl overflow-hidden">
//           <thead>
//             <tr
//               className="text-left text-white"
//               style={{ backgroundColor: theme.accent }}
//             >
//               <th className="p-3">Item</th>
//               <th className="p-3">Qty</th>
//               <th className="p-3">Price</th>
//               <th className="p-3">Total</th>
//             </tr>
//           </thead>

//           <tbody>
//             {items.map((item, index) => (
//               <tr
//                 key={index}
//                 className="border-b last:border-none hover:bg-gray-50 transition"
//               >
//                 <td className="p-3 font-medium text-gray-800">{item.item}</td>
//                 <td className="p-3 text-gray-700">{item.quantity}</td>
//                 <td className="p-3 text-gray-700">
//                   ${item.unit_price.toFixed(2)}
//                 </td>
//                 <td className="p-3 text-gray-800 font-semibold">
//                   ${item.total_price.toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* Totals Section */}
//       <footer className="mt-8 flex justify-end">
//         <div className="w-64 bg-gray-50 border rounded-xl p-5 shadow-sm space-y-2">
//           <div className="flex justify-between text-gray-700">
//             <span>Subtotal:</span>
//             <span>${subtotal.toFixed(2)}</span>
//           </div>

//           <div className="flex justify-between text-gray-700">
//             <span>Tax ({invoiceData.taxRate * 100}%):</span>
//             <span>${tax.toFixed(2)}</span>
//           </div>

//           <hr />

//           <div className="flex justify-between text-xl font-bold">
//             <span>Total:</span>
//             <span style={{ color: theme.accent }}>${total.toFixed(2)}</span>
//           </div>
//         </div>
//       </footer>

//       {/* Footer Note */}
//       <p className="text-center mt-6 text-gray-500 text-sm">
//         Thank you for your business.
//       </p>
//     </div>
//   );
// }

// export default InvoicePreview;

import React from "react";
import { useInvoice } from "@/contexts/InvoiceContext";

import TemplateClassic from "@/components/invoice-templates/TemplateClassic";
import TemplateMinimal from "@/components/invoice-templates/TemplateMinimal";
import TemplateModern from "@/components/invoice-templates/TemplateModern";
import TemplateProfessional from "@/components/invoice-templates/TemplateProfessional";
import TemplateExecutive from "@/components/invoice-templates/TemplateExecutive";
import TemplateCreative from "@/components/invoice-templates/TemplateCreative";

interface InvoicePreviewProps {
  templateId?: string;
}

function InvoicePreview({ templateId }: InvoicePreviewProps) {
  const { invoiceData, template, theme } = useInvoice();

  // Use prop templateId if provided, otherwise use context template
  const activeTemplate = templateId || template;

  // Convert your context invoice structure → template structure
  const transformedData = {
    from: {
      name: "Your Company",
      address: "Company Address",
      email: "company@email.com"
    },

    to: {
      name: invoiceData.customer.name,
      address: invoiceData.customer.address
    },

    invoiceNumber: invoiceData.invoice_nr,
    invoiceDate: invoiceData.date,
    dueDate: invoiceData.date, // you can add due date later

    items: invoiceData.items.map((item) => ({
      description: item.description || item.item,
      quantity: item.quantity,
      price: item.unit_price,
    })),

    subtotal: invoiceData.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    ),

    taxRate: invoiceData.taxRate,

    tax:
      invoiceData.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      ) * invoiceData.taxRate,

    total:
      invoiceData.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      ) *
      (1 + invoiceData.taxRate),

    notes: "Thank you for your business."
  };

  // Convert theme → themeClasses
  const themeClasses = {
    accentColor: theme.accent,
    primary: theme.primary,
    secondary: theme.secondary,
    borderAccent: theme.accent,
    bgAccent: theme.accent + "20",
  };

  const logoUrl = null;

  const renderTemplate = () => {
    switch (activeTemplate) {
      case "classic":
        return (
          <TemplateClassic
            data={transformedData}
            logoUrl={logoUrl}
            themeClasses={themeClasses}
          />
        );

      case "minimal":
        return (
          <TemplateMinimal
            data={transformedData}
            logoUrl={logoUrl}
            themeClasses={themeClasses}
          />
        );

      case "modern":
        return (
          <TemplateModern
            data={transformedData}
            logoUrl={logoUrl}
            themeClasses={themeClasses}
          />
        );

      case "professional":
        return (
          <TemplateProfessional
            data={transformedData}
            logoUrl={logoUrl}
            themeClasses={themeClasses}
          />
        );

      case "executive":
        return (
          <TemplateExecutive
            data={transformedData}
            logoUrl={logoUrl}
            themeClasses={themeClasses}
          />
        );

      case "creative":
        return (
          <TemplateCreative
            data={transformedData}
            logoUrl={logoUrl}
            themeClasses={themeClasses}
          />
        );

      default:
        return (
          <div className="w-full text-center text-gray-600 py-20">
            Please select a template.
          </div>
        );
    }
  };

  return (
    <div className="w-full p-8 flex justify-center bg-gray-100 overflow-auto">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl p-0">
        {renderTemplate()}
      </div>
    </div>
  );
}

export default InvoicePreview;
