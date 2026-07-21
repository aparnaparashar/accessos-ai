import Tesseract from "tesseract.js";

export interface OcrResult {
  text: string;
  confidence: number;
  engine?: string;
}

/**
 * Optical Character Recognition (OCR) Service.
 * Attempts local Tesseract.js recognition with automatic Vision AI fallback
 * if worker threads fail or time out in the server environment.
 */
export async function runOCR(imageInput: string): Promise<OcrResult> {
  let source: string | Buffer = imageInput;

  // Fetch remote image if HTTP(S) URL
  if (imageInput.startsWith("http://") || imageInput.startsWith("https://")) {
    try {
      let targetUrl = imageInput;
      let res = await fetch(targetUrl);
      if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("text/html")) {
        const htmlText = await res.text();
        const ogMatch = htmlText.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                        htmlText.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (ogMatch && ogMatch[1]) {
          targetUrl = ogMatch[1];
          res = await fetch(targetUrl);
          if (!res.ok) throw new Error(`Failed to fetch image asset: ${res.status}`);
        }
      }
      const buf = await res.arrayBuffer();
      source = Buffer.from(buf);
    } catch (err) {
      throw new Error(`Could not load image URL: ${(err as Error).message}`);
    }
  }

  // 1. Try Tesseract.js with worker error handling
  try {
    const { data } = await Tesseract.recognize(source as string, "eng", {
      logger: () => {},
    });
    if (data && typeof data.text === "string") {
      return {
        text: data.text.trim(),
        confidence: Math.round((data.confidence ?? 0) * 10) / 10,
        engine: "tesseract",
      };
    }
  } catch (err) {
    console.warn("Tesseract worker notice (falling back to Vision OCR):", (err as Error).message);
  }

  // 2. Fallback to AI Vision OCR (OpenAI / Gemini) if available
  try {
    const { runVisionDescribe } = await import("./orchestrator");
    const result = await runVisionDescribe(imageInput, false);
    if (!("error" in result)) {
      return {
        text: result.description,
        confidence: 95.0,
        engine: `vision-ai-${result.provider}`,
      };
    }
  } catch {
    // Ignore fallback failure
  }

  return {
    text: "Unable to extract text from image.",
    confidence: 0,
    engine: "none",
  };
}
