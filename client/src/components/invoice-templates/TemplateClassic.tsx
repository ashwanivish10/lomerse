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
 * CLASSIC TEMPLATE - Traditional bordered formal style
 * Matches the PDF design with bordered sections and classic layout
 */
const TemplateClassic: React.FC<TemplateProps> = ({
  data,
  logoUrl,
  themeClasses,
  editable = false,
  onDataChange,
}) => {
  const accentColor = themeClasses?.accentColor || "#374151";

  // Update handlers
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
      const taxRateNum = parseFloat(data.taxRate) || 0;
      const tax = subtotal * (taxRateNum / 100);
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
      const taxRateNum = parseFloat(data.taxRate) || 0;
      const tax = subtotal * (taxRateNum / 100);
      const total = subtotal + tax;
      onDataChange({ ...data, items: newItems, subtotal, tax, total });
    }
  };

  return (
    <div className="p-10 bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* TOP BORDER */}
      <div className="h-1 mb-4" style={{ backgroundColor: accentColor }}></div>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        {/* Company Info */}
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#1F2937" }}>
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

        {/* Invoice Box */}
        <div className="border-2 p-4 text-center" style={{ borderColor: accentColor }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: accentColor }}>INVOICE</h2>
          <p className="text-sm text-gray-700">
            No: <EditableText
              value={String(data.invoiceNumber).padStart(5, "0")}
              onChange={(v) => updateData({ invoiceNumber: v })}
              editable={editable}
            />
          </p>
        </div>
      </div>

      {/* DATES & BILL TO */}
      <div className="flex gap-6 mb-6">
        {/* Bill To Box */}
        <div className="border-2 p-4 flex-1" style={{ borderColor: accentColor }}>
          <p className="text-xs font-bold mb-2" style={{ color: accentColor }}>BILL TO:</p>
          <p className="font-bold">
            <EditableText
              value={data.to.name}
              onChange={(v) => updateTo("name", v)}
              editable={editable}
              placeholder="Client Name"
            />
          </p>
          <p className="text-sm text-gray-500">
            <EditableText
              value={data.to.address}
              onChange={(v) => updateTo("address", v)}
              editable={editable}
              placeholder="Client Address"
            />
          </p>
        </div>

        {/* Dates */}
        <div className="text-sm text-right">
          <p className="text-gray-500">Invoice Date:</p>
          <p className="font-medium mb-2">
            <EditableText
              value={data.invoiceDate}
              onChange={(v) => updateData({ invoiceDate: v })}
              editable={editable}
            />
          </p>
          <p className="text-gray-500">Due Date:</p>
          <p className="font-medium">
            <EditableText
              value={data.dueDate}
              onChange={(v) => updateData({ dueDate: v })}
              editable={editable}
            />
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="border" style={{ borderColor: accentColor }}>
        {/* Table Header */}
        <div
          className="grid grid-cols-12 py-2 px-4 font-bold text-sm border-b"
          style={{ backgroundColor: "#F3F4F6", borderColor: accentColor, color: accentColor }}
        >
          <div className="col-span-5">Description</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Rate</div>
          <div className="col-span-2 text-right">Amount</div>
          {editable && <div className="col-span-1"></div>}
        </div>

        {/* Table Rows */}
        {data.items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 py-3 px-4 items-center border-b border-gray-200 group hover:bg-gray-50"
          >
            <div className="col-span-5">
              <EditableText
                value={item.description}
                onChange={(v) => updateItem(index, "description", v)}
                editable={editable}
                placeholder="Item description"
              />
            </div>
            <div className="col-span-2 text-center text-gray-600">
              <EditableNumber
                value={item.quantity}
                onChange={(v) => updateItem(index, "quantity", v)}
                editable={editable}
              />
            </div>
            <div className="col-span-2 text-right text-gray-600">
              ₹<EditableNumber
                value={item.price}
                onChange={(v) => updateItem(index, "price", v)}
                editable={editable}
              />
            </div>
            <div className="col-span-2 text-right font-medium">
              ₹{(item.price * item.quantity).toFixed(2)}
            </div>
            {editable && (
              <div className="col-span-1 text-right">
                <button
                  onClick={() => removeItem(index)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
                  disabled={data.items.length <= 1}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Item */}
        {editable && (
          <button
            onClick={addItem}
            className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50"
          >
            + Add Item
          </button>
        )}
      </div>

      {/* TOTALS BOX */}
      <div className="flex justify-end mt-6">
        <div className="border w-64" style={{ borderColor: accentColor }}>
          <div className="flex justify-between px-4 py-2 text-sm">
            <span className="text-gray-500">Subtotal:</span>
            <span>₹{data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between px-4 py-2 text-sm border-t border-gray-200">
            <span className="text-gray-500">Tax:</span>
            <span>₹{data.tax.toFixed(2)}</span>
          </div>
          <div
            className="flex justify-between px-4 py-3 font-bold"
            style={{ backgroundColor: "#F3F4F6", color: accentColor }}
          >
            <span>TOTAL:</span>
            <span>₹{data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* BOTTOM BORDER */}
      <div className="h-1 mt-8" style={{ backgroundColor: accentColor }}></div>

      {/* FOOTER */}
      <p className="text-center text-sm text-gray-500 mt-4">
        Thank you for your business
      </p>
    </div>
  );
};

export default TemplateClassic;
