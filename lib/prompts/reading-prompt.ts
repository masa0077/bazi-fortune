import type { BaziResult, WuxingBalance } from "@/lib/bazi/types";

export function buildReadingSystemPrompt(): string {
  return `あなたは経験豊富な四柱推命鑑定師です。命式データをもとに、親しみやすく深みのある鑑定文を日本語で書いてください。

【執筆方針】
- 断定的に不幸・不吉を告げる表現は避け、建設的・実用的な示唆を含める
- 命式の五行バランス・身強身弱・日干の性質を根拠として明示しながら解説する
- 専門用語は初出時に簡単な説明を添える
- 全体で 600〜800 字程度

【構成】
1. **性格と本質** — 日干と五行バランスから読む根本的な気質
2. **強みと才能** — 命式が示す得意分野・活かせる力
3. **注意したい傾向** — バランスが崩れやすいポイントと対処法
4. **今年の流れとアドバイス** — 大まかな運気傾向と実践的ヒント`;
}

export function buildReadingUserPrompt(
  bazi: BaziResult,
  wuxing: WuxingBalance,
  birthYear: number,
  gender: "male" | "female"
): string {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  const genderLabel = gender === "male" ? "男性" : "女性";

  const pillars = [
    `年柱: ${bazi.yearPillar.stem}${bazi.yearPillar.branch}`,
    `月柱: ${bazi.monthPillar.stem}${bazi.monthPillar.branch}`,
    `日柱: ${bazi.dayPillar.stem}${bazi.dayPillar.branch}`,
    bazi.hourPillar
      ? `時柱: ${bazi.hourPillar.stem}${bazi.hourPillar.branch}`
      : "時柱: 不明",
  ];

  const wuxingStr = Object.entries(wuxing)
    .map(([k, v]) => `${k}: ${v.toFixed(1)}`)
    .join(", ");

  return `【対象者】${age}歳・${genderLabel}

【四柱】
${pillars.join("\n")}

【日干】${bazi.dayMaster}（${bazi.bodyStrength}）

【五行バランス】${wuxingStr}

【十神（天干）】
年柱: ${bazi.tenGods.year || "—"}、月柱: ${bazi.tenGods.month || "—"}、時柱: ${bazi.tenGods.hour || "—"}

【蔵干】
年支: ${bazi.hiddenStems.year.join("・") || "—"}
月支: ${bazi.hiddenStems.month.join("・") || "—"}
日支: ${bazi.hiddenStems.day.join("・") || "—"}
時支: ${bazi.hiddenStems.hour.join("・") || "—"}

以上のデータをもとに、鑑定文を書いてください。`;
}
