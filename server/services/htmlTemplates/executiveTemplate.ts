/**
 * EXECUTIVE TEMPLATE - HTML Generator
 * Luxury premium with dark header/footer and gold accents
 * Matches TemplateExecutive.tsx exactly
 */

import {
  InvoiceData,
  ThemeConfig,
  wrapHtml,
  formatCurrency,
  formatInvoiceNumber,
  escapeHtml
} from "./baseTemplate.js";

export function generateExecutiveHtml(data: InvoiceData, theme: ThemeConfig = {}): string {
  const accentColor = theme.accentColor || "#0F172A";
  const goldColor = "#B8860B";

  const itemsHtml = data.items.map((item, index) => `
    <div class="invoice-item grid grid-cols-12 py-4 border-b border-gray-100" style="align-items: center; line-height: 1.5;">
      <div class="col-span-5 font-medium" style="display: flex; align-items: center;">${escapeHtml(item.description)}</div>
      <div class="col-span-2 text-gray-500" style="display: flex; align-items: center; justify-content: center;">${item.quantity}</div>
      <div class="col-span-2 text-gray-500" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price)}</div>
      <div class="col-span-3 font-bold" style="display: flex; align-items: center; justify-content: flex-end;">${formatCurrency(item.price * item.quantity)}</div>
    </div>
  `).join("");

  const bodyContent = `
    <div class="bg-white text-gray-900" style="font-family: 'Inter', sans-serif; min-height: 100vh;">
      <!-- DARK HEADER -->
      <div class="invoice-header py-6 px-8 text-white" style="background-color: ${accentColor};">
        <div class="h-1 mb-4" style="background-color: ${goldColor};"></div>
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold mb-2">${escapeHtml(data.from.name)}</h1>
            <p class="text-sm opacity-70">${escapeHtml(data.from.address)}</p>
            <p class="text-sm opacity-70">${escapeHtml(data.from.email || "")}</p>
          </div>
          <div class="text-right">
            <p class="text-xs mb-1" style="color: ${goldColor};">INVOICE</p>
            <p class="text-2xl font-bold">#${formatInvoiceNumber(data.invoiceNumber)}</p>
            <p class="text-sm opacity-70 mt-2">Date: ${escapeHtml(data.invoiceDate)}</p>
          </div>
        </div>
      </div>

      <!-- GOLD ACCENT LINE -->
      <div class="h-1" style="background-color: ${goldColor};"></div>

      <div class="p-8">
        <!-- INFO SECTION -->
        <div class="flex justify-between mb-8">
          <!-- Bill To -->
          <div>
            <p class="text-xs font-bold mb-2" style="color: ${goldColor};">BILL TO</p>
            <p class="text-xl font-bold">${escapeHtml(data.to.name)}</p>
            <p class="text-gray-500">${escapeHtml(data.to.address)}</p>
          </div>

          <!-- Due Date -->
          <div class="text-right">
            <p class="text-xs font-bold mb-2" style="color: ${goldColor};">DUE DATE</p>
            <p class="text-xl font-bold">${escapeHtml(data.dueDate)}</p>
          </div>
        </div>

        <!-- TABLE -->
        <div class="border-t-2 mb-6" style="border-color: ${accentColor};">
          <!-- Header -->
          <div class="grid grid-cols-12 py-3 text-xs uppercase tracking-wide" style="color: ${goldColor}; align-items: center; line-height: 1.5;">
            <div class="col-span-5 font-bold" style="display: flex; align-items: center;">SERVICE / DESCRIPTION</div>
            <div class="col-span-2 font-bold" style="display: flex; align-items: center; justify-content: center;">QTY</div>
            <div class="col-span-2 font-bold" style="display: flex; align-items: center; justify-content: flex-end;">RATE</div>
            <div class="col-span-3 font-bold" style="display: flex; align-items: center; justify-content: flex-end;">AMOUNT</div>
          </div>

          <!-- Rows -->
          ${itemsHtml}
        </div>

        <!-- TOTALS -->
        <div class="invoice-totals flex justify-end">
          <div class="w-64 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Subtotal</span>
              <span>${formatCurrency(data.subtotal)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Tax (${(data.taxRate * 100).toFixed(0)}%)</span>
              <span>${formatCurrency(data.tax)}</span>
            </div>
            <div class="border-t pt-2" style="border-color: ${goldColor};"></div>
            <div class="flex justify-between text-lg font-bold">
              <span style="color: ${accentColor};">TOTAL DUE</span>
              <span style="color: ${goldColor};">${formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- DARK FOOTER -->
      <div class="invoice-footer py-4 text-center text-white" style="background-color: ${accentColor}; position: absolute; bottom: 0; left: 0; right: 0;">
        <div class="h-0.5 mb-3" style="background-color: ${goldColor};"></div>
        <p class="text-sm">Thank you for your valued business</p>
      </div>
    </div>
  `;

  return wrapHtml(bodyContent, `Invoice #${formatInvoiceNumber(data.invoiceNumber)}`);
}

export default { generateExecutiveHtml };
