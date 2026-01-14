import PDFKit from "pdfkit";

/**
 * Gets theme colors with fallbacks.
 */
export function getColors(theme: any) {
  const safeTheme = theme || {};
  return {
    primary: safeTheme.primary || "#333", // Dark text
    secondary: safeTheme.secondary || "#888", // Light text
    accent: safeTheme.accent || "#3B82F6", // Blue
  };
}

/**
 * Draws the table header for the classic template.
 */
export function drawTableHeader(doc: PDFKit.PDFDocument, y: number, colors: any) {
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(colors.primary) // Use primary color for header text
    .text("Description", 50, y, { width: 250 })
    .text("Price", 300, y, { width: 90, align: "right" })
    .text("Qty", 400, y, { width: 90, align: "right" })
    .text("Total", 0, y, { align: "right" }); // Use remaining space

  // Add an underline
  doc
    .moveTo(50, y + 15)
    .lineTo(550, y + 15)
    .strokeColor(colors.accent)
    .stroke();
}

/**
 * Draws a single row in the table.
 */
export function drawTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  description: string,
  price: string,
  qty: string,
  total: string,
  colors: any
) {
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(colors.primary) // Dark text for items
    .text(description, 50, y, { width: 250 })
    .text(price, 300, y, { width: 90, align: "right" })
    .text(qty, 400, y, { width: 90, align: "right" })
    .text(total, 0, y, { align: "right" });

  // Add a light gray divider line
  doc
    .moveTo(50, y + 20)
    .lineTo(550, y + 20)
    .strokeColor("#eee") // Light gray
    .stroke();
}