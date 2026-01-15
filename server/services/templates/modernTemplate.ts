import PDFKit from "pdfkit";

/**
 * MODERN TEMPLATE
 * Clean, minimal design with accent color sidebar
 * Uses: Gradient sidebar, clean typography, modern table
 */
export function generate(
  doc: PDFKit.PDFDocument,
  invoice: any,
  theme: any
): void {
  const safeTheme = theme || {};
  const colors = {
    primary: safeTheme.primary || "#1E293B",
    secondary: safeTheme.secondary || "#64748B",
    accent: safeTheme.accent || "#6366F1",
  };

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // --- ACCENT SIDEBAR ---
  doc.rect(0, 0, 8, pageHeight).fill(colors.accent);

  // --- HEADER ---
  doc
    .fillColor(colors.primary)
    .fontSize(24)
    .font("Helvetica-Bold")
    .text(invoice.from?.name || "Company Name", 50, 50)
    .fontSize(9)
    .font("Helvetica")
    .fillColor(colors.secondary)
    .text(invoice.from?.address || "", 50, 78)
    .text(invoice.from?.email || "", 50, 91);

  // Invoice Title & Number
  doc
    .fillColor(colors.accent)
    .fontSize(32)
    .font("Helvetica-Bold")
    .text("INVOICE", 350, 50, { align: "right", width: 200 })
    .fontSize(10)
    .font("Helvetica")
    .fillColor(colors.primary)
    .text(`#${String(invoice.invoiceNumber).padStart(5, "0")}`, 350, 88, { align: "right", width: 200 });

  // --- DATES & BILLING INFO ---
  const infoTop = 140;

  // Left side - Dates
  doc
    .fillColor(colors.accent)
    .fontSize(8)
    .font("Helvetica-Bold")
    .text("DATE", 50, infoTop);
  doc
    .fillColor(colors.primary)
    .fontSize(10)
    .font("Helvetica")
    .text(invoice.invoiceDate, 50, infoTop + 12);

  doc
    .fillColor(colors.accent)
    .fontSize(8)
    .font("Helvetica-Bold")
    .text("DUE DATE", 50, infoTop + 35);
  doc
    .fillColor(colors.primary)
    .fontSize(10)
    .font("Helvetica")
    .text(invoice.dueDate, 50, infoTop + 47);

  // Middle - Bill To
  doc
    .fillColor(colors.accent)
    .fontSize(8)
    .font("Helvetica-Bold")
    .text("BILL TO", 200, infoTop);
  doc
    .fillColor(colors.primary)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(invoice.to?.name || "", 200, infoTop + 12)
    .fontSize(9)
    .font("Helvetica")
    .fillColor(colors.secondary)
    .text(invoice.to?.address || "", 200, infoTop + 26);

  // --- TABLE ---
  const tableTop = 240;
  const rowHeight = 30;
  const pageBottom = pageHeight - 100;

  // Table Header Background
  doc.rect(50, tableTop, 500, 28).fill(colors.accent + "15");

  // Table Header Text
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(colors.accent)
    .text("DESCRIPTION", 60, tableTop + 9)
    .text("QTY", 340, tableTop + 9, { width: 50, align: "center" })
    .text("RATE", 400, tableTop + 9, { width: 70, align: "right" })
    .text("AMOUNT", 480, tableTop + 9, { width: 70, align: "right" });

  // Table Items
  let y = tableTop + 38;

  // Helper function to draw table header on new pages
  const drawTableHeader = (yPos: number) => {
    doc.rect(50, yPos, 500, 28).fill(colors.accent + "15");
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(colors.accent)
      .text("DESCRIPTION", 60, yPos + 9)
      .text("QTY", 340, yPos + 9, { width: 50, align: "center" })
      .text("RATE", 400, yPos + 9, { width: 70, align: "right" })
      .text("AMOUNT", 480, yPos + 9, { width: 70, align: "right" });
    return yPos + 38;
  };

  invoice.items.forEach((item: any, i: number) => {
    if (y + rowHeight > pageBottom) {
      doc.addPage();
      // Redraw sidebar on new page
      doc.rect(0, 0, 8, pageHeight).fill(colors.accent);
      y = drawTableHeader(50);
    }

    const lineTotal = item.quantity * item.price;

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.primary)
      .text(item.description, 60, y)
      .fillColor(colors.secondary)
      .text(String(item.quantity), 340, y, { width: 50, align: "center" })
      .text(`${item.price.toFixed(2)}`, 400, y, { width: 70, align: "right" })
      .fillColor(colors.primary)
      .font("Helvetica-Bold")
      .text(`${lineTotal.toFixed(2)}`, 480, y, { width: 70, align: "right" });

    // Divider
    if (i < invoice.items.length - 1) {
      doc
        .strokeColor("#E5E7EB")
        .lineWidth(0.5)
        .moveTo(60, y + 20)
        .lineTo(550, y + 20)
        .stroke();
    }

    y += rowHeight;
  });

  // --- TOTALS ---
  y += 25;

  // Totals Background
  doc.rect(380, y - 5, 170, 85).fill("#F9FAFB");

  doc.font("Helvetica").fontSize(10).fillColor(colors.secondary);
  doc.text("Subtotal", 390, y);
  doc.fillColor(colors.primary).text(`${invoice.subtotal.toFixed(2)}`, 480, y, { width: 60, align: "right" });

  y += 20;
  doc.fillColor(colors.secondary).text(`Tax (${(invoice.taxRate * 100).toFixed(0)}%)`, 390, y);
  doc.fillColor(colors.primary).text(`${invoice.tax.toFixed(2)}`, 480, y, { width: 60, align: "right" });

  y += 25;
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(colors.accent)
    .text("Total", 390, y)
    .text(`Rs.${invoice.total.toFixed(2)}`, 480, y, { width: 60, align: "right" });

  // --- FOOTER ---
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(colors.secondary)
    .text("Thank you for your business!", 50, pageHeight - 60)
    .fontSize(8)
    .text(invoice.notes || "", 50, pageHeight - 45);
}

export default { generate };