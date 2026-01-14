/**
 * MODERN TEMPLATE - HTML Generator
 * Clean minimal with accent sidebar
 * Matches TemplateModern.tsx exactly
 */

import {
  InvoiceData,
  ThemeConfig,
  wrapHtml,
  formatCurrency,
  formatInvoiceNumber,
  escapeHtml
} from "./baseTemplate.js";

export function generateModernHtml(data: InvoiceData, theme: ThemeConfig = {}): string {
  const accentColor = theme.accentColor || "#6366F1";

  const itemsHtml = data.items.map((item, index) => `
    <div class="invoice-item grid grid-cols-12 py-4 px-4 border-b border-gray-100" style="align-items: center; line-height: 1.5;">
      <div class="col-span-5 font-medium" style="display: flex; align-items: center;">${escapeHtml(item.description)}</div>
      <div class="col-span-2 text-gray-500" style="display: flex; align-items: center; justify-content: center;">${item.quantity}</div>
      <div class="col-span-2 text-gray-500" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price)}</div>
      <div class="col-span-3 font-bold" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price * item.quantity)}</div>
    </div>
  `).join("");

  const bodyContent = `
    <div class="flex bg-white text-gray-900" style="font-family: 'Inter', sans-serif; min-height: 100vh;">
      <!-- ACCENT SIDEBAR -->
      <div class="w-2" style="background-color: ${accentColor};"></div>

      <div class="flex-1 p-10">
        <!-- HEADER -->
        <div class="invoice-header flex justify-between items-start mb-10">
          <!-- Company Info -->
          <div>
            <h1 class="text-2xl font-bold mb-1" style="color: #1E293B;">${escapeHtml(data.from.name)}</h1>
            <p class="text-sm text-gray-500">${escapeHtml(data.from.address)}</p>
            <p class="text-sm text-gray-500">${escapeHtml(data.from.email || "")}</p>
          </div>

          <!-- Invoice Title -->
          <div class="text-right">
            <h2 class="text-3xl font-bold mb-1" style="color: ${accentColor};">INVOICE</h2>
            <p class="text-sm">#${formatInvoiceNumber(data.invoiceNumber)}</p>
          </div>
        </div>

        <!-- INFO SECTION -->
        <div class="grid grid-cols-3 gap-6 mb-8 text-sm">
          <!-- Dates -->
          <div>
            <p class="text-xs font-bold mb-1" style="color: ${accentColor};">DATE</p>
            <p>${escapeHtml(data.invoiceDate)}</p>
            <p class="text-xs font-bold mt-3 mb-1" style="color: ${accentColor};">DUE DATE</p>
            <p>${escapeHtml(data.dueDate)}</p>
          </div>

          <!-- Bill To -->
          <div>
            <p class="text-xs font-bold mb-1" style="color: ${accentColor};">BILL TO</p>
            <p class="font-medium">${escapeHtml(data.to.name)}</p>
            <p class="text-gray-500">${escapeHtml(data.to.address)}</p>
          </div>
        </div>

        <!-- TABLE -->
        <div class="rounded-lg overflow-hidden border border-gray-200 mb-8">
          <!-- Header -->
          <div class="grid grid-cols-12 py-3 px-4 text-sm font-bold" style="background-color: ${accentColor}15; color: ${accentColor}; align-items: center; line-height: 1.5;">
            <div class="col-span-5" style="display: flex; align-items: center;">DESCRIPTION</div>
            <div class="col-span-2" style="display: flex; align-items: center; justify-content: center;">QTY</div>
            <div class="col-span-2" style="display: flex; align-items: center; justify-content: flex-end;">RATE</div>
            <div class="col-span-3" style="display: flex; align-items: center; justify-content: flex-end;">AMOUNT</div>
          </div>

          <!-- Rows -->
          ${itemsHtml}
        </div>

        <!-- TOTALS -->
        <div class="invoice-totals flex justify-end">
          <div class="w-64 p-4 rounded-lg" style="background-color: #F9FAFB;">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Subtotal</span>
                <span>${formatCurrency(data.subtotal)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Tax (${(data.taxRate * 100).toFixed(0)}%)</span>
                <span>${formatCurrency(data.tax)}</span>
              </div>
              <div class="border-t pt-3 flex justify-between font-bold text-lg">
                <span style="color: ${accentColor};">Total</span>
                <span style="color: ${accentColor};">${formatCurrency(data.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- NOTES -->
        <div class="mt-8">
          <p class="text-sm text-gray-500">${escapeHtml(data.notes || "Thank you for your business!")}</p>
        </div>

        <!-- BRANDING -->
        <div class="invoice-footer mt-6 pt-4 border-t text-center text-xs text-gray-400">
          Crafted with <span class="font-semibold text-indigo-600">Lomerse</span>
        </div>
      </div>
    </div>
  `;

  return wrapHtml(bodyContent, `Invoice #${formatInvoiceNumber(data.invoiceNumber)}`);
}

export default { generateModernHtml };
