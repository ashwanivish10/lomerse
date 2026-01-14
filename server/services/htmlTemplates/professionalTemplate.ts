/**
 * PROFESSIONAL TEMPLATE - HTML Generator
 * Corporate blue header/footer bars
 * Matches TemplateProfessional.tsx exactly
 */

import {
  InvoiceData,
  ThemeConfig,
  wrapHtml,
  formatCurrency,
  formatInvoiceNumber,
  escapeHtml
} from "./baseTemplate.js";

export function generateProfessionalHtml(data: InvoiceData, theme: ThemeConfig = {}): string {
  const accentColor = theme.accentColor || "#2563EB";

  const itemsHtml = data.items.map((item, index) => `
    <div class="invoice-item grid grid-cols-12 py-3 px-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}" style="align-items: center; line-height: 1.5;">
      <div class="col-span-5 font-medium" style="display: flex; align-items: center;">${escapeHtml(item.description)}</div>
      <div class="col-span-2 text-gray-600" style="display: flex; align-items: center; justify-content: center;">${item.quantity}</div>
      <div class="col-span-2 text-gray-600" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price)}</div>
      <div class="col-span-3 font-bold" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price * item.quantity)}</div>
    </div>
  `).join("");

  const bodyContent = `
    <div class="bg-white text-gray-900" style="font-family: 'Inter', sans-serif; min-height: 100vh;">
      <!-- TOP HEADER BAR -->
      <div class="invoice-header py-6 px-8 text-white" style="background-color: ${accentColor};">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">${escapeHtml(data.from.name)}</h1>
            <p class="text-sm opacity-80">${escapeHtml(data.from.email || "")}</p>
          </div>
          <div class="text-right">
            <h2 class="text-lg font-bold">INVOICE</h2>
            <p class="text-sm opacity-90">#${formatInvoiceNumber(data.invoiceNumber)}</p>
          </div>
        </div>
      </div>

      <div class="p-8">
        <!-- INFO BOXES -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <!-- Bill To -->
          <div class="bg-gray-50 p-4 rounded">
            <p class="text-xs font-bold mb-2" style="color: ${accentColor};">BILL TO</p>
            <p class="font-bold text-lg">${escapeHtml(data.to.name)}</p>
            <p class="text-sm text-gray-500">${escapeHtml(data.to.address)}</p>
          </div>

          <!-- Invoice Details -->
          <div class="bg-gray-50 p-4 rounded">
            <p class="text-xs font-bold mb-2" style="color: ${accentColor};">INVOICE DETAILS</p>
            <div class="text-sm space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-500">Issue Date:</span>
                <span>${escapeHtml(data.invoiceDate)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Due Date:</span>
                <span>${escapeHtml(data.dueDate)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">From:</span>
                <span>${escapeHtml(data.from.address)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TABLE -->
        <div class="rounded overflow-hidden border border-gray-200">
          <!-- Table Header -->
          <div class="grid grid-cols-12 py-3 px-4 text-white text-sm font-bold" style="background-color: ${accentColor}; align-items: center; line-height: 1.5;">
            <div class="col-span-5" style="display: flex; align-items: center;">DESCRIPTION</div>
            <div class="col-span-2" style="display: flex; align-items: center; justify-content: center;">QTY</div>
            <div class="col-span-2" style="display: flex; align-items: center; justify-content: flex-end;">RATE</div>
            <div class="col-span-3" style="display: flex; align-items: center; justify-content: flex-end;">AMOUNT</div>
          </div>

          <!-- Table Rows -->
          ${itemsHtml}
        </div>

        <!-- TOTALS -->
        <div class="invoice-totals flex justify-end mt-6">
          <div class="w-64 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Subtotal</span>
              <span>${formatCurrency(data.subtotal)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Tax (${(data.taxRate * 100).toFixed(0)}%)</span>
              <span>${formatCurrency(data.tax)}</span>
            </div>
            <div class="flex justify-between font-bold text-white px-4 py-3 rounded" style="background-color: ${accentColor};">
              <span>TOTAL DUE</span>
              <span>${formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM BAR -->
      <div class="invoice-footer py-3 text-center text-white text-sm" style="background-color: ${accentColor};">
        Thank you for your business!
      </div>
    </div>
  `;

  return wrapHtml(bodyContent, `Invoice #${formatInvoiceNumber(data.invoiceNumber)}`);
}

export default { generateProfessionalHtml };
