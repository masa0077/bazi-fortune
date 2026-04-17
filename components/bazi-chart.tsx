import { STEM_TO_WUXING, BRANCH_TO_WUXING } from "@/lib/bazi/wuxing";
import { TEN_GOD_LABELS } from "@/lib/bazi/ten-gods";
import type { BaziResult, Wuxing } from "@/lib/bazi/types";

const WUXING_COLORS: Record<Wuxing, { bg: string; text: string; border: string }> = {
  木: { bg: "#e8f5ec", text: "#2e7d3e", border: "#2e7d3e" },
  火: { bg: "#fdecea", text: "#c73e3e", border: "#c73e3e" },
  土: { bg: "#fdf7e3", text: "#a07c10", border: "#c9a648" },
  金: { bg: "#f5f4f0", text: "#5a5040", border: "#9e9b8e" },
  水: { bg: "#e8eef5", text: "#1a3a5c", border: "#1a3a5c" },
};

const UNKNOWN_COLOR = { bg: "#f5f5f5", text: "#999", border: "#ccc" };

function getWuxingColors(char: string, map: Record<string, Wuxing>) {
  const w = map[char];
  return w ? WUXING_COLORS[w] : UNKNOWN_COLOR;
}

interface CellProps {
  char: string;
  size?: "lg" | "md" | "sm";
  wuxing?: Wuxing | null;
  label?: string;
}

function Cell({ char, size = "md", wuxing, label }: CellProps) {
  const colors = wuxing ? WUXING_COLORS[wuxing] : UNKNOWN_COLOR;
  const fontSize = size === "lg" ? "1.5rem" : size === "md" ? "1.1rem" : "0.8rem";

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1.5px solid ${colors.border}`,
        borderRadius: "8px",
        padding: "6px 4px",
        textAlign: "center",
        minWidth: "52px",
        position: "relative",
      }}
    >
      {label && (
        <p style={{ fontSize: "0.6rem", opacity: 0.6, marginBottom: "2px" }}>{label}</p>
      )}
      <p style={{ fontSize, fontWeight: "bold", lineHeight: 1.2 }}>{char || "—"}</p>
    </div>
  );
}

interface ColumnProps {
  title: string;
  stem: string;
  branch: string;
  hidden: string[];
  tenGod: string;
  isDayMaster?: boolean;
}

function PillarColumn({ title, stem, branch, hidden, tenGod, isDayMaster }: ColumnProps) {
  const stemW = STEM_TO_WUXING[stem] ?? null;
  const branchW = BRANCH_TO_WUXING[branch] ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center", minWidth: "64px" }}>
      {/* 柱タイトル */}
      <p style={{ fontSize: "0.65rem", color: "#888", letterSpacing: "0.1em", fontWeight: 600 }}>
        {title}
      </p>
      {/* 十神 */}
      <div style={{
        fontSize: "0.7rem",
        color: "#c9a648",
        fontWeight: "bold",
        minHeight: "1.2em",
        letterSpacing: "0.05em",
      }}>
        {TEN_GOD_LABELS[tenGod] || tenGod || ""}
      </div>
      {/* 天干 */}
      <Cell char={stem} size="lg" wuxing={stemW} label="天干" />
      {/* 地支 */}
      <Cell char={branch} size="lg" wuxing={branchW} label="地支" />
      {/* 蔵干 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", width: "100%" }}>
        {hidden.length > 0 ? (
          hidden.map((s, i) => (
            <Cell
              key={i}
              char={s}
              size="sm"
              wuxing={STEM_TO_WUXING[s] ?? null}
              label={i === 0 ? "蔵干" : ""}
            />
          ))
        ) : (
          <div style={{ height: "72px" }} />
        )}
      </div>
      {/* 日柱マーカー */}
      {isDayMaster && (
        <p style={{ fontSize: "0.6rem", color: "#c73e3e", fontWeight: "bold" }}>
          ▲ 日主
        </p>
      )}
    </div>
  );
}

export default function BaziChart({ bazi }: { bazi: BaziResult }) {
  const pillars: ColumnProps[] = [
    {
      title: "年柱",
      stem: bazi.yearPillar.stem,
      branch: bazi.yearPillar.branch,
      hidden: bazi.hiddenStems.year,
      tenGod: bazi.tenGods.year,
    },
    {
      title: "月柱",
      stem: bazi.monthPillar.stem,
      branch: bazi.monthPillar.branch,
      hidden: bazi.hiddenStems.month,
      tenGod: bazi.tenGods.month,
    },
    {
      title: "日柱",
      stem: bazi.dayPillar.stem,
      branch: bazi.dayPillar.branch,
      hidden: bazi.hiddenStems.day,
      tenGod: "",
      isDayMaster: true,
    },
    {
      title: "時柱",
      stem: bazi.hourPillar?.stem ?? "",
      branch: bazi.hourPillar?.branch ?? "",
      hidden: bazi.hiddenStems.hour,
      tenGod: bazi.tenGods.hour,
    },
  ];

  return (
    <div
      role="img"
      aria-label="四柱推命命式表"
      style={{
        background: "linear-gradient(135deg, #fdfaf4 0%, #faf6ec 100%)",
        border: "1px solid rgba(201,166,72,0.3)",
        borderRadius: "16px",
        padding: "20px 16px",
        overflowX: "auto",
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <title>四柱推命命式表</title>
        <desc>年柱・月柱・日柱・時柱の天干地支・蔵干・十神を表示した命式表</desc>
      </svg>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", minWidth: "280px" }}>
        {pillars.map((p) => (
          <PillarColumn key={p.title} {...p} />
        ))}
      </div>
      <p style={{ textAlign: "center", marginTop: "12px", fontSize: "0.7rem", color: "#aaa" }}>
        日干: {bazi.dayMaster} · {bazi.bodyStrength}
      </p>
    </div>
  );
}
