import Tesseract from "tesseract.js";

/**
 * Genuinely local OCR (Tesseract.js) — no vendor key required.
 * Shared by the Orchestrator's internal OCR pass (Section 09) and the
 * standalone developer product endpoint POST /v1/ocr (Section 10).
 */
export interface OcrResult {
  text: string;
}

export async function runOCR(imageDataUrl: string): Promise<OcrResult> {
  const { data } = await Tesseract.recognize(imageDataUrl, "eng");
  return { text: data.text.trim() };
}
