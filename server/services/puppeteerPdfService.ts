/**
 * Puppeteer PDF Generation Service
 * Generates PDFs that exactly match the browser preview
 */

import { getBrowser } from "./puppeteerConfig.js";
import { generateInvoiceHtml, InvoiceData, ThemeConfig } from "./htmlTemplates/generateHtml.js";

// PDF generation timeout (30 seconds)
const PDF_TIMEOUT = 30000;

export interface PdfGenerationOptions {
    templateName: string;
    data: InvoiceData;
    theme?: ThemeConfig;
}

export interface PdfGenerationResult {
    success: boolean;
    pdf?: Buffer;
    error?: string;
}

/**
 * Generate a PDF from invoice data using Puppeteer
 * Returns a Buffer containing the PDF data
 */
export async function generatePdfWithPuppeteer(
    options: PdfGenerationOptions
): Promise<PdfGenerationResult> {
    const { templateName, data, theme = {} } = options;

    let page = null;

    try {
        console.log(`📄 Starting PDF generation for template: ${templateName}`);
        const startTime = Date.now();

        // Generate HTML from template
        const html = generateInvoiceHtml(templateName, data, theme);

        // Get browser instance
        const browser = await getBrowser();

        // Create new page
        page = await browser.newPage();

        // Set viewport to A4 dimensions (in pixels at 96 DPI)
        await page.setViewport({
            width: 794,  // A4 width in pixels (210mm at 96 DPI)
            height: 1123, // A4 height in pixels (297mm at 96 DPI)
            deviceScaleFactor: 2, // Higher quality rendering
        });

        // Set content and wait for full render
        await page.setContent(html, {
            waitUntil: ["networkidle0", "domcontentloaded"],
            timeout: PDF_TIMEOUT,
        });

        // Wait a bit for fonts to load
        await page.evaluateHandle("document.fonts.ready");

        // Additional wait for any remaining async content
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate PDF with A4 size and proper margins
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true, // Important: preserves background colors and images
            margin: {
                top: "15mm",
                bottom: "15mm",
                left: "10mm",
                right: "10mm",
            },
            displayHeaderFooter: false,
            preferCSSPageSize: false,
        });

        const endTime = Date.now();
        console.log(`✅ PDF generated successfully in ${endTime - startTime}ms`);

        return {
            success: true,
            pdf: Buffer.from(pdf),
        };
    } catch (error: any) {
        console.error("❌ PDF generation failed:", error);
        return {
            success: false,
            error: error.message || "Unknown error during PDF generation",
        };
    } finally {
        // Always close the page to free resources
        if (page) {
            try {
                await page.close();
            } catch (closeError) {
                console.error("Error closing page:", closeError);
            }
        }
    }
}

/**
 * Generate PDF with retry logic
 */
export async function generatePdfWithRetry(
    options: PdfGenerationOptions,
    maxRetries: number = 2
): Promise<PdfGenerationResult> {
    let lastError: string = "";

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const result = await generatePdfWithPuppeteer(options);

        if (result.success) {
            return result;
        }

        lastError = result.error || "Unknown error";
        console.warn(`PDF generation attempt ${attempt} failed: ${lastError}`);

        // Wait before retry
        if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }

    return {
        success: false,
        error: `PDF generation failed after ${maxRetries} attempts: ${lastError}`,
    };
}
