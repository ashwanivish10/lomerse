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
 * MINIMAL TEMPLATE - Ultra-clean with lots of whitespace
 * Simple lines, minimal colors, elegant typography
 */
const TemplateMinimal: React.FC<TemplateProps> = ({
  data,
  logoUrl,
  themeClasses,
  editable = false,
  onDataChange,
}) => {
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
    <div className="p-12 bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-lg font-bold text-gray-900">
          <EditableText
            value={data.from.name}
            onChange={(v) => updateFrom("name", v)}
            editable={editable}
            placeholder="Company"
          />
        </h1>
        <h2 className="text-4xl font-light text-gray-400">Invoice</h2>
      </div>

      {/* DIVIDER */}
      <div className="border-b border-gray-200 mb-8"></div>

      {/* INFO GRID */}
      <div className="grid grid-cols-3 gap-8 mb-10 text-sm">
        {/* From */}
        <div>
          <p className="text-xs text-gray-400 mb-1">From</p>
          <p className="font-medium">
            <EditableText
              value={data.from.name}
              onChange={(v) => updateFrom("name", v)}
              editable={editable}
            />
          </p>
          <p className="text-gray-500">
            <EditableText
              value={data.from.address}
              onChange={(v) => updateFrom("address", v)}
              editable={editable}
            />
          </p>
          <p className="text-gray-500">
            <EditableText
              value={data.from.email || ""}
              onChange={(v) => updateFrom("email", v)}
              editable={editable}
            />
          </p>
        </div>

        {/* Bill To */}
        <div>
          <p className="text-xs text-gray-400 mb-1">Bill To</p>
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

        {/* Invoice Details */}
        <div className="text-right">
          <div className="mb-3">
            <p className="text-xs text-gray-400">Invoice No.</p>
            <p className="font-bold">
              <EditableText
                value={String(data.invoiceNumber).padStart(5, "0")}
                onChange={(v) => updateData({ invoiceNumber: v })}
                editable={editable}
              />
            </p>
          </div>
          <div className="mb-3">
            <p className="text-xs text-gray-400">Date</p>
            <p>
              <EditableText
                value={data.invoiceDate}
                onChange={(v) => updateData({ invoiceDate: v })}
                editable={editable}
              />
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Due Date</p>
            <p>
              <EditableText
                value={data.dueDate}
                onChange={(v) => updateData({ dueDate: v })}
                editable={editable}
              />
            </p>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="border-t-2 border-gray-900 mb-6">
        {/* Header */}
        <div className="grid grid-cols-12 py-3 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-200">
          <div className="col-span-5">Description</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Rate</div>
          <div className="col-span-2 text-right">Amount</div>
          {editable && <div className="col-span-1"></div>}
        </div>

        {/* Rows */}
        {data.items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 py-4 items-center border-b border-gray-100 group"
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

        {editable && (
          <button onClick={addItem} className="w-full py-3 text-sm text-blue-600 hover:bg-blue-50">
            + Add Item
          </button>
        )}
      </div>

      {/* TOTALS */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="border-t border-gray-900 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span className="text-gray-900">₹{data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax</span>
              <span className="text-gray-900">₹{data.tax.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-gray-900 pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <p className="text-sm text-gray-400 mt-12">Thank you.</p>
    </div>
  );
};

export default TemplateMinimal;
