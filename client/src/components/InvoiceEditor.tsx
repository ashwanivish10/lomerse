import React from "react";
import { useInvoice } from "@/contexts/InvoiceContext";

function InvoiceEditor(): JSX.Element {
  const { invoiceData, setInvoiceData } = useInvoice();

  // ------------------------------
  // Top-Level Fields
  // ------------------------------
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "invoice_nr" || name === "taxRate") {
      setInvoiceData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setInvoiceData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ------------------------------
  // Customer Fields
  // ------------------------------
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInvoiceData((prev) => ({
      ...prev,
      customer: { ...prev.customer, [name]: value },
    }));
  };

  // ------------------------------
  // Items Table Logic
  // ------------------------------
  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    const newItems = invoiceData.items.map((item, i) => {
      if (i === index) {
        if (name === "quantity" || name === "unit_price") {
          return { ...item, [name]: parseFloat(value) || 0 };
        }
        return { ...item, [name]: value };
      }
      return item;
    });

    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { item: "", description: "", quantity: 1, unit_price: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    const filtered = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData((prev) => ({ ...prev, items: filtered }));
  };

  // ========================================================================

  return (
    <div className="form-editor flex flex-col gap-6 p-4">

      {/* ==================== Invoice Details ==================== */}
      <div className="form-section bg-white shadow-md rounded-xl p-5 space-y-4">
        <h3 className="text-xl font-semibold border-b pb-2">Invoice Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Invoice Number</label>
            <input
              type="number"
              name="invoice_nr"
              value={invoiceData.invoice_nr}
              onChange={handleDataChange}
              min="0"
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Invoice Date</label>
            <input
              type="date"
              name="date"
              value={invoiceData.date}
              onChange={handleDataChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* ==================== Customer Info ==================== */}
      <div className="form-section bg-white shadow-md rounded-xl p-5 space-y-4">
        <h3 className="text-xl font-semibold border-b pb-2">Bill To</h3>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={invoiceData.customer.name}
            onChange={handleCustomerChange}
            className="border rounded px-3 py-2"
          />

          <input
            type="text"
            name="address"
            placeholder="Customer Address"
            value={invoiceData.customer.address}
            onChange={handleCustomerChange}
            className="border rounded px-3 py-2"
          />

          <input
            type="text"
            name="city"
            placeholder="City, State, ZIP"
            value={invoiceData.customer.city}
            onChange={handleCustomerChange}
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* ==================== Items Table ==================== */}
      <div className="form-section bg-white shadow-md rounded-xl p-5 space-y-4">
        <h3 className="text-xl font-semibold border-b pb-2">Items</h3>

        {invoiceData.items.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 bg-gray-50 space-y-3"
          >
            {/* Main Row */}
            <div className="grid grid-cols-4 gap-3">
              <input
                type="text"
                name="item"
                placeholder="Item Name"
                value={item.item}
                onChange={(e) => handleItemChange(index, e)}
                className="border rounded px-3 py-2"
              />

              <input
                type="number"
                min="1"
                name="quantity"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                className="border rounded px-3 py-2"
              />

              <input
                type="number"
                min="0"
                name="unit_price"
                placeholder="Unit Price"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, e)}
                className="border rounded px-3 py-2"
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="bg-red-500 text-white rounded px-3 py-2 hover:bg-red-600"
              >
                ✖ Remove
              </button>
            </div>

            {/* Description Field */}
            <input
              type="text"
              name="description"
              placeholder="Description (optional)"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Add Item
        </button>
      </div>

      {/* ==================== Tax Section ==================== */}
      <div className="form-section bg-white shadow-md rounded-xl p-5 space-y-4">
        <h3 className="text-xl font-semibold border-b pb-2">Tax</h3>

        <label className="font-medium">Tax Rate (0.18 for 18%)</label>
        <input
          type="number"
          step="0.01"
          name="taxRate"
          value={invoiceData.taxRate}
          onChange={handleDataChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
    </div>
  );
}

export default InvoiceEditor;
