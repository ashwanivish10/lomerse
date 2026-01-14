/**
 * Main HTML Generator
 * Selects the appropriate template based on templateName
 */

import { InvoiceData, ThemeConfig } from "./baseTemplate.js";
import { generateClassicHtml } from "./classicTemplate.js";
import { generateModernHtml } from "./modernTemplate.js";
import { generateMinimalHtml } from "./minimalTemplate.js";
import { generateProfessionalHtml } from "./professionalTemplate.js";
import { generateExecutiveHtml } from "./executiveTemplate.js";
import { generateCreativeHtml } from "./creativeTemplate.js";

export type TemplateName =
    | "classic"
    | "modern"
    | "minimal"
    | "professional"
    | "executive"
    | "creative";

/**
 * Generate HTML for an invoice based on the template name
 */
export function generateInvoiceHtml(
    templateName: TemplateName | string,
    data: InvoiceData,
    theme: ThemeConfig = {}
): string {
    switch (templateName.toLowerCase()) {
        case "classic":
            return generateClassicHtml(data, theme);
        case "modern":
            return generateModernHtml(data, theme);
        case "minimal":
            return generateMinimalHtml(data, theme);
        case "professional":
            return generateProfessionalHtml(data, theme);
        case "executive":
            return generateExecutiveHtml(data, theme);
        case "creative":
            return generateCreativeHtml(data, theme);
        default:
            // Default to modern template
            console.warn(`Unknown template "${templateName}", falling back to modern`);
            return generateModernHtml(data, theme);
    }
}

// Re-export types for convenience
export type { InvoiceData, ThemeConfig };
