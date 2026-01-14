/**
 * Puppeteer Configuration
 * Production-safe configuration for different deployment environments
 */

import puppeteer, { Browser } from "puppeteer";

// Check if we're in a serverless environment (Vercel, AWS Lambda)
const isServerless = Boolean(
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL ||
    process.env.AWS_EXECUTION_ENV
);

/**
 * Get Puppeteer launch options based on environment
 */
export function getPuppeteerLaunchOptions(): Parameters<typeof puppeteer.launch>[0] {
    const baseArgs = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--font-render-hinting=none",
    ];

    if (isServerless) {
        // Serverless environment (Vercel, AWS Lambda)
        // Note: For Vercel, you may need to use @sparticuz/chromium
        return {
            headless: true,
            args: [
                ...baseArgs,
                "--single-process",
                "--disable-extensions",
            ],
        };
    }

    // Development or standard server environment (Render, Railway, local)
    return {
        headless: true,
        args: baseArgs,
    };
}

// Browser instance cache for reuse
let browserInstance: Browser | null = null;
let browserPromise: Promise<Browser> | null = null;

/**
 * Get or create a browser instance
 * Reuses existing browser for performance
 */
export async function getBrowser(): Promise<Browser> {
    // If browser exists and is connected, return it
    if (browserInstance && browserInstance.connected) {
        return browserInstance;
    }

    // If browser is being created, wait for it
    if (browserPromise) {
        return browserPromise;
    }

    // Create new browser
    browserPromise = (async () => {
        const options = getPuppeteerLaunchOptions();
        console.log("🚀 Launching Puppeteer with options:", JSON.stringify(options, null, 2));

        browserInstance = await puppeteer.launch(options);

        // Handle browser disconnect
        browserInstance.on("disconnected", () => {
            console.log("🔌 Puppeteer browser disconnected");
            browserInstance = null;
            browserPromise = null;
        });

        return browserInstance;
    })();

    return browserPromise;
}

/**
 * Close the browser instance
 * Call this when shutting down the server
 */
export async function closeBrowser(): Promise<void> {
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
        browserPromise = null;
        console.log("🔒 Puppeteer browser closed");
    }
}

// Graceful shutdown
process.on("SIGINT", closeBrowser);
process.on("SIGTERM", closeBrowser);
