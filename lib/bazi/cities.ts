import type { CityPreset } from "./types";

/**
 * 主要都市プリセット
 * offsetMinutes = (longitude - 135) × 4
 */
export const CITY_PRESETS: CityPreset[] = [
  { name: "東京",   longitude: 139.7, offsetMinutes: Math.round((139.7 - 135) * 4) },
  { name: "大阪",   longitude: 135.5, offsetMinutes: Math.round((135.5 - 135) * 4) },
  { name: "札幌",   longitude: 141.3, offsetMinutes: Math.round((141.3 - 135) * 4) },
  { name: "福岡",   longitude: 130.4, offsetMinutes: Math.round((130.4 - 135) * 4) },
  { name: "那覇",   longitude: 127.7, offsetMinutes: Math.round((127.7 - 135) * 4) },
  { name: "ソウル", longitude: 126.9, offsetMinutes: Math.round((126.9 - 135) * 4) },
  { name: "北京",   longitude: 116.4, offsetMinutes: Math.round((116.4 - 135) * 4) },
  { name: "上海",   longitude: 121.5, offsetMinutes: Math.round((121.5 - 135) * 4) },
  { name: "台北",   longitude: 121.5, offsetMinutes: Math.round((121.5 - 135) * 4) },
  { name: "ニューヨーク", longitude: -74.0, offsetMinutes: Math.round((-74.0 - 135) * 4) },
  { name: "ロンドン",    longitude: -0.1,  offsetMinutes: Math.round((-0.1 - 135) * 4) },
  { name: "パリ",        longitude: 2.35,  offsetMinutes: Math.round((2.35 - 135) * 4) },
  { name: "カスタム",    longitude: 135.0, offsetMinutes: 0 },
];
