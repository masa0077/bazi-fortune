"use client";

import { useState, useEffect } from "react";
import type { BaziResult, WuxingBalance } from "@/lib/bazi/types";

interface Props {
  bazi: BaziResult;
  wuxing: WuxingBalance;
}

type State = "idle" | "loading" | "done" | "error";

export default function FortuneImage({ bazi, wuxing }: Props) {
  const [state, setState] = useState<State>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function generate() {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bazi, wuxing }),
      });
      const data: { image?: string; error?: string } = await res.json();
      if (!res.ok || !data.image) {
        throw new Error(data.error ?? "画像が返されませんでした");
      }
      setImageUrl(data.image);
      setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "不明なエラー");
      setState("error");
    }
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "idle") return null;

  if (state === "loading") {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #fdfaf4, #f5ede0)",
          border: "1px solid rgba(201,166,72,0.3)",
          borderRadius: "16px",
          padding: "32px 16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid rgba(201,166,72,0.3)",
            borderTop: "3px solid #c9a648",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#a07c10", fontSize: "0.85rem", letterSpacing: "0.08em" }}>
          AI が運勢イメージを生成中…
        </p>
        <p style={{ color: "#bbb", fontSize: "0.7rem", marginTop: "4px" }}>
          Gemini が命式を分析しています
        </p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div
        style={{
          border: "1px solid #fca5a5",
          background: "#fef2f2",
          borderRadius: "12px",
          padding: "16px",
          color: "#b91c1c",
          fontSize: "0.85rem",
        }}
      >
        <p style={{ fontWeight: "bold" }}>画像生成に失敗しました</p>
        <p style={{ marginTop: "4px", opacity: 0.8 }}>{errorMsg}</p>
        <button
          onClick={generate}
          style={{
            marginTop: "10px",
            padding: "6px 16px",
            background: "#c73e3e",
            color: "white",
            borderRadius: "8px",
            fontSize: "0.8rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #fdfaf4, #f5ede0)",
        border: "1px solid rgba(201,166,72,0.3)",
        borderRadius: "16px",
        padding: "12px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={`${bazi.dayMaster}日干の命式を象徴する運勢イメージ`}
          style={{
            maxWidth: "100%",
            maxHeight: "480px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        />
      )}
    </div>
  );
}
