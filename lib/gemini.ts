import { GoogleGenAI } from "@google/genai";
import type { BaziResult, WuxingBalance } from "@/lib/bazi/types";
import { buildImagePrompt } from "@/lib/prompts/image-prompt";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL = "gemini-2.0-flash-preview-image-generation";

export async function generateFortuneImage(
  bazi: BaziResult,
  wuxing: WuxingBalance
): Promise<string> {
  const prompt = buildImagePrompt(bazi, wuxing);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseModalities: ["IMAGE"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (
      part.inlineData?.data &&
      part.inlineData.mimeType?.startsWith("image/")
    ) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("画像生成に失敗しました: 画像パートが返されませんでした");
}
