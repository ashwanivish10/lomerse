import PDFKit from "pdfkit";

/**
 * CLASSIC TEMPLATE
 * Traditional business invoice with serif-style header
 * Uses: Bordered sections, classic layout, formal typography
 */
export function generate(doc: PDFKit.PDFDocument, invoice: any, theme: any) {
  const safeTheme = theme || {};
  const colors = {
    primary: safeTheme.primary || "#1F2937",
    secondary: safeTheme.secondary || "#6B7280",
    accent: safeTheme.accent || "#374151",
  };

  const pageBottom = doc.page.height - 80;
  const rowHeight = 26;

  // --- HEADER BORDER ---
  doc
    .strokeColor(colors.accent)
    .lineWidth(3)
    .moveTo(50, 45)
    .lineTo(550, 45)
    .stroke();

  // --- COMPANY NAME ---
  doc
    .fillColor(colors.primary)
    .fontSize(28)
    .font("Helvetica-Bold")
    .text(invoice.from?.name || "Company Name", 50, 60);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(colors.secondary)
    .text(invoice.from?.address || "", 50, 92)
    .text(invoice.from?.email || "", 50, 106);

  // --- INVOICE LABEL ---
  doc
    .strokeColor(colors.accent)
    .lineWidth(1)
    .rect(400, 55, 150, 55)
    .stroke();

  doc
    .fillColor(colors.accent)
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("INVOICE", 400, 65, { align: "center", width: 150 })
    .fontSize(12)
    .font("Helvetica")
    .fillColor(colors.primary)
    .text(`No: ${String(invoice.invoiceNumber).padStart(5, "0")}`, 400, 92, { align: "center", width: 150 });

  // --- DATES ---
  const datesTop = 140;
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(colors.secondary)
    .text("Invoice Date:", 400, datesTop)
    .fillColor(colors.primary)
    .text(invoice.invoiceDate, 480, datesTop)
    .fillColor(colors.secondary)
    .text("Due Date:", 400, datesTop + 16)
    .fillColor(colors.primary)
    .text(invoice.dueDate, 480, datesTop + 16);

  // --- BILL TO SECTION ---
  doc
    .strokeColor(colors.accent)
    .lineWidth(1)
    .rect(50, 140, 300, 60)
    .stroke();

  doc
    .fillColor(colors.accent)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("BILL TO:", 60, 150);

  doc
    .fillColor(colors.primary)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(invoice.to?.name || "", 60, 165)
    .fontSize(10)
    .font("Helvetica")
    .fillColor(colors.secondary)
    .text(invoice.to?.address || "", 60, 180);

  // --- TABLE ---
  const tableTop = 220;

  // Table Header with border
  doc
    .strokeColor(colors.accent)
    .lineWidth(1)
    .rect(50, tableTop, 500, 26)
    .fillAndStroke("#F3F4F6", colors.accent);

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(colors.accent)
    .text("Description", 60, tableTop + 8)
    .text("Qty", 330, tableTop + 8, { width: 50, align: "center" })
    .text("Rate", 390, tableTop + 8, { width: 70, align: "right" })
    .text("Amount", 470, tableTop + 8, { width: 70, align: "right" });

  // Table rows
  let y = tableTop + 30;

  // Helper function to draw table header
  const drawTableHeader = (yPos: number) => {
    doc
      .strokeColor(colors.accent)
      .lineWidth(1)
      .rect(50, yPos, 500, 26)
      .fillAndStroke("#F3F4F6", colors.accent);

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(colors.accent)
      .text("Description", 60, yPos + 8)
      .text("Qty", 330, yPos + 8, { width: 50, align: "center" })
      .text("Rate", 390, yPos + 8, { width: 70, align: "right" })
      .text("Amount", 470, yPos + 8, { width: 70, align: "right" });
    return yPos + 30;
  };

  invoice.items.forEach((item: any, i: number) => {
    if (y + rowHeight > pageBottom) {
      doc.addPage();
      y = drawTableHeader(50);
    }

    const lineTotal = item.quantity * item.price;

    // Row border
    doc
      .strokeColor("#E5E7EB")
      .lineWidth(0.5)
      .moveTo(50, y + rowHeight - 4)
      .lineTo(550, y + rowHeight - 4)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.primary)
      .text(item.description, 60, y)
      .fillColor(colors.secondary)
      .text(String(item.quantity), 330, y, { width: 50, align: "center" })
      .text(`${item.price.toFixed(2)}`, 390, y, { width: 70, align: "right" })
      .fillColor(colors.primary)
      .text(`${lineTotal.toFixed(2)}`, 470, y, { width: 70, align: "right" });

    y += rowHeight;
  });

  // --- TOTALS ---
  y += 20;

  // Totals box
  doc
    .strokeColor(colors.accent)
    .lineWidth(1)
    .rect(350, y, 200, 75)
    .stroke();

  doc.font("Helvetica").fontSize(10).fillColor(colors.secondary);
  doc.text("Subtotal:", 360, y + 10);
  doc.fillColor(colors.primary).text(`${invoice.subtotal.toFixed(2)}`, 470, y + 10, { width: 70, align: "right" });

  doc.fillColor(colors.secondary).text("Tax:", 360, y + 28);
  doc.fillColor(colors.primary).text(`${invoice.tax.toFixed(2)}`, 470, y + 28, { width: 70, align: "right" });

  // Total row with background
  doc.rect(352, y + 48, 196, 24).fill("#F3F4F6");
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(colors.accent)
    .text("TOTAL:", 360, y + 54)
    .text(`Rs.${invoice.total.toFixed(2)}`, 470, y + 54, { width: 70, align: "right" });

  // --- FOOTER BORDER ---
  doc
    .strokeColor(colors.accent)
    .lineWidth(3)
    .moveTo(50, doc.page.height - 50)
    .lineTo(550, doc.page.height - 50)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(colors.secondary)
    .text("Thank you for your business", 50, doc.page.height - 40, { align: "center", width: 500 });
}

export default { generate };