import { STEM_TO_WUXING, getDominantWuxing } from "@/lib/bazi/wuxing";
import type { BaziResult, WuxingBalance, Wuxing } from "@/lib/bazi/types";

const SYMBOL_BY_ELEMENT: Record<Wuxing, string> = {
  木: "ancient towering tree with fresh green leaves, growing bamboo grove, spring breeze and morning mist",
  火: "phoenix rising from crimson flames, blazing vermilion sun, sacred fire ritual",
  土: "golden mountain peak at sunset, fertile earth, ancient clay vessel, sacred stones and crystals",
  金: "silver crescent moon over autumn landscape, polished white tiger, chrysanthemum in moonlight",
  水: "flowing mountain river merging into deep indigo ocean, black tortoise and serpent, winter full moon",
};

const SEASON_BY_ELEMENT: Record<Wuxing, string> = {
  木: "spring",
  火: "summer",
  土: "late summer / transitional season",
  金: "autumn",
  水: "winter",
};

export function buildImagePrompt(bazi: BaziResult, wuxing: WuxingBalance): string {
  const dayElement = STEM_TO_WUXING[bazi.dayMaster] ?? "木";
  const dominantElement = getDominantWuxing(wuxing);

  const centralSymbol = SYMBOL_BY_ELEMENT[dayElement];
  const season = SEASON_BY_ELEMENT[dominantElement];

  return `
A symbolic fortune illustration in Japanese traditional painting style (日本画 nihonga),
with mystical and auspicious atmosphere.

Central theme: ${centralSymbol}.
Season / atmosphere: ${season}, serene and timeless.
Supporting element: ${SYMBOL_BY_ELEMENT[dominantElement]}.

Five Elements color palette strictly applied:
- Wood (木): deep forest green, jade
- Fire (火): vermilion red, golden orange
- Earth (土): ochre yellow, terracotta
- Metal (金): white, silver, pale gold
- Water (水): indigo blue, ink black, deep violet

Art style: ukiyo-e woodblock print meets contemporary digital nihonga painting.
Elegant brush ink lines, soft gradient color washes (bokashi), gold leaf accents (金箔),
subtle wisps of mist, delicate cloud borders, cinematic lighting from one side.
Composition: centered symbolic motif, ornate decorative border, auspicious and calm.

CRITICAL REQUIREMENTS:
- NO text, no letters, no numbers, no characters anywhere in the image
- NO human figures
- Portrait orientation 3:4
- Ultra-detailed, high quality
`.trim();
}
