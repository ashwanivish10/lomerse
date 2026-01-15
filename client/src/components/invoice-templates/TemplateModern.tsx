import React from "react";
import type { InvoiceData, ThemeClasses } from "./types";
import { EditableText, EditableNumber } from "./EditableComponents";

interface TemplateProps {
  data: InvoiceData;
  logoUrl: string | null;
  themeClasses: ThemeClasses;
  editable?: boolean;
  onDataChange?: (data: InvoiceData) => void;
}

/**
 * MODERN TEMPLATE - Clean minimal with accent sidebar
 * Matches PDF with sidebar accent and organized sections
 */
const TemplateModern: React.FC<TemplateProps> = ({
  data,
  logoUrl,
  themeClasses,
  editable = true,
  onDataChange,
}) => {
  const accentColor = themeClasses?.accentColor || "#6366F1";

  const updateData = (updates: Partial<InvoiceData>) => {
    if (onDataChange) onDataChange({ ...data, ...updates });
  };

  const updateFrom = (field: string, value: string) => {
    if (onDataChange) onDataChange({ ...data, from: { ...data.from, [field]: value } });
  };

  const updateTo = (field: string, value: string) => {
    if (onDataChange) onDataChange({ ...data, to: { ...data.to, [field]: value } });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    if (onDataChange) {
      const newItems = data.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      const subtotal = newItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const tax = subtotal * data.taxRate;
      const total = subtotal + tax;
      onDataChange({ ...data, items: newItems, subtotal, tax, total });
    }
  };

  const addItem = () => {
    if (onDataChange) {
      const newItems = [...data.items, { description: "New Item", quantity: 1, price: 0 }];
      onDataChange({ ...data, items: newItems });
    }
  };

  const removeItem = (index: number) => {
    if (onDataChange && data.items.length > 1) {
      const newItems = data.items.filter((_, i) => i !== index);
      const subtotal = newItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const tax = subtotal * data.taxRate;
      const total = subtotal + tax;
      onDataChange({ ...data, items: newItems, subtotal, tax, total });
    }
  };

  return (
    <div className="flex bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ACCENT SIDEBAR */}
      <div className="w-1 sm:w-2" style={{ backgroundColor: accentColor }}></div>

      <div className="flex-1 p-4 sm:p-6 md:p-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-10">
          {/* Company Info */}
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#1E293B" }}>
              <EditableText
                value={data.from.name}
                onChange={(v) => updateFrom("name", v)}
                editable={editable}
                placeholder="Company Name"
              />
            </h1>
            <p className="text-sm text-gray-500">
              <EditableText
                value={data.from.address}
                onChange={(v) => updateFrom("address", v)}
                editable={editable}
                placeholder="Address"
              />
            </p>
            <p className="text-sm text-gray-500">
              <EditableText
                value={data.from.email || ""}
                onChange={(v) => updateFrom("email", v)}
                editable={editable}
                placeholder="Email"
              />
            </p>
          </div>

          {/* Invoice Title */}
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-1" style={{ color: accentColor }}>INVOICE</h2>
            <p className="text-sm">
              #<EditableText
                value={String(data.invoiceNumber).padStart(5, "0")}
                onChange={(v) => updateData({ invoiceNumber: v })}
                editable={editable}
              />
            </p>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 text-xs sm:text-sm">
          {/* Dates */}
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: accentColor }}>DATE</p>
            <p>
              <EditableText
                value={data.invoiceDate}
                onChange={(v) => updateData({ invoiceDate: v })}
                editable={editable}
              />
            </p>
            <p className="text-xs font-bold mt-3 mb-1" style={{ color: accentColor }}>DUE DATE</p>
            <p>
              <EditableText
                value={data.dueDate}
                onChange={(v) => updateData({ dueDate: v })}
                editable={editable}
              />
            </p>
          </div>

          {/* Bill To */}
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: accentColor }}>BILL TO</p>
            <p className="font-medium">
              <EditableText
                value={data.to.name}
                onChange={(v) => updateTo("name", v)}
                editable={editable}
              />
            </p>
            <p className="text-gray-500">
              <EditableText
                value={data.to.address}
                onChange={(v) => updateTo("address", v)}
                editable={editable}
              />
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-lg overflow-hidden border border-gray-200 mb-6 sm:mb-8 overflow-x-auto">
          {/* Header */}
          <div
            className="grid grid-cols-12 py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm font-bold min-w-[300px]"
            style={{ backgroundColor: accentColor + "15", color: accentColor }}
          >
            <div className="col-span-5">DESCRIPTION</div>
            <div className="col-span-2 text-center">QTY</div>
            <div className="col-span-2 text-right">RATE</div>
            <div className="col-span-2 text-right">AMOUNT</div>
            {editable && <div className="col-span-1"></div>}
          </div>

          {/* Rows */}
          {data.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 py-2 sm:py-4 px-2 sm:px-4 items-center border-b border-gray-100 group hover:bg-gray-50 min-w-[300px] text-xs sm:text-sm"
            >
              <div className="col-span-5 font-medium">
                <EditableText
                  value={item.description}
                  onChange={(v) => updateItem(index, "description", v)}
                  editable={editable}
                />
              </div>
              <div className="col-span-2 text-center text-gray-500">
                <EditableNumber
                  value={item.quantity}
                  onChange={(v) => updateItem(index, "quantity", v)}
                  editable={editable}
                />
              </div>
              <div className="col-span-2 text-right text-gray-500">
                ₹<EditableNumber
                  value={item.price}
                  onChange={(v) => updateItem(index, "price", v)}
                  editable={editable}
                />
              </div>
              <div className="col-span-2 text-right font-bold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
              {editable && (
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => removeItem(index)}
                    className="opacity-100 sm:opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
                    disabled={data.items.length <= 1}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}

          {editable && (
            <button onClick={addItem} className="w-full py-3 text-sm text-blue-600 hover:bg-blue-50 border-t">
              + Add Item
            </button>
          )}
        </div>

        {/* TOTALS */}
        <div className="flex justify-end">
          <div className="w-full sm:w-64 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: "#F9FAFB" }}>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{data.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax ({(data.taxRate * 100).toFixed(0)}%)</span>
                <span>₹{data.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 sm:pt-3 flex justify-between font-bold text-sm sm:text-lg">
                <span style={{ color: accentColor }}>Total</span>
                <span style={{ color: accentColor }}>₹{data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* NOTES */}
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            <EditableText
              value={data.notes || "Thank you for your business!"}
              onChange={(v) => updateData({ notes: v })}
              editable={editable}
              placeholder="Add notes..."
            />
          </p>
        </div>

        {/* BRANDING */}
        <div className="mt-6 pt-4 border-t text-center text-xs text-gray-400">
          Crafted with <span className="font-semibold text-indigo-600">Lomerse</span>
        </div>
      </div>
    </div>
  );
};

export default TemplateModern;
