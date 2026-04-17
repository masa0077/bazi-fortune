// lunar-javascript は CommonJS モジュール
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Solar } = require("lunar-javascript") as {
  Solar: {
    fromYmdHms: (
      y: number, m: number, d: number,
      h: number, min: number, s: number
    ) => {
      getLunar: () => {
        getEightChar: () => EightChar;
      };
    };
  };
};

interface EightChar {
  getYear(): string;
  getYearZhi(): string;
  getMonth(): string;
  getMonthZhi(): string;
  getDay(): string;
  getDayZhi(): string;
  getTime(): string;
  getTimeZhi(): string;
  getYearHideGan(): string[];
  getMonthHideGan(): string[];
  getDayHideGan(): string[];
  getTimeHideGan(): string[];
  getYearShiShenGan(): string;
  getMonthShiShenGan(): string;
  getTimeShiShenGan(): string;
  getDayGan(): string;
}

import { calcBodyStrength } from "./wuxing";
import { calcWuxingBalance } from "./wuxing";
import type { BaziInput, BaziResult, Pillar } from "./types";

export function calculateBazi(input: BaziInput): BaziResult {
  const offset = input.longitudeOffsetMinutes ?? 0;

  // 時刻不明の場合は正午(12:00)で仮算出
  const baseHour = input.hour ?? 12;
  const baseMinute = input.hour !== null ? input.minute : 0;

  // 真太陽時補正: 分単位で加算
  const totalMinutes = baseHour * 60 + baseMinute + offset;
  const correctedHour = Math.floor(totalMinutes / 60) % 24;
  const correctedMinute = ((totalMinutes % 60) + 60) % 60;

  const solar = Solar.fromYmdHms(
    input.year,
    input.month,
    input.day,
    correctedHour,
    correctedMinute,
    0
  );
  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();

  const hourPillar: Pillar | null = input.hour !== null
    ? { stem: bazi.getTime(), branch: bazi.getTimeZhi() }
    : null;

  const result: BaziResult = {
    yearPillar:  { stem: bazi.getYear(),  branch: bazi.getYearZhi() },
    monthPillar: { stem: bazi.getMonth(), branch: bazi.getMonthZhi() },
    dayPillar:   { stem: bazi.getDay(),   branch: bazi.getDayZhi() },
    hourPillar,
    hiddenStems: {
      year:  bazi.getYearHideGan(),
      month: bazi.getMonthHideGan(),
      day:   bazi.getDayHideGan(),
      hour:  input.hour !== null ? bazi.getTimeHideGan() : [],
    },
    tenGods: {
      year:  bazi.getYearShiShenGan(),
      month: bazi.getMonthShiShenGan(),
      hour:  input.hour !== null ? bazi.getTimeShiShenGan() : "",
    },
    dayMaster: bazi.getDayGan(),
    bodyStrength: "中和", // 後で上書き
  };

  const wuxing = calcWuxingBalance(result);
  result.bodyStrength = calcBodyStrength(result.dayMaster, wuxing);

  return result;
}
