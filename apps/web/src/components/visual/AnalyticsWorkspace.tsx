import { useState } from "react";
import { BarChart3, CheckCircle2, Code2, Play } from "lucide-react";

const sessions = [
  {
    id: "production",
    label: "Production",
    file: "production_daily.sql",
    rows: "2.4M",
    refresh: "18 sec",
    coverage: "99.8%",
    accent: "#72e5dd",
    code: [
      "WITH daily_output AS (",
      "  SELECT work_date, stage, SUM(units) AS units",
      "  FROM production_history",
      "  WHERE work_date >= CURRENT_DATE - 30",
      "  GROUP BY work_date, stage",
      ")",
      "SELECT * FROM daily_output ORDER BY work_date DESC;",
    ],
    bars: [44, 58, 52, 72, 64, 81, 76, 88],
    insight: "Polishing output is 12.4% above the usual level.",
  },
  {
    id: "inventory",
    label: "Inventory",
    file: "inventory_ageing.py",
    rows: "684K",
    refresh: "11 sec",
    coverage: "98.9%",
    accent: "#a78bfa",
    code: [
      "movement = load_inventory_history()",
      "snapshot = (",
      "    movement.groupby([\"sku\", \"stage\"])",
      "    .agg(on_hand=(\"quantity\", \"sum\"))",
      "    .reset_index()",
      ")",
      "snapshot[\"age_days\"] = days_since_last_move(snapshot)",
    ],
    bars: [82, 76, 68, 61, 55, 49, 42, 36],
    insight: "Three stock groups hold 61% of items older than 90 days.",
  },
  {
    id: "sales",
    label: "Sales",
    file: "pricing_report.ts",
    rows: "148K",
    refresh: "7 sec",
    coverage: "100%",
    accent: "#7dd3fc",
    code: [
      "const report = await api.sales.summary({",
      "  period: \"rolling-12-months\",",
      "  groupBy: [\"region\", \"product\"],",
      "  metrics: [\"revenue\", \"margin\", \"variance\"],",
      "});",
      "return validateReport(report);",
    ],
    bars: [38, 46, 43, 55, 61, 68, 74, 84],
    insight: "Revenue is up 8.7%. Price change is within range.",
  },
] as const;

export function AnalyticsWorkspace() {
  const [activeId, setActiveId] = useState<(typeof sessions)[number]["id"]>("production");
  const [runCount, setRunCount] = useState(1);
  const session = sessions.find((item) => item.id === activeId) ?? sessions[0];

  return (
    <div className="analytics-workspace" style={{ "--workspace-accent": session.accent } as React.CSSProperties}>
      <div className="analytics-workspace__header">
        <h2>Reporting workspace</h2>
        <span className="analytics-workspace__status"><i /> Live</span>
      </div>

      <div className="analytics-workspace__tabs" role="tablist" aria-label="Select reporting session">
        {sessions.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeId === item.id}
            onClick={() => {
              setActiveId(item.id);
              setRunCount((count) => count + 1);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="analytics-workspace__body">
        <section className="analytics-editor" aria-label={`${session.label} code editor`}>
          <div className="analytics-panel-heading">
            <span><Code2 size={14} /> {session.file}</span>
            <button type="button" onClick={() => setRunCount((count) => count + 1)}>
              <Play size={12} fill="currentColor" /> Run
            </button>
          </div>
          <pre key={`${session.id}-${runCount}`}>
            {session.code.map((line, index) => (
              <span key={`${line}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i><code>{line || " "}</code></span>
            ))}
          </pre>
          <div className="analytics-editor__result">
            <CheckCircle2 size={13} /> Validated · {session.rows} rows
          </div>
        </section>

        <section className="analytics-output" aria-label={`${session.label} reporting output`}>
          <div className="analytics-panel-heading">
            <span><BarChart3 size={14} /> Output</span>
          </div>
          <div className="analytics-kpis">
            <div><span>Rows</span><strong>{session.rows}</strong></div>
            <div><span>Refresh</span><strong>{session.refresh}</strong></div>
            <div><span>Checked</span><strong>{session.coverage}</strong></div>
          </div>
          <div className="analytics-chart" aria-label="Eight-period reporting trend">
            <div className="analytics-chart__grid" />
            {session.bars.map((height, index) => (
              <i key={`${session.id}-${index}`} style={{ height: `${height}%`, animationDelay: `${index * 35}ms` }} />
            ))}
          </div>
          <div className="analytics-insight">
            <span>Insight</span>
            <p>{session.insight}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
