import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "四柱推命 — AI 運勢鑑定",
  description: "生年月日・出生時刻・出生地から四柱推命の命式を算出し、AI が運勢イメージ画像と鑑定文を生成します。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-washi">
        <header className="border-b border-amber-200/60 bg-stone-50/80 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
            <span className="text-2xl">☯</span>
            <h1 className="text-xl font-bold tracking-widest text-stone-800">
              四柱推命 · AI 鑑定
            </h1>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-amber-200/40 bg-stone-50/60 text-center py-6 text-xs text-stone-400 tracking-wide">
          本鑑定はエンターテインメントです。人生の重大な決断には専門家にご相談ください。
          <br />
          © 2025 四柱推命 AI 鑑定
        </footer>
      </body>
    </html>
  );
}
