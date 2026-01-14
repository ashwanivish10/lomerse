import PDFKit from "pdfkit";

/**
 * CREATIVE TEMPLATE
 * Bold, colorful design with modern cards
 * Uses: Rounded corners, gradient-like backgrounds, playful elements
 */
export function generate(
    doc: PDFKit.PDFDocument,
    invoice: any,
    theme: any
): void {
    const safeTheme = theme || {};
    const colors = {
        primary: "#1E293B",
        secondary: "#64748B",
        accent: safeTheme.accent || "#EC4899",
    };

    const pageBottom = doc.page.height - 100;
    const rowHeight = 30;

    // --- BACKGROUND ---
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FDF2F8");

    // Decorative circles
    doc.circle(550, 50, 40).fill("#FCE7F3");
    doc.circle(580, 80, 25).fill("#FBCFE8");
    doc.circle(30, doc.page.height - 30, 30).fill("#FCE7F3");

    // --- HEADER ---
    doc
        .fillColor(colors.accent)
        .fontSize(28)
        .font("Helvetica-Bold")
        .text(invoice.from?.name || "Creative Co", 50, 50);

    doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor(colors.secondary)
        .text(invoice.from?.email || "", 50, 82);

    // Invoice Badge
    doc.roundedRect(400, 40, 140, 55, 12).fill(colors.accent);
    doc
        .fillColor("#ffffff")
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("INVOICE", 400, 52, { align: "center", width: 140 })
        .fontSize(11)
        .font("Helvetica")
        .text(`#${String(invoice.invoiceNumber).padStart(4, "0")}`, 400, 74, { align: "center", width: 140 });

    // --- INFO CARDS ---
    const cardTop = 120;
    const cardHeight = 70;
    const cardWidth = 155;

    // Card 1 - Bill To
    doc.roundedRect(50, cardTop, cardWidth, cardHeight, 10).fill("#ffffff");
    doc
        .fillColor(colors.accent)
        .fontSize(7)
        .font("Helvetica-Bold")
        .text("BILL TO", 60, cardTop + 12);
    doc
        .fillColor(colors.primary)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(invoice.to?.name || "", 60, cardTop + 28)
        .fontSize(8)
        .font("Helvetica")
        .fillColor(colors.secondary)
        .text(invoice.to?.address || "", 60, cardTop + 44, { width: 135 });

    // Card 2 - From
    doc.roundedRect(215, cardTop, cardWidth, cardHeight, 10).fill("#ffffff");
    doc
        .fillColor(colors.accent)
        .fontSize(7)
        .font("Helvetica-Bold")
        .text("FROM", 225, cardTop + 12);
    doc
        .fillColor(colors.primary)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(invoice.from?.name || "", 225, cardTop + 28)
        .fontSize(8)
        .font("Helvetica")
        .fillColor(colors.secondary)
        .text(invoice.from?.address || "", 225, cardTop + 44, { width: 135 });

    // Card 3 - Details
    doc.roundedRect(380, cardTop, cardWidth + 15, cardHeight, 10).fill("#ffffff");
    doc
        .fillColor(colors.accent)
        .fontSize(7)
        .font("Helvetica-Bold")
        .text("DETAILS", 395, cardTop + 12);
    doc.font("Helvetica").fontSize(8);
    doc.fillColor(colors.secondary).text("Issue Date:", 395, cardTop + 28);
    doc.fillColor(colors.primary).text(invoice.invoiceDate, 460, cardTop + 28);
    doc.fillColor(colors.secondary).text("Due Date:", 395, cardTop + 44);
    doc.fillColor(colors.primary).text(invoice.dueDate, 460, cardTop + 44);

    // --- TABLE ---
    const tableTop = 210;

    // Table Container
    const tableHeight = 30 + (invoice.items.length * rowHeight) + 15;
    doc.roundedRect(50, tableTop, 500, tableHeight, 10).fill("#ffffff");

    // Table Header
    doc.roundedRect(50, tableTop, 500, 30, 10).fill(colors.accent);
    doc.rect(50, tableTop + 15, 500, 15).fill(colors.accent); // Square bottom to blend

    doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#ffffff")
        .text("DESCRIPTION", 65, tableTop + 10)
        .text("QTY", 330, tableTop + 10, { width: 50, align: "center" })
        .text("PRICE", 395, tableTop + 10, { width: 60, align: "right" })
        .text("TOTAL", 470, tableTop + 10, { width: 65, align: "right" });

    // Table Items
    let y = tableTop + 42;

    invoice.items.forEach((item: any) => {
        if (y + rowHeight > pageBottom - 120) {
            doc.addPage();
            doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FDF2F8");
            y = 50;
        }

        const lineTotal = item.quantity * item.price;

        doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor(colors.primary)
            .text(item.description, 65, y)
            .fillColor(colors.secondary)
            .text(String(item.quantity), 330, y, { width: 50, align: "center" })
            .text(`${item.price.toFixed(2)}`, 395, y, { width: 60, align: "right" })
            .fillColor(colors.accent)
            .font("Helvetica-Bold")
            .text(`${lineTotal.toFixed(2)}`, 470, y, { width: 65, align: "right" });

        y += rowHeight;
    });

    // --- TOTALS CARD ---
    y += 25;
    const totalsWidth = 200;
    const totalsHeight = 105;
    const totalsX = 350;

    doc.roundedRect(totalsX, y, totalsWidth, totalsHeight, 10).fill("#ffffff");

    doc.font("Helvetica").fontSize(9).fillColor(colors.secondary);
    doc.text("Subtotal", totalsX + 20, y + 18);
    doc.fillColor(colors.primary).text(`${invoice.subtotal.toFixed(2)}`, totalsX + totalsWidth - 90, y + 18, { width: 70, align: "right" });

    doc.fillColor(colors.secondary).text(`Tax (${(invoice.taxRate * 100).toFixed(0)}%)`, totalsX + 20, y + 38);
    doc.fillColor(colors.primary).text(`${invoice.tax.toFixed(2)}`, totalsX + totalsWidth - 90, y + 38, { width: 70, align: "right" });

    // Total with accent background
    doc.roundedRect(totalsX + 12, y + 60, totalsWidth - 24, 35, 8).fill(colors.accent);
    doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#ffffff")
        .text("TOTAL", totalsX + 28, y + 72)
        .text(`Rs.${invoice.total.toFixed(2)}`, totalsX + totalsWidth - 100, y + 72, { width: 70, align: "right" });

    // --- FOOTER ---
    doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(colors.accent)
        .text("Thank you for your business! ✨", 0, doc.page.height - 50, { align: "center" });
}

export default { generate };
