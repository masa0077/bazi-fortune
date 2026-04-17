import { describe, it, expect } from "vitest";
import { calculateBazi } from "../calculate";
import { calcWuxingBalance } from "../wuxing";

/**
 * 1990-05-15 14:30 東京(+19分補正) のテスト
 *
 * lunar-javascript の出力に従う。
 * 期待値: 庚午年・辛巳月・己亥日・辛未時 (参考値)
 * ※ 節入り時刻の精度により月柱は壬午になる場合もある。
 *    ライブラリ出力を正とする。
 */
describe("calculateBazi", () => {
  it("1990-05-15 14:30 東京 で四柱を返す", () => {
    const result = calculateBazi({
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      minute: 30,
      longitudeOffsetMinutes: 19, // 東京: (139.7-135)*4 ≈ 19分
      gender: "male",
    });

    console.log("=== 命式 ===");
    console.log("年柱:", result.yearPillar);
    console.log("月柱:", result.monthPillar);
    console.log("日柱:", result.dayPillar);
    console.log("時柱:", result.hourPillar);
    console.log("日干:", result.dayMaster);
    console.log("身強身弱:", result.bodyStrength);

    const wuxing = calcWuxingBalance(result);
    console.log("五行バランス:", wuxing);

    // 基本的な構造チェック
    expect(result.yearPillar.stem).toBeTruthy();
    expect(result.yearPillar.branch).toBeTruthy();
    expect(result.monthPillar.stem).toBeTruthy();
    expect(result.dayPillar.stem).toBeTruthy();
    expect(result.hourPillar).not.toBeNull();
    expect(result.dayMaster).toBeTruthy();

    // 1990年は庚午年
    expect(result.yearPillar.stem).toBe("庚");
    expect(result.yearPillar.branch).toBe("午");

    // 1990-05-15 は立夏(5月6日頃)を過ぎているので巳月
    expect(result.monthPillar.branch).toBe("巳");
  });

  it("時刻不明の場合、hourPillar が null になる", () => {
    const result = calculateBazi({
      year: 1990,
      month: 5,
      day: 15,
      hour: null,
      minute: 0,
      longitudeOffsetMinutes: 0,
      gender: "female",
    });
    expect(result.hourPillar).toBeNull();
    expect(result.hiddenStems.hour).toEqual([]);
  });

  it("五行バランスが 5 種すべて含む", () => {
    const result = calculateBazi({
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      minute: 30,
      longitudeOffsetMinutes: 19,
      gender: "male",
    });
    const wuxing = calcWuxingBalance(result);
    expect(Object.keys(wuxing)).toEqual(["木", "火", "土", "金", "水"]);
    const total = Object.values(wuxing).reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThan(0);
  });
});
