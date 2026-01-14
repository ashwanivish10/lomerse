/**
 * MINIMAL TEMPLATE - HTML Generator
 * Ultra-clean with lots of whitespace
 * Matches TemplateMinimal.tsx exactly
 */

import {
  InvoiceData,
  ThemeConfig,
  wrapHtml,
  formatCurrency,
  formatInvoiceNumber,
  escapeHtml
} from "./baseTemplate.js";

export function generateMinimalHtml(data: InvoiceData, theme: ThemeConfig = {}): string {
  const itemsHtml = data.items.map((item, index) => `
    <div class="invoice-item grid grid-cols-12 py-4 border-b border-gray-100" style="align-items: center; line-height: 1.5;">
      <div class="col-span-5 font-medium" style="display: flex; align-items: center;">${escapeHtml(item.description)}</div>
      <div class="col-span-2 text-gray-500" style="display: flex; align-items: center; justify-content: center;">${item.quantity}</div>
      <div class="col-span-2 text-gray-500" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price)}</div>
      <div class="col-span-3 font-medium" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price * item.quantity)}</div>
    </div>
  `).join("");

  const bodyContent = `
    <div class="p-12 bg-white text-gray-900" style="font-family: 'Inter', sans-serif; min-height: 100vh;">
      <!-- HEADER -->
      <div class="invoice-header flex justify-between items-start mb-6">
        <h1 class="text-lg font-bold text-gray-900">${escapeHtml(data.from.name)}</h1>
        <h2 class="text-4xl font-light text-gray-400">Invoice</h2>
      </div>

      <!-- DIVIDER -->
      <div class="border-b border-gray-200 mb-8"></div>

      <!-- INFO GRID -->
      <div class="grid grid-cols-3 gap-8 mb-10 text-sm">
        <!-- From -->
        <div>
          <p class="text-xs text-gray-400 mb-1">From</p>
          <p class="font-medium">${escapeHtml(data.from.name)}</p>
          <p class="text-gray-500">${escapeHtml(data.from.address)}</p>
          <p class="text-gray-500">${escapeHtml(data.from.email || "")}</p>
        </div>

        <!-- Bill To -->
        <div>
          <p class="text-xs text-gray-400 mb-1">Bill To</p>
          <p class="font-medium">${escapeHtml(data.to.name)}</p>
          <p class="text-gray-500">${escapeHtml(data.to.address)}</p>
        </div>

        <!-- Invoice Details -->
        <div class="text-right">
          <div class="mb-3">
            <p class="text-xs text-gray-400">Invoice No.</p>
            <p class="font-bold">${formatInvoiceNumber(data.invoiceNumber)}</p>
          </div>
          <div class="mb-3">
            <p class="text-xs text-gray-400">Date</p>
            <p>${escapeHtml(data.invoiceDate)}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Due Date</p>
            <p>${escapeHtml(data.dueDate)}</p>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="border-t-2 border-gray-900 mb-6">
        <!-- Header -->
        <div class="grid grid-cols-12 py-3 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-200" style="align-items: center; line-height: 1.5;">
          <div class="col-span-5" style="display: flex; align-items: center;">Description</div>
          <div class="col-span-2" style="display: flex; align-items: center; justify-content: center;">Qty</div>
          <div class="col-span-2" style="display: flex; align-items: center; justify-content: flex-end;">Rate</div>
          <div class="col-span-3" style="display: flex; align-items: center; justify-content: flex-end;">Amount</div>
        </div>

        <!-- Rows -->
        ${itemsHtml}
      </div>

      <!-- TOTALS -->
      <div class="invoice-totals flex justify-end">
        <div class="w-64">
          <div class="border-t border-gray-900 pt-4 space-y-2">
            <div class="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span class="text-gray-900">${formatCurrency(data.subtotal)}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>Tax (${(data.taxRate * 100).toFixed(0)}%)</span>
              <span class="text-gray-900">${formatCurrency(data.tax)}</span>
            </div>
            <div class="border-t-2 border-gray-900 pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <p class="invoice-footer text-sm text-gray-400 mt-12">Thank you.</p>
    </div>
  `;

  return wrapHtml(bodyContent, `Invoice #${formatInvoiceNumber(data.invoiceNumber)}`);
}

export default { generateMinimalHtml };
