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
 * EXECUTIVE TEMPLATE - Luxury premium with dark header/footer
 * Dark theme with gold accents for premium feel
 */
const TemplateExecutive: React.FC<TemplateProps> = ({
    data,
    logoUrl,
    themeClasses,
    editable = false,
    onDataChange,
}) => {
    const accentColor = themeClasses?.accentColor || "#0F172A";
    const goldColor = "#B8860B";

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
            {/* DARK HEADER */}
            <div className="py-4 sm:py-6 px-4 sm:px-8 text-white" style={{ backgroundColor: accentColor }}>
                <div className="h-1 mb-4" style={{ backgroundColor: goldColor }}></div>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            <EditableText
                                value={data.from.name}
                                onChange={(v) => updateFrom("name", v)}
                                editable={editable}
                                placeholder="COMPANY"
                                className="text-white"
                            />
                        </h1>
                        <p className="text-sm opacity-70">
                            <EditableText
                                value={data.from.address}
                                onChange={(v) => updateFrom("address", v)}
                                editable={editable}
                                className="text-white"
                            />
                        </p>
                        <p className="text-sm opacity-70">
                            <EditableText
                                value={data.from.email || ""}
                                onChange={(v) => updateFrom("email", v)}
                                editable={editable}
                                className="text-white"
                            />
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs mb-1" style={{ color: goldColor }}>INVOICE</p>
                        <p className="text-2xl font-bold">
                            #<EditableText
                                value={String(data.invoiceNumber).padStart(5, "0")}
                                onChange={(v) => updateData({ invoiceNumber: v })}
                                editable={editable}
                                className="text-white"
                            />
                        </p>
                        <p className="text-sm opacity-70 mt-2">
                            Date: <EditableText
                                value={data.invoiceDate}
                                onChange={(v) => updateData({ invoiceDate: v })}
                                editable={editable}
                                className="text-white"
                            />
                        </p>
                    </div>
                </div>
            </div>

            {/* GOLD ACCENT LINE */}
            <div className="h-1" style={{ backgroundColor: goldColor }}></div>

            <div className="p-4 sm:p-6 md:p-8">
                {/* INFO SECTION */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 sm:mb-8">
                    {/* Bill To */}
                    <div>
                        <p className="text-xs font-bold mb-2" style={{ color: goldColor }}>BILL TO</p>
                        <p className="text-xl font-bold">
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

                    {/* Due Date */}
                    <div className="text-right">
                        <p className="text-xs font-bold mb-2" style={{ color: goldColor }}>DUE DATE</p>
                        <p className="text-xl font-bold">
                            <EditableText
                                value={data.dueDate}
                                onChange={(v) => updateData({ dueDate: v })}
                                editable={editable}
                            />
                        </p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="border-t-2 mb-6 overflow-x-auto" style={{ borderColor: accentColor }}>
                    {/* Header */}
                    <div className="grid grid-cols-12 py-2 sm:py-3 px-1 sm:px-0 text-[10px] sm:text-xs uppercase tracking-wide min-w-[300px]" style={{ color: goldColor }}>
                        <div className="col-span-5 font-bold">SERVICE / DESCRIPTION</div>
                        <div className="col-span-2 text-center font-bold">QTY</div>
                        <div className="col-span-2 text-right font-bold">RATE</div>
                        <div className="col-span-2 text-right font-bold">AMOUNT</div>
                        {editable && <div className="col-span-1"></div>}
                    </div>

                    {/* Rows */}
                    {data.items.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-12 py-2 sm:py-4 px-1 sm:px-0 items-center border-b border-gray-100 group min-w-[300px] text-xs sm:text-sm"
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
                        <button onClick={addItem} className="w-full py-3 text-sm text-blue-600 hover:bg-blue-50">
                            + Add Item
                        </button>
                    )}
                </div>

                {/* TOTALS */}
                <div className="flex justify-end">
                    <div className="w-full sm:w-64 space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>₹{data.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Tax ({(data.taxRate * 100).toFixed(0)}%)</span>
                            <span>₹{data.tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2" style={{ borderColor: goldColor }}></div>
                        <div className="flex justify-between text-sm sm:text-lg font-bold">
                            <span style={{ color: accentColor }}>TOTAL DUE</span>
                            <span style={{ color: goldColor }}>₹{data.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* DARK FOOTER */}
            <div className="py-4 text-center text-white" style={{ backgroundColor: accentColor }}>
                <div className="h-0.5 mb-3" style={{ backgroundColor: goldColor }}></div>
                <p className="text-sm">Thank you for your valued business</p>
            </div>
        </div>
    );
};

export default TemplateExecutive;
