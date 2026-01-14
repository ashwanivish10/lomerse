import express, { Router, Request, Response } from "express";
import { generatePdf } from "../services/pdfGenerator";
import { generatePdfWithRetry } from "../services/puppeteerPdfService.js";
import { User } from "../models/User";

const router: Router = express.Router();

// List of premium template IDs that require subscription or credits
const PREMIUM_TEMPLATES = ["executive", "creative"];

/**
 * Helper function to check premium template access
 */
async function checkPremiumAccess(
  req: Request,
  res: Response,
  templateName: string
): Promise<boolean> {
  const isPremiumTemplate = PREMIUM_TEMPLATES.includes(templateName);

  if (!isPremiumTemplate) {
    return true; // Non-premium templates are always accessible
  }

  // Check if user is authenticated
  const user = req.user as any;
  if (!user) {
    res.status(401).json({ message: "Authentication required for premium templates." });
    return false;
  }

  const isSubscribed = user.subscriptionStatus === "active";
  const hasCredits = (user.invoiceCredits || 0) > 0;

  // User must have subscription OR credits to use premium templates
  if (!isSubscribed && !hasCredits) {
    res.status(403).json({
      message: "Premium template requires subscription or invoice credits.",
      requiresUpgrade: true
    });
    return false;
  }

  // If user has credits but no subscription, deduct 1 credit
  if (!isSubscribed && hasCredits) {
    await User.findByIdAndUpdate(user._id, {
      $inc: { invoiceCredits: -1 }
    });
    console.log(`💳 Deducted 1 credit from user ${user.email}. Remaining: ${user.invoiceCredits - 1}`);
  }

  return true;
}

// POST /api/invoice/generate (Original PDFKit-based endpoint)
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { templateName, theme, data } = req.body;

    console.log("🔥 RECEIVED BODY → ", req.body);

    if (!data) {
      throw new Error("Missing invoice 'data' field from client.");
    }

    // Check premium access
    const hasAccess = await checkPremiumAccess(req, res, templateName);
    if (!hasAccess) return;

    // Final payload used by PDF generator
    const finalInvoiceData = {
      templateName,
      theme,
      data,
    };

    const filename = `invoice-${data.invoiceNumber || "new"}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    // generatePdf(doc, invoiceData)
    generatePdf(finalInvoiceData, res);
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).send({ message: (err as Error).message });
  }
});

/**
 * POST /api/invoice/generate-puppeteer
 * 
 * Generates PDF using Puppeteer (headless Chrome) for pixel-perfect output
 * that exactly matches the browser preview.
 * 
 * Features:
 * - Exact match with browser invoice preview
 * - Proper font rendering (Inter via Google Fonts)
 * - Background colors and gradients preserved
 * - A4 page size with proper margins
 * - Page break handling for long item lists
 */
router.post("/generate-puppeteer", async (req: Request, res: Response) => {
  try {
    const { templateName, theme, data } = req.body;

    console.log("🎨 Puppeteer PDF Request:", { templateName, theme: theme?.name });

    // Validate request
    if (!data) {
      return res.status(400).json({ message: "Missing invoice 'data' field." });
    }

    if (!templateName) {
      return res.status(400).json({ message: "Missing 'templateName' field." });
    }

    // Check premium access
    const hasAccess = await checkPremiumAccess(req, res, templateName);
    if (!hasAccess) return;

    // Convert theme to ThemeConfig format
    const themeConfig = {
      accentColor: theme?.accent || theme?.primary || "#6366F1",
      primary: theme?.primary || "#1E293B",
      secondary: theme?.secondary || "#6B7280",
      borderAccent: theme?.accent || "#6366F1",
      bgAccent: (theme?.accent || "#6366F1") + "20",
    };

    // Generate PDF using Puppeteer with retry logic
    const result = await generatePdfWithRetry({
      templateName,
      data,
      theme: themeConfig,
    }, 2);

    if (!result.success || !result.pdf) {
      console.error("❌ Puppeteer PDF generation failed:", result.error);
      return res.status(500).json({
        message: "PDF generation failed",
        error: result.error
      });
    }

    // Set response headers
    const filename = `invoice-${data.invoiceNumber || "new"}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", result.pdf.length);

    // Send PDF buffer
    res.send(result.pdf);

  } catch (err: any) {
    console.error("❌ Puppeteer PDF Error:", err);
    res.status(500).json({
      message: "PDF generation failed",
      error: err.message || "Unknown error"
    });
  }
});

export default router;


