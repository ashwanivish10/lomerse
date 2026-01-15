import PDFKit from "pdfkit";

/**
 * PROFESSIONAL TEMPLATE
 * Corporate formal style with blue accent bars
 * Uses: Header bar, alternating row colors, professional layout
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
        accent: safeTheme.accent || "#2563EB",
    };

    const pageBottom = doc.page.height - 80;
    const rowHeight = 28;

    // --- TOP ACCENT BAR ---
    doc.rect(0, 0, doc.page.width, 80).fill(colors.accent);

    // Company name on dark background
    doc
        .fillColor("#ffffff")
        .fontSize(24)
        .font("Helvetica-Bold")
        .text(invoice.from?.name || "Company Name", 50, 28)
        .fontSize(10)
        .font("Helvetica")
        .text(invoice.from?.email || "", 50, 55);

    // Invoice label
    doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("INVOICE", 450, 35, { align: "right", width: 100 })
        .fontSize(11)
        .font("Helvetica")
        .text(`#${String(invoice.invoiceNumber).padStart(5, "0")}`, 450, 52, { align: "right", width: 100 });

    // --- INFO SECTION ---
    const infoTop = 110;

    // Bill To Box
    doc.rect(50, infoTop, 240, 70).fill("#F8FAFC");
    doc
        .fillColor(colors.accent)
        .fontSize(8)
        .font("Helvetica-Bold")
        .text("BILL TO", 60, infoTop + 12);
    doc
        .fillColor(colors.primary)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(invoice.to?.name || "", 60, infoTop + 28)
        .fontSize(9)
        .font("Helvetica")
        .fillColor(colors.secondary)
        .text(invoice.to?.address || "", 60, infoTop + 44);

    // Details Box
    doc.rect(310, infoTop, 240, 70).fill("#F8FAFC");
    doc
        .fillColor(colors.accent)
        .fontSize(8)
        .font("Helvetica-Bold")
        .text("INVOICE DETAILS", 320, infoTop + 12);

    doc.font("Helvetica").fontSize(9).fillColor(colors.secondary);
    doc.text("Issue Date:", 320, infoTop + 28);
    doc.fillColor(colors.primary).text(invoice.invoiceDate, 390, infoTop + 28);
    doc.fillColor(colors.secondary).text("Due Date:", 320, infoTop + 42);
    doc.fillColor(colors.primary).text(invoice.dueDate, 390, infoTop + 42);
    doc.fillColor(colors.secondary).text("From:", 320, infoTop + 56);
    doc.fillColor(colors.primary).text(invoice.from?.address || "", 390, infoTop + 56);

    // --- TABLE HEADER ---
    const tableTop = 210;
    doc.rect(50, tableTop, 500, 28).fill(colors.accent);

    doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#ffffff")
        .text("DESCRIPTION", 60, tableTop + 9)
        .text("QTY", 340, tableTop + 9, { width: 50, align: "center" })
        .text("RATE", 400, tableTop + 9, { width: 70, align: "right" })
        .text("AMOUNT", 480, tableTop + 9, { width: 70, align: "right" });

    // --- ITEMS ---
    let y = tableTop + 38;
    let rowIndex = 0;

    // Helper function to draw table header
    const drawTableHeader = (yPos: number) => {
        doc.rect(50, yPos, 500, 28).fill(colors.accent);
        doc
            .font("Helvetica-Bold")
            .fontSize(9)
            .fillColor("#ffffff")
            .text("DESCRIPTION", 60, yPos + 9)
            .text("QTY", 340, yPos + 9, { width: 50, align: "center" })
            .text("RATE", 400, yPos + 9, { width: 70, align: "right" })
            .text("AMOUNT", 480, yPos + 9, { width: 70, align: "right" });
        return yPos + 38;
    };

    invoice.items.forEach((item: any, i: number) => {
        if (y + rowHeight > pageBottom) {
            doc.addPage();
            y = drawTableHeader(50);
            rowIndex = 0; // Reset for alternating colors on new page
        }

        const lineTotal = item.quantity * item.price;

        // Alternating row background
        if (rowIndex % 2 === 0) {
            doc.rect(50, y - 5, 500, rowHeight).fill("#F8FAFC");
        }

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

        y += rowHeight;
        rowIndex++;
    });

    // --- TOTALS ---
    y += 25;

    doc.font("Helvetica").fontSize(10).fillColor(colors.secondary);
    doc.text("Subtotal", 400, y, { width: 70, align: "right" });
    doc.fillColor(colors.primary).text(`${invoice.subtotal.toFixed(2)}`, 480, y, { width: 70, align: "right" });

    y += 18;
    doc.fillColor(colors.secondary).text(`Tax (${(invoice.taxRate * 100).toFixed(0)}%)`, 400, y, { width: 70, align: "right" });
    doc.fillColor(colors.primary).text(`${invoice.tax.toFixed(2)}`, 480, y, { width: 70, align: "right" });

    y += 25;
    doc.rect(380, y - 8, 170, 35).fill(colors.accent);
    doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#ffffff")
        .text("TOTAL DUE", 390, y + 2)
        .text(`Rs.${invoice.total.toFixed(2)}`, 480, y + 2, { width: 70, align: "right" });

    // --- BOTTOM BAR ---
    doc.rect(0, doc.page.height - 35, doc.page.width, 35).fill(colors.accent);
    doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#ffffff")
        .text("Thank you for your business!", 0, doc.page.height - 22, { align: "center" });
}

export default { generate };
