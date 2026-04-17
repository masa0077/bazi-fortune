// 五行
export type Wuxing = "木" | "火" | "土" | "金" | "水";

// 一柱(天干 + 地支)
export interface Pillar {
  stem: string;   // 天干
  branch: string; // 地支
}

// 蔵干(地支に隠れた天干)
export interface HiddenStems {
  year: string[];
  month: string[];
  day: string[];
  hour: string[];
}

// 十神
export interface TenGods {
  year: string;
  month: string;
  hour: string;
}

// 命式算出結果
export interface BaziResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null; // 時刻不明なら null
  hiddenStems: HiddenStems;
  tenGods: TenGods;
  dayMaster: string; // 日干(命主)
  bodyStrength: "身強" | "中和" | "身弱";
}

// 五行バランス
export type WuxingBalance = Record<Wuxing, number>;

// フォーム入力
export interface BaziInput {
  year: number;
  month: number;
  day: number;
  hour: number | null;   // null = 時刻不明
  minute: number;
  longitudeOffsetMinutes: number;
  gender: "male" | "female";
}

// API レスポンス
export interface BaziApiResponse {
  bazi: BaziResult;
  wuxing: WuxingBalance;
}

// 都市プリセット
export interface CityPreset {
  name: string;
  longitude: number; // 東経(度)
  offsetMinutes: number; // JST(135°)との差 × 4
}
