import { NextRequest, NextResponse } from "next/server";
import { generateReadingStream } from "@/lib/anthropic";
import type { BaziResult, WuxingBalance } from "@/lib/bazi/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const {
      bazi,
      wuxing,
      birthYear,
      gender,
    }: {
      bazi: BaziResult;
      wuxing: WuxingBalance;
      birthYear: number;
      gender: "male" | "female";
    } = await req.json();

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generateReadingStream(
            bazi,
            wuxing,
            birthYear,
            gender
          )) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (err) {
          console.error("[/api/reading stream]", err);
          const msg = err instanceof Error ? err.message : "ストリームエラー";
          controller.enqueue(encoder.encode(`\n\n[エラー: ${msg}]`));
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[/api/reading]", err);
    const message = err instanceof Error ? err.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
