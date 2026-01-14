import PDFKit from "pdfkit";

/**
 * EXECUTIVE TEMPLATE
 * Luxury premium look with dark header/footer
 * Uses: Dark header, elegant spacing, gold-like accents
 */
export function generate(
    doc: PDFKit.PDFDocument,
    invoice: any,
    theme: any
): void {
    const safeTheme = theme || {};
    const colors = {
        primary: "#0F172A",
        secondary: "#64748B",
        accent: safeTheme.accent || "#0F172A",
        gold: "#B8860B",
    };

    const pageBottom = doc.page.height - 100;
    const rowHeight = 30;

    // --- DARK HEADER ---
    doc.rect(0, 0, doc.page.width, 110).fill(colors.accent);

    // Gold accent line
    doc.rect(0, 110, doc.page.width, 4).fill(colors.gold);

    // Company Name
    doc
        .fillColor("#ffffff")
        .fontSize(26)
        .font("Helvetica-Bold")
        .text(invoice.from?.name || "COMPANY", 50, 35);

    doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#ffffff")
        .opacity(0.8)
        .text(invoice.from?.address || "", 50, 68)
        .text(invoice.from?.email || "", 50, 82)
        .opacity(1);

    // Invoice Title (right side)
    doc
        .fillColor(colors.gold)
        .fontSize(12)
        .font("Helvetica")
        .text("INVOICE", 400, 40, { align: "right", width: 150 })
        .fillColor("#ffffff")
        .fontSize(24)
        .font("Helvetica-Bold")
        .text(`#${String(invoice.invoiceNumber).padStart(5, "0")}`, 400, 55, { align: "right", width: 150 })
        .fontSize(9)
        .font("Helvetica")
        .opacity(0.8)
        .text(`Date: ${invoice.invoiceDate}`, 400, 85, { align: "right", width: 150 })
        .opacity(1);

    // --- CONTENT AREA ---
    const contentTop = 140;

    // Bill To Section
    doc
        .fillColor(colors.gold)
        .fontSize(8)
        .font("Helvetica-Bold")
        .text("BILL TO", 50, contentTop);

    doc
        .fillColor(colors.primary)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(invoice.to?.name || "", 50, contentTop + 15)
        .fontSize(10)
        .font("Helvetica")
        .fillColor(colors.secondary)
        .text(invoice.to?.address || "", 50, contentTop + 32);

    // Due Date (right aligned)
    doc
        .fillColor(colors.gold)
        .fontSize(8)
        .font("Helvetica-Bold")
        .text("DUE DATE", 450, contentTop, { align: "right", width: 100 });

    doc
        .fillColor(colors.primary)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(invoice.dueDate, 450, contentTop + 15, { align: "right", width: 100 });

    // --- TABLE ---
    const tableTop = 220;

    // Table Header
    doc
        .strokeColor(colors.accent)
        .lineWidth(2)
        .moveTo(50, tableTop + 22)
        .lineTo(550, tableTop + 22)
        .stroke();

    doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(colors.gold)
        .text("SERVICE / DESCRIPTION", 50, tableTop)
        .text("QTY", 320, tableTop, { width: 60, align: "center" })
        .text("RATE", 390, tableTop, { width: 70, align: "right" })
        .text("AMOUNT", 470, tableTop, { width: 80, align: "right" });

    // Table Items
    let y = tableTop + 38;

    invoice.items.forEach((item: any) => {
        if (y + rowHeight > pageBottom) {
            doc.addPage();
            y = 50;
        }

        const lineTotal = item.quantity * item.price;

        doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor(colors.primary)
            .text(item.description, 50, y)
            .fillColor(colors.secondary)
            .text(String(item.quantity), 320, y, { width: 60, align: "center" })
            .text(`${item.price.toFixed(2)}`, 390, y, { width: 70, align: "right" })
            .fillColor(colors.primary)
            .font("Helvetica-Bold")
            .text(`${lineTotal.toFixed(2)}`, 470, y, { width: 80, align: "right" });

        // Subtle divider
        doc
            .strokeColor("#E2E8F0")
            .lineWidth(0.5)
            .moveTo(50, y + 20)
            .lineTo(550, y + 20)
            .stroke();

        y += rowHeight;
    });

    // --- TOTALS ---
    y += 30;

    doc.font("Helvetica").fontSize(10).fillColor(colors.secondary);
    doc.text("Subtotal", 400, y, { width: 70, align: "right" });
    doc.fillColor(colors.primary).text(`${invoice.subtotal.toFixed(2)}`, 480, y, { width: 70, align: "right" });

    y += 18;
    doc.fillColor(colors.secondary).text(`Tax (${(invoice.taxRate * 100).toFixed(0)}%)`, 400, y, { width: 70, align: "right" });
    doc.fillColor(colors.primary).text(`${invoice.tax.toFixed(2)}`, 480, y, { width: 70, align: "right" });

    y += 5;
    doc.strokeColor(colors.gold).lineWidth(1).moveTo(380, y + 8).lineTo(550, y + 8).stroke();

    y += 22;
    doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(colors.accent)
        .text("TOTAL DUE", 400, y, { width: 70, align: "right" })
        .fillColor(colors.gold)
        .text(`Rs.${invoice.total.toFixed(2)}`, 480, y, { width: 70, align: "right" });

    // --- DARK FOOTER ---
    doc.rect(0, doc.page.height - 60, doc.page.width, 60).fill(colors.accent);
    doc.rect(0, doc.page.height - 60, doc.page.width, 3).fill(colors.gold);

    doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#ffffff")
        .text("Thank you for your valued business", 0, doc.page.height - 40, { align: "center" });
}

export default { generate };
