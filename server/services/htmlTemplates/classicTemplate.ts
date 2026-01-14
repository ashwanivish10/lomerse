/**
 * CLASSIC TEMPLATE - HTML Generator
 * Traditional bordered formal style
 * Matches TemplateClassic.tsx exactly
 */

import {
  InvoiceData,
  ThemeConfig,
  wrapHtml,
  formatCurrency,
  formatInvoiceNumber,
  escapeHtml
} from "./baseTemplate.js";

export function generateClassicHtml(data: InvoiceData, theme: ThemeConfig = {}): string {
  const accentColor = theme.accentColor || "#374151";

  const itemsHtml = data.items.map((item, index) => `
    <div class="invoice-item grid grid-cols-12 py-3 px-4 border-b border-gray-200" style="align-items: center; line-height: 1.5;">
      <div class="col-span-5" style="display: flex; align-items: center;">${escapeHtml(item.description)}</div>
      <div class="col-span-2 text-gray-600" style="display: flex; align-items: center; justify-content: center;">${item.quantity}</div>
      <div class="col-span-2 text-gray-600" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price)}</div>
      <div class="col-span-3 font-medium" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price * item.quantity)}</div>
    </div>
  `).join("");

  const bodyContent = `
    <div class="p-10 bg-white text-gray-900" style="font-family: 'Inter', sans-serif; min-height: 100vh;">
      <!-- TOP BORDER -->
      <div class="h-1 mb-4" style="background-color: ${accentColor};"></div>

      <!-- HEADER -->
      <div class="invoice-header flex justify-between items-start mb-6">
        <!-- Company Info -->
        <div>
          <h1 class="text-2xl font-bold mb-1" style="color: #1F2937;">${escapeHtml(data.from.name)}</h1>
          <p class="text-sm text-gray-500">${escapeHtml(data.from.address)}</p>
          <p class="text-sm text-gray-500">${escapeHtml(data.from.email || "")}</p>
        </div>

        <!-- Invoice Box -->
        <div class="border-2 p-4 text-center" style="border-color: ${accentColor};">
          <h2 class="text-xl font-bold mb-1" style="color: ${accentColor};">INVOICE</h2>
          <p class="text-sm text-gray-700">No: ${formatInvoiceNumber(data.invoiceNumber)}</p>
        </div>
      </div>

      <!-- DATES & BILL TO -->
      <div class="flex gap-6 mb-6">
        <!-- Bill To Box -->
        <div class="border-2 p-4 flex-1" style="border-color: ${accentColor};">
          <p class="text-xs font-bold mb-2" style="color: ${accentColor};">BILL TO:</p>
          <p class="font-bold">${escapeHtml(data.to.name)}</p>
          <p class="text-sm text-gray-500">${escapeHtml(data.to.address)}</p>
        </div>

        <!-- Dates -->
        <div class="text-sm text-right">
          <p class="text-gray-500">Invoice Date:</p>
          <p class="font-medium mb-2">${escapeHtml(data.invoiceDate)}</p>
          <p class="text-gray-500">Due Date:</p>
          <p class="font-medium">${escapeHtml(data.dueDate)}</p>
        </div>
      </div>

      <!-- TABLE -->
      <div class="border" style="border-color: ${accentColor};">
        <!-- Table Header -->
        <div class="grid grid-cols-12 py-2 px-4 font-bold text-sm border-b" style="background-color: #F3F4F6; border-color: ${accentColor}; color: ${accentColor}; align-items: center; line-height: 1.5;">
          <div class="col-span-5" style="display: flex; align-items: center;">Description</div>
          <div class="col-span-2" style="display: flex; align-items: center; justify-content: center;">Qty</div>
          <div class="col-span-2" style="display: flex; align-items: center; justify-content: flex-end;">Rate</div>
          <div class="col-span-3" style="display: flex; align-items: center; justify-content: flex-end;">Amount</div>
        </div>

        <!-- Table Rows -->
        ${itemsHtml}
      </div>

      <!-- TOTALS BOX -->
      <div class="invoice-totals flex justify-end mt-6">
        <div class="border w-64" style="border-color: ${accentColor};">
          <div class="flex justify-between px-4 py-2 text-sm">
            <span class="text-gray-500">Subtotal:</span>
            <span>${formatCurrency(data.subtotal)}</span>
          </div>
          <div class="flex justify-between px-4 py-2 text-sm border-t border-gray-200">
            <span class="text-gray-500">Tax (${(data.taxRate * 100).toFixed(0)}%):</span>
            <span>${formatCurrency(data.tax)}</span>
          </div>
          <div class="flex justify-between px-4 py-3 font-bold" style="background-color: #F3F4F6; color: ${accentColor};">
            <span>TOTAL:</span>
            <span>${formatCurrency(data.total)}</span>
          </div>
        </div>
      </div>

      <!-- BOTTOM BORDER -->
      <div class="h-1 mt-8" style="background-color: ${accentColor};"></div>

      <!-- FOOTER -->
      <p class="invoice-footer text-center text-sm text-gray-500 mt-4">
        Thank you for your business
      </p>
    </div>
  `;

  return wrapHtml(bodyContent, `Invoice #${formatInvoiceNumber(data.invoiceNumber)}`);
}

export default { generateClassicHtml };
