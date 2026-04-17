import type { BaziResult, Wuxing, WuxingBalance } from "./types";

export const STEM_TO_WUXING: Record<string, Wuxing> = {
  甲: "木", 乙: "木",
  丙: "火", 丁: "火",
  戊: "土", 己: "土",
  庚: "金", 辛: "金",
  壬: "水", 癸: "水",
};

export const BRANCH_TO_WUXING: Record<string, Wuxing> = {
  寅: "木", 卯: "木",
  巳: "火", 午: "火",
  辰: "土", 戌: "土", 丑: "土", 未: "土",
  申: "金", 酉: "金",
  亥: "水", 子: "水",
};

// 五行の相生: key が生じる先
export const WUXING_GENERATES: Record<Wuxing, Wuxing> = {
  木: "火", 火: "土", 土: "金", 金: "水", 水: "木",
};

// 五行の相剋: key が剋す先
export const WUXING_CONTROLS: Record<Wuxing, Wuxing> = {
  木: "土", 火: "金", 土: "水", 金: "木", 水: "火",
};

const WUXING_LIST: Wuxing[] = ["木", "火", "土", "金", "水"];

function emptyBalance(): WuxingBalance {
  return { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
}

function addWuxing(balance: WuxingBalance, element: Wuxing | undefined, weight: number) {
  if (element) balance[element] += weight;
}

export function calcWuxingBalance(bazi: BaziResult): WuxingBalance {
  const balance = emptyBalance();

  // 天干(重み 1.0)
  const stems = [
    bazi.yearPillar.stem,
    bazi.monthPillar.stem,
    bazi.dayPillar.stem,
    ...(bazi.hourPillar ? [bazi.hourPillar.stem] : []),
  ];
  for (const stem of stems) {
    addWuxing(balance, STEM_TO_WUXING[stem], 1.0);
  }

  // 地支(重み 0.6、蔵干に含むため地支本体は軽め)
  const branches = [
    bazi.yearPillar.branch,
    bazi.monthPillar.branch,
    bazi.dayPillar.branch,
    ...(bazi.hourPillar ? [bazi.hourPillar.branch] : []),
  ];
  for (const branch of branches) {
    addWuxing(balance, BRANCH_TO_WUXING[branch], 0.6);
  }

  // 蔵干(本気 = 0.7、中気 = 0.3、余気 = 0.2)
  const hiddenWeights = [0.7, 0.3, 0.2];
  const hiddenGroups = [
    bazi.hiddenStems.year,
    bazi.hiddenStems.month,
    bazi.hiddenStems.day,
    bazi.hiddenStems.hour,
  ];
  for (const group of hiddenGroups) {
    group.forEach((stem, i) => {
      const w = hiddenWeights[i] ?? 0.1;
      addWuxing(balance, STEM_TO_WUXING[stem], w);
    });
  }

  return balance;
}

export function getDominantWuxing(balance: WuxingBalance): Wuxing {
  return WUXING_LIST.reduce((a, b) => (balance[a] >= balance[b] ? a : b));
}

/**
 * 身強身弱の簡易判定
 * 日干の五行 + 日干を生じる五行 → 同根スコア
 * 日干を剋す五行 + 日干が生じる五行(泄) → 逆スコア
 */
export function calcBodyStrength(
  dayMaster: string,
  wuxing: WuxingBalance
): "身強" | "中和" | "身弱" {
  const dayElement = STEM_TO_WUXING[dayMaster];
  if (!dayElement) return "中和";

  // 日干を生じる五行 (母)
  const motherElement = Object.keys(WUXING_GENERATES).find(
    (k) => WUXING_GENERATES[k as Wuxing] === dayElement
  ) as Wuxing | undefined;

  // 日干が生じる五行 (子, 泄气)
  const childElement = WUXING_GENERATES[dayElement];

  // 日干を剋す五行 (官)
  const controllerElement = Object.keys(WUXING_CONTROLS).find(
    (k) => WUXING_CONTROLS[k as Wuxing] === dayElement
  ) as Wuxing | undefined;

  // 日干が剋す五行 (财)
  const controlledElement = WUXING_CONTROLS[dayElement];

  const supportScore =
    wuxing[dayElement] +
    (motherElement ? wuxing[motherElement] : 0);

  const weakenScore =
    (controllerElement ? wuxing[controllerElement] : 0) +
    wuxing[childElement] +
    wuxing[controlledElement];

  const ratio = supportScore / (supportScore + weakenScore + 0.001);

  if (ratio >= 0.55) return "身強";
  if (ratio <= 0.40) return "身弱";
  return "中和";
}
