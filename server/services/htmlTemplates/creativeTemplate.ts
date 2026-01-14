/**
 * CREATIVE TEMPLATE - HTML Generator
 * Bold colorful design with cards and decorative elements
 * Matches TemplateCreative.tsx exactly
 */

import {
  InvoiceData,
  ThemeConfig,
  wrapHtml,
  formatCurrency,
  formatInvoiceNumber,
  escapeHtml
} from "./baseTemplate.js";

export function generateCreativeHtml(data: InvoiceData, theme: ThemeConfig = {}): string {
  const accentColor = theme.accentColor || "#EC4899";

  const itemsHtml = data.items.map((item, index) => `
    <div class="invoice-item grid grid-cols-12 py-3 px-4 border-b border-gray-100" style="align-items: center; line-height: 1.5;">
      <div class="col-span-5 font-medium" style="display: flex; align-items: center;">${escapeHtml(item.description)}</div>
      <div class="col-span-2 text-gray-500" style="display: flex; align-items: center; justify-content: center;">${item.quantity}</div>
      <div class="col-span-2 text-gray-500" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price)}</div>
      <div class="col-span-3 font-bold" style="display: flex; align-items: center; justify-content: flex-end; color: ${accentColor};">${formatCurrency(item.price * item.quantity)}</div>
    </div>
  `).join("");

  const bodyContent = `
    <div class="p-8 text-gray-900 relative overflow-hidden" style="font-family: 'Inter', sans-serif; background-color: #FDF2F8; min-height: 100vh;">
      <!-- Decorative Circles -->
      <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30" style="background-color: #FCE7F3;"></div>
      <div class="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-40" style="background-color: #FBCFE8;"></div>

      <!-- HEADER -->
      <div class="invoice-header flex justify-between items-start mb-6 relative z-10">
        <div>
          <h1 class="text-2xl font-bold mb-1" style="color: ${accentColor};">${escapeHtml(data.from.name)}</h1>
          <p class="text-sm text-gray-500">${escapeHtml(data.from.email || "")}</p>
        </div>

        <!-- Invoice Badge -->
        <div class="px-6 py-4 rounded-xl text-white text-center" style="background-color: ${accentColor};">
          <h2 class="text-lg font-bold">INVOICE</h2>
          <p class="text-sm opacity-90">#${String(data.invoiceNumber).padStart(4, "0")}</p>
        </div>
      </div>

      <!-- INFO CARDS -->
      <div class="grid grid-cols-3 gap-4 mb-6 relative z-10">
        <!-- Bill To Card -->
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <p class="text-xs font-bold mb-2" style="color: ${accentColor};">BILL TO</p>
          <p class="font-bold">${escapeHtml(data.to.name)}</p>
          <p class="text-sm text-gray-500">${escapeHtml(data.to.address)}</p>
        </div>

        <!-- From Card -->
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <p class="text-xs font-bold mb-2" style="color: ${accentColor};">FROM</p>
          <p class="font-bold">${escapeHtml(data.from.name)}</p>
          <p class="text-sm text-gray-500">${escapeHtml(data.from.address)}</p>
        </div>

        <!-- Details Card -->
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <p class="text-xs font-bold mb-2" style="color: ${accentColor};">DETAILS</p>
          <div class="text-sm space-y-1">
            <div class="flex justify-between">
              <span class="text-gray-500">Date:</span>
              <span>${escapeHtml(data.invoiceDate)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Due:</span>
              <span>${escapeHtml(data.dueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="bg-white rounded-xl overflow-hidden shadow-sm mb-6 relative z-10">
        <!-- Table Header -->
        <div class="grid grid-cols-12 py-3 px-4 text-white text-sm font-bold" style="background-color: ${accentColor}; align-items: center; line-height: 1.5;">
          <div class="col-span-5" style="display: flex; align-items: center;">DESCRIPTION</div>
          <div class="col-span-2" style="display: flex; align-items: center; justify-content: center;">QTY</div>
          <div class="col-span-2" style="display: flex; align-items: center; justify-content: flex-end;">PRICE</div>
          <div class="col-span-3" style="display: flex; align-items: center; justify-content: flex-end;">TOTAL</div>
        </div>

        <!-- Table Rows -->
        ${itemsHtml}
      </div>

      <!-- TOTALS CARD -->
      <div class="invoice-totals flex justify-end relative z-10">
        <div class="bg-white rounded-xl p-5 shadow-sm w-64">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Subtotal</span>
              <span>${formatCurrency(data.subtotal)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tax (${(data.taxRate * 100).toFixed(0)}%)</span>
              <span>${formatCurrency(data.tax)}</span>
            </div>
          </div>
          <div class="mt-4 py-3 px-4 rounded-lg text-white font-bold flex justify-between" style="background-color: ${accentColor};">
            <span>TOTAL</span>
            <span>${formatCurrency(data.total)}</span>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <p class="invoice-footer text-center font-bold mt-8 relative z-10" style="color: ${accentColor};">
        Thank you for your business! ✨
      </p>
    </div>
  `;

  return wrapHtml(bodyContent, `Invoice #${formatInvoiceNumber(data.invoiceNumber)}`);
}

export default { generateCreativeHtml };
