import Anthropic from "@anthropic-ai/sdk";
import type { BaziResult, WuxingBalance } from "@/lib/bazi/types";
import {
  buildReadingSystemPrompt,
  buildReadingUserPrompt,
} from "@/lib/prompts/reading-prompt";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function generateReading(
  bazi: BaziResult,
  wuxing: WuxingBalance,
  birthYear: number,
  gender: "male" | "female"
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    system: buildReadingSystemPrompt(),
    messages: [
      {
        role: "user",
        content: buildReadingUserPrompt(bazi, wuxing, birthYear, gender),
      },
    ],
  });

  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

export async function* generateReadingStream(
  bazi: BaziResult,
  wuxing: WuxingBalance,
  birthYear: number,
  gender: "male" | "female"
): AsyncGenerator<string> {
  const stream = client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    system: buildReadingSystemPrompt(),
    messages: [
      {
        role: "user",
        content: buildReadingUserPrompt(bazi, wuxing, birthYear, gender),
      },
    ],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      yield chunk.delta.text;
    }
  }
}
