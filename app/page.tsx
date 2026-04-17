import InputForm from "@/components/input-form";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* ヒーローセクション */}
      <section className="text-center pt-4 pb-2">
        <p className="text-4xl mb-3">🔮</p>
        <h2 className="text-3xl font-bold tracking-widest text-stone-800 mb-2">
          四柱推命 · 命式鑑定
        </h2>
        <p className="text-stone-500 text-sm leading-relaxed max-w-md">
          生年月日・出生時刻・出生地を入力すると、<br />
          命式を算出し AI が運勢イメージと鑑定文を生成します。
        </p>
      </section>

      {/* 入力フォーム */}
      <InputForm />
    </div>
  );
}
