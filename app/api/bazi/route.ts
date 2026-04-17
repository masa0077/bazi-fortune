import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateBazi } from "@/lib/bazi/calculate";
import { calcWuxingBalance } from "@/lib/bazi/wuxing";
import type { BaziApiResponse } from "@/lib/bazi/types";

export const runtime = "nodejs";

const schema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23).nullable(),
  minute: z.number().int().min(0).max(59),
  longitudeOffsetMinutes: z.number().int(),
  gender: z.enum(["male", "female"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力データが不正です: " + parsed.error.message },
        { status: 400 }
      );
    }

    const bazi = calculateBazi(parsed.data);
    const wuxing = calcWuxingBalance(bazi);

    const response: BaziApiResponse = { bazi, wuxing };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[/api/bazi]", err);
    return NextResponse.json(
      { error: "命式算出中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
