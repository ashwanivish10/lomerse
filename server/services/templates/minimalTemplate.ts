import PDFKit from "pdfkit";

/**
 * MINIMAL TEMPLATE
 * Ultra-clean design with lots of whitespace
 * Uses: Simple lines, minimal colors, elegant typography
 */
export function generate(
    doc: PDFKit.PDFDocument,
    invoice: any,
    theme: any
): void {
    const safeTheme = theme || {};
    const colors = {
        primary: "#111827",
        secondary: "#9CA3AF",
        accent: safeTheme.accent || "#111827",
    };

    const pageBottom = doc.page.height - 80;
    const rowHeight = 28;

    // --- HEADER ---
    doc
        .fillColor(colors.primary)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(invoice.from?.name || "Company", 50, 50);

    doc
        .fontSize(36)
        .font("Helvetica")
        .fillColor(colors.secondary)
        .text("Invoice", 400, 42, { align: "right", width: 150 });

    // Thin line under header
    doc
        .strokeColor("#E5E7EB")
        .lineWidth(1)
        .moveTo(50, 90)
        .lineTo(550, 90)
        .stroke();

    // --- INFO GRID ---
    const infoTop = 115;

    // Column 1 - From
    doc
        .fillColor(colors.secondary)
        .fontSize(8)
        .font("Helvetica")
        .text("From", 50, infoTop);
    doc
        .fillColor(colors.primary)
        .fontSize(9)
        .text(invoice.from?.name || "", 50, infoTop + 14)
        .fillColor(colors.secondary)
        .text(invoice.from?.address || "", 50, infoTop + 26)
        .text(invoice.from?.email || "", 50, infoTop + 38);

    // Column 2 - Bill To
    doc
        .fillColor(colors.secondary)
        .fontSize(8)
        .text("Bill To", 200, infoTop);
    doc
        .fillColor(colors.primary)
        .fontSize(9)
        .text(invoice.to?.name || "", 200, infoTop + 14)
        .fillColor(colors.secondary)
        .text(invoice.to?.address || "", 200, infoTop + 26);

    // Column 3 - Invoice Details (right aligned)
    doc
        .fillColor(colors.secondary)
        .fontSize(8)
        .text("Invoice No.", 450, infoTop, { align: "right", width: 100 });
    doc
        .fillColor(colors.primary)
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(String(invoice.invoiceNumber).padStart(5, "0"), 450, infoTop + 14, { align: "right", width: 100 });

    doc
        .font("Helvetica")
        .fillColor(colors.secondary)
        .fontSize(8)
        .text("Date", 450, infoTop + 32, { align: "right", width: 100 });
    doc
        .fillColor(colors.primary)
        .fontSize(9)
        .text(invoice.invoiceDate, 450, infoTop + 44, { align: "right", width: 100 });

    doc
        .fillColor(colors.secondary)
        .fontSize(8)
        .text("Due Date", 450, infoTop + 60, { align: "right", width: 100 });
    doc
        .fillColor(colors.primary)
        .fontSize(9)
        .text(invoice.dueDate, 450, infoTop + 72, { align: "right", width: 100 });

    // --- TABLE HEADER ---
    const tableTop = 220;

    doc
        .strokeColor(colors.primary)
        .lineWidth(2)
        .moveTo(50, tableTop + 18)
        .lineTo(550, tableTop + 18)
        .stroke();

    doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(colors.secondary)
        .text("DESCRIPTION", 50, tableTop)
        .text("QTY", 340, tableTop, { width: 50, align: "center" })
        .text("RATE", 400, tableTop, { width: 70, align: "right" })
        .text("AMOUNT", 480, tableTop, { width: 70, align: "right" });

    // --- ITEMS ---
    let y = tableTop + 32;

    // Helper function to draw table header on new pages
    const drawTableHeader = (yPos: number) => {
        doc
            .strokeColor(colors.primary)
            .lineWidth(2)
            .moveTo(50, yPos + 18)
            .lineTo(550, yPos + 18)
            .stroke();

        doc
            .font("Helvetica-Bold")
            .fontSize(8)
            .fillColor(colors.secondary)
            .text("DESCRIPTION", 50, yPos)
            .text("QTY", 340, yPos, { width: 50, align: "center" })
            .text("RATE", 400, yPos, { width: 70, align: "right" })
            .text("AMOUNT", 480, yPos, { width: 70, align: "right" });
        return yPos + 32;
    };

    invoice.items.forEach((item: any) => {
        if (y + rowHeight > pageBottom) {
            doc.addPage();
            y = drawTableHeader(50);
        }

        const lineTotal = item.quantity * item.price;

        doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor(colors.primary)
            .text(item.description, 50, y)
            .fillColor(colors.secondary)
            .text(String(item.quantity), 340, y, { width: 50, align: "center" })
            .text(`${item.price.toFixed(2)}`, 400, y, { width: 70, align: "right" })
            .fillColor(colors.primary)
            .text(`${lineTotal.toFixed(2)}`, 480, y, { width: 70, align: "right" });

        // Light divider
        doc
            .strokeColor("#F3F4F6")
            .lineWidth(0.5)
            .moveTo(50, y + 18)
            .lineTo(550, y + 18)
            .stroke();

        y += rowHeight;
    });

    // --- TOTALS ---
    y += 30;

    // Thin line above totals
    doc
        .strokeColor(colors.primary)
        .lineWidth(1)
        .moveTo(380, y - 10)
        .lineTo(550, y - 10)
        .stroke();

    doc.font("Helvetica").fontSize(10).fillColor(colors.secondary);
    doc.text("Subtotal", 380, y);
    doc.fillColor(colors.primary).text(`${invoice.subtotal.toFixed(2)}`, 480, y, { width: 70, align: "right" });

    y += 18;
    doc.fillColor(colors.secondary).text(`Tax`, 380, y);
    doc.fillColor(colors.primary).text(`${invoice.tax.toFixed(2)}`, 480, y, { width: 70, align: "right" });

    y += 25;
    doc
        .strokeColor(colors.primary)
        .lineWidth(2)
        .moveTo(380, y - 5)
        .lineTo(550, y - 5)
        .stroke();

    doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(colors.primary)
        .text("Total", 380, y + 5)
        .text(`Rs.${invoice.total.toFixed(2)}`, 480, y + 5, { width: 70, align: "right" });

    // --- FOOTER ---
    doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(colors.secondary)
        .text("Thank you.", 50, doc.page.height - 50);
}

export default { generate };
