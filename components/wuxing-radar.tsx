import type { WuxingBalance, Wuxing } from "@/lib/bazi/types";

const WUXING_ORDER: Wuxing[] = ["木", "火", "土", "金", "水"];
const COLORS: Record<Wuxing, string> = {
  木: "#2e7d3e",
  火: "#c73e3e",
  土: "#c9a648",
  金: "#9e9b8e",
  水: "#1a3a5c",
};

const CX = 150;
const CY = 150;
const R_MAX = 110;
const LEVELS = 4;

function polarToXY(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

export default function WuxingRadar({ wuxing }: { wuxing: WuxingBalance }) {
  const total = Object.values(wuxing).reduce((a, b) => a + b, 0) || 1;
  const maxVal = Math.max(...Object.values(wuxing), 0.001);

  const angleStep = 360 / 5;
  const axes = WUXING_ORDER.map((w, i) => {
    const angle = i * angleStep;
    const outer = polarToXY(angle, R_MAX + 18);
    const axisEnd = polarToXY(angle, R_MAX);
    return { w, angle, outer, axisEnd };
  });

  // レーダー多角形
  const dataPoints = WUXING_ORDER.map((w, i) => {
    const r = (wuxing[w] / maxVal) * R_MAX;
    return polarToXY(i * angleStep, r);
  });
  const polyPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  // グリッド多角形
  const gridLines = Array.from({ length: LEVELS }, (_, l) => {
    const r = (R_MAX * (l + 1)) / LEVELS;
    const pts = WUXING_ORDER.map((_, i) => polarToXY(i * angleStep, r));
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
  });

  return (
    <div
      role="img"
      aria-label="五行バランスレーダーチャート"
      style={{
        background: "linear-gradient(135deg, #fdfaf4 0%, #faf6ec 100%)",
        border: "1px solid rgba(201,166,72,0.3)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <svg width="300" height="300" viewBox="0 0 300 300">
        <title>五行バランスレーダーチャート</title>
        <desc>木・火・土・金・水の五行バランスをレーダーチャートで表示</desc>

        {/* グリッド */}
        {gridLines.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(201,166,72,0.25)"
            strokeWidth="1"
          />
        ))}

        {/* 軸線 */}
        {axes.map(({ angle, axisEnd }) => (
          <line
            key={angle}
            x1={CX}
            y1={CY}
            x2={axisEnd.x}
            y2={axisEnd.y}
            stroke="rgba(201,166,72,0.4)"
            strokeWidth="1"
          />
        ))}

        {/* データ多角形 */}
        <path
          d={polyPath}
          fill="rgba(199,166,72,0.18)"
          stroke="#c9a648"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 頂点ドット */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={COLORS[WUXING_ORDER[i]]}
            stroke="white"
            strokeWidth="1.5"
          />
        ))}

        {/* ラベル */}
        {axes.map(({ w, outer }) => {
          const pct = ((wuxing[w] / total) * 100).toFixed(0);
          return (
            <g key={w}>
              <text
                x={outer.x}
                y={outer.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={COLORS[w]}
                fontSize="14"
                fontWeight="bold"
                fontFamily="serif"
              >
                {w}
              </text>
              <text
                x={outer.x}
                y={outer.y + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={COLORS[w]}
                fontSize="9"
                opacity="0.8"
              >
                {pct}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* 凡例 */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        {WUXING_ORDER.map((w) => (
          <div key={w} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: COLORS[w], display: "inline-block" }} />
            <span style={{ color: COLORS[w], fontWeight: "bold" }}>{w}</span>
            <span style={{ color: "#888" }}>{wuxing[w].toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
