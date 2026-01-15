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
 * PROFESSIONAL TEMPLATE - Corporate blue header/footer bars
 * Matches PDF with professional business styling
 */
const TemplateProfessional: React.FC<TemplateProps> = ({
    data,
    logoUrl,
    themeClasses,
    editable = false,
    onDataChange,
}) => {
    const accentColor = themeClasses?.accentColor || "#2563EB";

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
        <div className="bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* TOP HEADER BAR */}
            <div className="py-4 sm:py-6 px-4 sm:px-8 text-white" style={{ backgroundColor: accentColor }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <div>
                        <h1 className="text-2xl font-bold">
                            <EditableText
                                value={data.from.name}
                                onChange={(v) => updateFrom("name", v)}
                                editable={editable}
                                placeholder="Company Name"
                                className="text-white"
                            />
                        </h1>
                        <p className="text-sm opacity-80">
                            <EditableText
                                value={data.from.email || ""}
                                onChange={(v) => updateFrom("email", v)}
                                editable={editable}
                                placeholder="Email"
                                className="text-white"
                            />
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold">INVOICE</h2>
                        <p className="text-sm opacity-90">
                            #<EditableText
                                value={String(data.invoiceNumber).padStart(5, "0")}
                                onChange={(v) => updateData({ invoiceNumber: v })}
                                editable={editable}
                                className="text-white"
                            />
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
                {/* INFO BOXES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
                    {/* Bill To */}
                    <div className="bg-gray-50 p-4 rounded">
                        <p className="text-xs font-bold mb-2" style={{ color: accentColor }}>BILL TO</p>
                        <p className="font-bold text-lg">
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

                    {/* Invoice Details */}
                    <div className="bg-gray-50 p-4 rounded">
                        <p className="text-xs font-bold mb-2" style={{ color: accentColor }}>INVOICE DETAILS</p>
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Issue Date:</span>
                                <EditableText
                                    value={data.invoiceDate}
                                    onChange={(v) => updateData({ invoiceDate: v })}
                                    editable={editable}
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Due Date:</span>
                                <EditableText
                                    value={data.dueDate}
                                    onChange={(v) => updateData({ dueDate: v })}
                                    editable={editable}
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">From:</span>
                                <EditableText
                                    value={data.from.address}
                                    onChange={(v) => updateFrom("address", v)}
                                    editable={editable}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="rounded overflow-hidden border border-gray-200 overflow-x-auto">
                    {/* Table Header */}
                    <div
                        className="grid grid-cols-12 py-2 sm:py-3 px-2 sm:px-4 text-white text-[10px] sm:text-sm font-bold min-w-[300px]"
                        style={{ backgroundColor: accentColor }}
                    >
                        <div className="col-span-5">DESCRIPTION</div>
                        <div className="col-span-2 text-center">QTY</div>
                        <div className="col-span-2 text-right">RATE</div>
                        <div className="col-span-2 text-right">AMOUNT</div>
                        {editable && <div className="col-span-1"></div>}
                    </div>

                    {/* Table Rows */}
                    {data.items.map((item, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-12 py-2 sm:py-3 px-2 sm:px-4 items-center group min-w-[300px] text-xs sm:text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                        >
                            <div className="col-span-5 font-medium">
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
                        <button
                            onClick={addItem}
                            className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 border-t"
                        >
                            + Add Item
                        </button>
                    )}
                </div>

                {/* TOTALS */}
                <div className="flex justify-end mt-4 sm:mt-6">
                    <div className="w-full sm:w-64 space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>₹{data.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Tax ({(data.taxRate * 100).toFixed(0)}%)</span>
                            <span>₹{data.tax.toFixed(2)}</span>
                        </div>
                        <div
                            className="flex justify-between font-bold text-white text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 rounded"
                            style={{ backgroundColor: accentColor }}
                        >
                            <span>TOTAL DUE</span>
                            <span>₹{data.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="py-3 text-center text-white text-sm" style={{ backgroundColor: accentColor }}>
                Thank you for your business!
            </div>
        </div>
    );
};

export default TemplateProfessional;
