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
 * CREATIVE TEMPLATE - Bold colorful design with cards
 * Pink theme with rounded cards and playful elements
 */
const TemplateCreative: React.FC<TemplateProps> = ({
    data,
    logoUrl,
    themeClasses,
    editable = false,
    onDataChange,
}) => {
    const accentColor = themeClasses?.accentColor || "#EC4899";

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
        <div
            className="p-4 sm:p-6 md:p-8 text-gray-900 relative overflow-hidden"
            style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#FDF2F8" }}
        >
            {/* Decorative Circles */}
            <div
                className="absolute -top-8 -right-8 w-24 sm:w-32 h-24 sm:h-32 rounded-full opacity-30"
                style={{ backgroundColor: "#FCE7F3" }}
            ></div>
            <div
                className="absolute -bottom-8 -left-8 w-16 sm:w-24 h-16 sm:h-24 rounded-full opacity-40"
                style={{ backgroundColor: "#FBCFE8" }}
            ></div>

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
                <div>
                    <h1 className="text-2xl font-bold mb-1" style={{ color: accentColor }}>
                        <EditableText
                            value={data.from.name}
                            onChange={(v) => updateFrom("name", v)}
                            editable={editable}
                            placeholder="Creative Co"
                        />
                    </h1>
                    <p className="text-sm text-gray-500">
                        <EditableText
                            value={data.from.email || ""}
                            onChange={(v) => updateFrom("email", v)}
                            editable={editable}
                        />
                    </p>
                </div>

                {/* Invoice Badge */}
                <div
                    className="px-6 py-4 rounded-xl text-white text-center"
                    style={{ backgroundColor: accentColor }}
                >
                    <h2 className="text-lg font-bold">INVOICE</h2>
                    <p className="text-sm opacity-90">
                        #<EditableText
                            value={String(data.invoiceNumber).padStart(4, "0")}
                            onChange={(v) => updateData({ invoiceNumber: v })}
                            editable={editable}
                            className="text-white"
                        />
                    </p>
                </div>
            </div>

            {/* INFO CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 relative z-10">
                {/* Bill To Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs font-bold mb-2" style={{ color: accentColor }}>BILL TO</p>
                    <p className="font-bold">
                        <EditableText
                            value={data.to.name}
                            onChange={(v) => updateTo("name", v)}
                            editable={editable}
                        />
                    </p>
                    <p className="text-sm text-gray-500">
                        <EditableText
                            value={data.to.address}
                            onChange={(v) => updateTo("address", v)}
                            editable={editable}
                        />
                    </p>
                </div>

                {/* From Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs font-bold mb-2" style={{ color: accentColor }}>FROM</p>
                    <p className="font-bold">
                        <EditableText
                            value={data.from.name}
                            onChange={(v) => updateFrom("name", v)}
                            editable={editable}
                        />
                    </p>
                    <p className="text-sm text-gray-500">
                        <EditableText
                            value={data.from.address}
                            onChange={(v) => updateFrom("address", v)}
                            editable={editable}
                        />
                    </p>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs font-bold mb-2" style={{ color: accentColor }}>DETAILS</p>
                    <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Date:</span>
                            <EditableText
                                value={data.invoiceDate}
                                onChange={(v) => updateData({ invoiceDate: v })}
                                editable={editable}
                            />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Due:</span>
                            <EditableText
                                value={data.dueDate}
                                onChange={(v) => updateData({ dueDate: v })}
                                editable={editable}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6 relative z-10 overflow-x-auto">
                {/* Table Header */}
                <div
                    className="grid grid-cols-12 py-2 sm:py-3 px-2 sm:px-4 text-white text-[10px] sm:text-sm font-bold min-w-[300px]"
                    style={{ backgroundColor: accentColor }}
                >
                    <div className="col-span-5">DESCRIPTION</div>
                    <div className="col-span-2 text-center">QTY</div>
                    <div className="col-span-2 text-right">PRICE</div>
                    <div className="col-span-2 text-right">TOTAL</div>
                    {editable && <div className="col-span-1"></div>}
                </div>

                {/* Table Rows */}
                {data.items.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-12 py-2 sm:py-3 px-2 sm:px-4 items-center border-b border-gray-100 group min-w-[300px] text-xs sm:text-sm"
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
                        <div className="col-span-2 text-right font-bold" style={{ color: accentColor }}>
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
                    <button onClick={addItem} className="w-full py-3 text-sm text-pink-600 hover:bg-pink-50">
                        + Add Item
                    </button>
                )}
            </div>

            {/* TOTALS CARD */}
            <div className="flex justify-end relative z-10">
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm w-full sm:w-64">
                    <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span>₹{data.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tax ({(data.taxRate * 100).toFixed(0)}%)</span>
                            <span>₹{data.tax.toFixed(2)}</span>
                        </div>
                    </div>
                    <div
                        className="mt-3 sm:mt-4 py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-white font-bold text-sm sm:text-base flex justify-between"
                        style={{ backgroundColor: accentColor }}
                    >
                        <span>TOTAL</span>
                        <span>₹{data.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <p className="text-center font-bold mt-8 relative z-10" style={{ color: accentColor }}>
                Thank you for your business! ✨
            </p>
        </div>
    );
};

export default TemplateCreative;
