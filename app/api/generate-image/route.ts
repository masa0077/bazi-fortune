import { NextRequest, NextResponse } from "next/server";
import { generateFortuneImage } from "@/lib/gemini";
import type { BaziResult, WuxingBalance } from "@/lib/bazi/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { bazi, wuxing }: { bazi: BaziResult; wuxing: WuxingBalance } =
      await req.json();

    const image = await generateFortuneImage(bazi, wuxing);
    return NextResponse.json({ image });
  } catch (err) {
    console.error("[/api/generate-image]", err);
    const message = err instanceof Error ? err.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
