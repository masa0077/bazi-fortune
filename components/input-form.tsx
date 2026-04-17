"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITY_PRESETS } from "@/lib/bazi/cities";

export default function InputForm() {
  const router = useRouter();

  const [year, setYear] = useState("1990");
  const [month, setMonth] = useState("5");
  const [day, setDay] = useState("15");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [hour, setHour] = useState("14");
  const [minute, setMinute] = useState("30");
  const [cityIndex, setCityIndex] = useState(0); // 東京
  const [customOffset, setCustomOffset] = useState("0");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [error, setError] = useState("");

  const selectedCity = CITY_PRESETS[cityIndex];
  const isCustom = selectedCity.name === "カスタム";
  const offsetMinutes = isCustom
    ? parseInt(customOffset, 10) || 0
    : selectedCity.offsetMinutes;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const y = parseInt(year, 10);
    const mo = parseInt(month, 10);
    const d = parseInt(day, 10);

    if (!y || !mo || !d || y < 1900 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) {
      setError("正しい生年月日を入力してください。");
      return;
    }

    const params = new URLSearchParams({
      year: String(y),
      month: String(mo),
      day: String(d),
      hour: timeUnknown ? "" : hour,
      minute: timeUnknown ? "0" : minute,
      offset: String(offsetMinutes),
      gender,
    });
    router.push(`/result?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white/70 border border-amber-200/60 rounded-2xl shadow-sm p-6 flex flex-col gap-5"
    >
      {/* 生年月日 */}
      <fieldset>
        <legend className="text-sm font-semibold text-stone-600 mb-2 tracking-wide">
          生年月日 <span className="text-red-500">*</span>
        </legend>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="年"
            min="1900"
            max="2100"
            required
            className="w-24 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <span className="text-stone-500 text-sm">年</span>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="月"
            min="1"
            max="12"
            required
            className="w-16 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <span className="text-stone-500 text-sm">月</span>
          <input
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="日"
            min="1"
            max="31"
            required
            className="w-16 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <span className="text-stone-500 text-sm">日</span>
        </div>
      </fieldset>

      {/* 出生時刻 */}
      <fieldset>
        <legend className="text-sm font-semibold text-stone-600 mb-2 tracking-wide">
          出生時刻
        </legend>
        <label className="flex items-center gap-2 text-sm text-stone-500 mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={timeUnknown}
            onChange={(e) => setTimeUnknown(e.target.checked)}
            className="accent-amber-600"
          />
          時刻不明（時柱なしで鑑定）
        </label>
        {!timeUnknown && (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="時"
              min="0"
              max="23"
              className="w-16 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="text-stone-500 text-sm">時</span>
            <input
              type="number"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="分"
              min="0"
              max="59"
              className="w-16 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="text-stone-500 text-sm">分</span>
          </div>
        )}
      </fieldset>

      {/* 出生地 */}
      <fieldset>
        <legend className="text-sm font-semibold text-stone-600 mb-2 tracking-wide">
          出生地（真太陽時補正）
        </legend>
        <select
          value={cityIndex}
          onChange={(e) => setCityIndex(parseInt(e.target.value, 10))}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        >
          {CITY_PRESETS.map((city, i) => (
            <option key={city.name} value={i}>
              {city.name}
              {city.name !== "カスタム"
                ? ` (${city.offsetMinutes >= 0 ? "+" : ""}${city.offsetMinutes}分)`
                : ""}
            </option>
          ))}
        </select>
        {isCustom && (
          <div className="mt-2 flex items-center gap-2">
            <label className="text-xs text-stone-500">補正分数 (JST基準):</label>
            <input
              type="number"
              value={customOffset}
              onChange={(e) => setCustomOffset(e.target.value)}
              className="w-20 rounded-lg border border-stone-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="text-xs text-stone-400">分</span>
          </div>
        )}
        <p className="text-xs text-stone-400 mt-1">
          現在の補正: {offsetMinutes >= 0 ? "+" : ""}{offsetMinutes} 分
        </p>
      </fieldset>

      {/* 性別 */}
      <fieldset>
        <legend className="text-sm font-semibold text-stone-600 mb-2 tracking-wide">
          性別（大運方向に影響）
        </legend>
        <div className="flex gap-4">
          {(["male", "female"] as const).map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={gender === g}
                onChange={() => setGender(g)}
                className="accent-amber-600"
              />
              {g === "male" ? "男性" : "女性"}
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white font-bold py-3 text-base tracking-widest shadow hover:from-amber-800 hover:to-amber-600 transition-all"
      >
        命式を鑑定する ✦
      </button>
    </form>
  );
}
