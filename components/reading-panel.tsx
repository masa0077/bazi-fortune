"use client";

import { useState, useEffect, useRef } from "react";
import type { BaziResult, WuxingBalance } from "@/lib/bazi/types";

interface Props {
  bazi: BaziResult;
  wuxing: WuxingBalance;
  birthYear: number;
  gender: "male" | "female";
}

type State = "idle" | "loading" | "done" | "error";

export default function ReadingPanel({ bazi, wuxing, birthYear, gender }: Props) {
  const [state, setState] = useState<State>("idle");
  const [text, setText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function fetchReading() {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setState("loading");
    setText("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bazi, wuxing, birthYear, gender }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "不明なエラー" }));
        throw new Error((err as { error: string }).error);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      setState("loading");

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          setText((prev) => prev + chunk);
        }
      }
      setState("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setErrorMsg(err instanceof Error ? err.message : "不明なエラー");
      setState("error");
    }
  }

  useEffect(() => {
    fetchReading();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedText = text
    .split("\n")
    .map((line, i) => {
      // **太字** を <strong> に変換
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <p key={i} style={{ marginBottom: "0.5em", minHeight: "1em" }}>
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} style={{ color: "#a07c10" }}>
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #fdfaf4 0%, #faf6ec 100%)",
        border: "1px solid rgba(201,166,72,0.3)",
        borderRadius: "16px",
        padding: "20px 24px",
        fontSize: "0.9rem",
        lineHeight: "1.9",
        color: "#2c2416",
        minHeight: "100px",
      }}
    >
      {state === "idle" && null}

      {(state === "loading" || state === "done") && (
        <>
          <div>{formattedText}</div>
          {state === "loading" && (
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 16,
                background: "#c9a648",
                animation: "blink 0.8s step-end infinite",
                verticalAlign: "middle",
                marginLeft: 2,
              }}
            />
          )}
          <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
        </>
      )}

      {state === "error" && (
        <div>
          <p style={{ color: "#b91c1c", fontWeight: "bold" }}>鑑定文の生成に失敗しました</p>
          <p style={{ color: "#888", fontSize: "0.8rem", marginTop: "4px" }}>{errorMsg}</p>
          <button
            onClick={fetchReading}
            style={{
              marginTop: "10px",
              padding: "6px 16px",
              background: "#a07c10",
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
      )}
    </div>
  );
}
