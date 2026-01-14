import PDFDocument from "pdfkit";
import classicTemplate from "./templates/classicTemplate.js";
import modernTemplate from "./templates/modernTemplate.js";
import professionalTemplate from "./templates/professionalTemplate.js";
import executiveTemplate from "./templates/executiveTemplate.js";
import creativeTemplate from "./templates/creativeTemplate.js";
import minimalTemplate from "./templates/minimalTemplate.js";

export function generatePdf(body, res) {
  const { templateName, theme, data } = body;

  console.log("🔥 Template:", templateName);
  console.log("🔥 Theme:", theme);
  console.log("🔥 Data:", data);

  if (!data) {
    throw new Error("Missing invoice 'data' field");
  }

  const doc = new PDFDocument();
  doc.pipe(res);

  if (templateName === "classic") {
    classicTemplate.generate(doc, data, theme);
  } else if (templateName === "modern") {
    modernTemplate.generate(doc, data, theme);
  } else if (templateName === "professional") {
    professionalTemplate.generate(doc, data, theme);
  } else if (templateName === "executive") {
    executiveTemplate.generate(doc, data, theme);
  } else if (templateName === "creative") {
    creativeTemplate.generate(doc, data, theme);
  } else if (templateName === "minimal") {
    minimalTemplate.generate(doc, data, theme);
  } else {
    // Default to modern if unknown
    modernTemplate.generate(doc, data, theme);
  }

  doc.end();
}
