import { Suspense } from "react";
import { redirect } from "next/navigation";
import { calculateBazi } from "@/lib/bazi/calculate";
import { calcWuxingBalance } from "@/lib/bazi/wuxing";
import type { BaziInput } from "@/lib/bazi/types";
import BaziChart from "@/components/bazi-chart";
import WuxingRadar from "@/components/wuxing-radar";
import FortuneImage from "@/components/fortune-image";
import ReadingPanel from "@/components/reading-panel";

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function ResultPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const year = parseInt(params.year ?? "", 10);
  const month = parseInt(params.month ?? "", 10);
  const day = parseInt(params.day ?? "", 10);
  const hourRaw = params.hour;
  const hour = hourRaw === "" || hourRaw === undefined ? null : parseInt(hourRaw, 10);
  const minute = parseInt(params.minute ?? "0", 10);
  const offset = parseInt(params.offset ?? "0", 10);
  const gender = (params.gender ?? "male") as "male" | "female";

  if (!year || !month || !day) {
    redirect("/");
  }

  const input: BaziInput = {
    year,
    month,
    day,
    hour,
    minute,
    longitudeOffsetMinutes: offset,
    gender,
  };

  const bazi = calculateBazi(input);
  const wuxing = calcWuxingBalance(bazi);

  const birthDateLabel = `${year}年${month}月${day}日${
    hour !== null ? ` ${hour}:${String(minute).padStart(2, "0")}` : " (時刻不明)"
  }`;

  return (
    <div className="flex flex-col gap-8">
      {/* タイトル */}
      <section className="text-center">
        <p className="text-xs text-stone-400 mb-1 tracking-widest">命式鑑定結果</p>
        <h2 className="text-2xl font-bold tracking-widest text-stone-800">
          {birthDateLabel} 生
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          日干: <strong className="text-amber-700">{bazi.dayMaster}</strong>
          &ensp;·&ensp;{bazi.bodyStrength}
        </p>
      </section>

      {/* 命式表 */}
      <section>
        <SectionTitle icon="☰" title="命式" />
        <Suspense fallback={<ChartSkeleton />}>
          <BaziChart bazi={bazi} />
        </Suspense>
      </section>

      {/* 五行バランス */}
      <section>
        <SectionTitle icon="⬡" title="五行バランス" />
        <Suspense fallback={<ChartSkeleton height={240} />}>
          <WuxingRadar wuxing={wuxing} />
        </Suspense>
      </section>

      {/* 運勢イメージ (クライアント側で生成) */}
      <section>
        <SectionTitle icon="🎨" title="運勢イメージ" />
        <FortuneImage bazi={bazi} wuxing={wuxing} />
      </section>

      {/* AI 鑑定文 (クライアント側でストリーミング) */}
      <section>
        <SectionTitle icon="✦" title="AI 鑑定文" />
        <ReadingPanel bazi={bazi} wuxing={wuxing} birthYear={year} gender={gender} />
      </section>

      {/* 戻るリンク */}
      <div className="text-center mt-4">
        <a
          href="/"
          className="text-sm text-amber-700 underline underline-offset-4 hover:text-amber-900"
        >
          ← 別の命式を鑑定する
        </a>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg">{icon}</span>
      <h3 className="text-base font-bold tracking-widest text-stone-700 border-b border-amber-300 pb-0.5">
        {title}
      </h3>
    </div>
  );
}

function ChartSkeleton({ height = 180 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-xl bg-stone-100 animate-pulse"
      style={{ height }}
    />
  );
}
