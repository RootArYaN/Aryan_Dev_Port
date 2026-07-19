import { useEffect, useMemo, useState } from "react";
import { Calculator, CheckCircle2, RotateCcw, Table2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type FormulaId = "variance" | "total" | "average" | "status";

type SheetRow = {
  stage: string;
  plan: number;
  actual: number;
};

const initialRows: SheetRow[] = [
  { stage: "Rough", plan: 420, actual: 438 },
  { stage: "Cut", plan: 360, actual: 351 },
  { stage: "Polish", plan: 310, actual: 326 },
  { stage: "QC", plan: 280, actual: 274 },
];

const formulaOptions: Array<{ id: FormulaId; label: string }> = [
  { id: "variance", label: "Variance" },
  { id: "total", label: "Total" },
  { id: "average", label: "Average" },
  { id: "status", label: "Status" },
];

function signed(value: number) {
  return `${value > 0 ? "+" : ""}${value}`;
}

export function ExcelWorkspace() {
  const [rows, setRows] = useState(initialRows);
  const [selectedRow, setSelectedRow] = useState(0);
  const [activeFormula, setActiveFormula] = useState<FormulaId>("variance");
  const [calculating, setCalculating] = useState(false);
  const reduceMotion = useReducedMotion();

  const totals = useMemo(() => ({
    plan: rows.reduce((sum, row) => sum + row.plan, 0),
    actual: rows.reduce((sum, row) => sum + row.actual, 0),
  }), [rows]);

  const rowNumber = selectedRow + 2;
  const selected = rows[selectedRow];
  const variance = selected.actual - selected.plan;
  const totalVariance = totals.actual - totals.plan;
  const average = totals.actual / rows.length;
  const rate = Math.round((totals.actual / totals.plan) * 1000) / 10;

  const formula = {
    variance: { cell: `D${rowNumber}`, expression: `=C${rowNumber}-B${rowNumber}`, result: signed(variance) },
    total: { cell: `C${rows.length + 2}`, expression: `=SUM(C2:C${rows.length + 1})`, result: totals.actual.toLocaleString() },
    average: { cell: "G2", expression: `=AVERAGE(C2:C${rows.length + 1})`, result: average.toFixed(1) },
    status: { cell: `E${rowNumber}`, expression: `=IF(D${rowNumber}>=0,"On track","Check")`, result: variance >= 0 ? "On track" : "Check" },
  }[activeFormula];

  useEffect(() => {
    setCalculating(true);
    const timer = window.setTimeout(() => setCalculating(false), reduceMotion ? 0 : 320);
    return () => window.clearTimeout(timer);
  }, [activeFormula, reduceMotion, rows, selectedRow]);

  const updateActual = (index: number, value: string) => {
    const nextValue = Math.max(0, Math.min(9999, Number(value) || 0));
    setSelectedRow(index);
    setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, actual: nextValue } : row));
  };

  const isSourceCell = (column: "plan" | "actual" | "variance" | "status", index: number) => {
    if (activeFormula === "total" || activeFormula === "average") return column === "actual";
    if (index !== selectedRow) return false;
    if (activeFormula === "variance") return column === "plan" || column === "actual" || column === "variance";
    return column === "variance" || column === "status";
  };

  return (
    <div className={`excel-workspace ${calculating ? "is-calculating" : ""}`}>
      <div className="excel-workspace__header">
        <div>
          <span><Table2 size={14} /> Excel model</span>
          <strong>production_plan.xlsx</strong>
        </div>
        <button type="button" onClick={() => setRows(initialRows)}><RotateCcw size={13} /> Reset</button>
      </div>

      <div className="excel-formulas" role="tablist" aria-label="Choose a formula">
        {formulaOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeFormula === item.id}
            onClick={() => setActiveFormula(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="excel-formula-bar" aria-live="polite">
        <span>{formula.cell}</span>
        <i>fx</i>
        <code>{formula.expression}</code>
        <AnimatePresence mode="wait" initial={false}>
          <motion.strong
            key={`${activeFormula}-${formula.result}`}
            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          >
            {formula.result}
          </motion.strong>
        </AnimatePresence>
      </div>

      <div className="excel-sheet" role="grid" aria-label="Editable production sheet">
        <div className="excel-sheet__grid">
          <div className="excel-sheet__corner" />
          {["A", "B", "C", "D", "E"].map((column) => <div key={column} className="excel-sheet__column">{column}</div>)}

          <div className="excel-sheet__row-number">1</div>
          {["Stage", "Plan", "Actual", "Variance", "Status"].map((heading) => <div key={heading} className="excel-sheet__heading">{heading}</div>)}

          {rows.map((row, index) => {
            const rowVariance = row.actual - row.plan;
            return (
              <div key={row.stage} className="contents">
                <button type="button" className="excel-sheet__row-number" onClick={() => setSelectedRow(index)}>{index + 2}</button>
                <button type="button" className={`excel-sheet__cell excel-sheet__stage ${selectedRow === index ? "is-row-selected" : ""}`} onClick={() => setSelectedRow(index)}>{row.stage}</button>
                <div className={`excel-sheet__cell ${isSourceCell("plan", index) ? "is-source" : ""}`}>{row.plan}</div>
                <label className={`excel-sheet__cell excel-sheet__input ${isSourceCell("actual", index) ? "is-source" : ""}`}>
                  <input aria-label={`${row.stage} actual output`} type="number" min="0" max="9999" value={row.actual} onFocus={() => setSelectedRow(index)} onChange={(event) => updateActual(index, event.target.value)} />
                </label>
                <div className={`excel-sheet__cell excel-sheet__calculated ${isSourceCell("variance", index) ? "is-source is-result" : ""}`}>
                  <motion.span key={rowVariance} initial={reduceMotion ? false : { opacity: 0.35 }} animate={{ opacity: 1 }}>{signed(rowVariance)}</motion.span>
                </div>
                <div className={`excel-sheet__cell excel-sheet__status ${isSourceCell("status", index) ? "is-source is-result" : ""}`}>
                  <span className={rowVariance >= 0 ? "is-good" : "is-check"}>{rowVariance >= 0 ? "On track" : "Check"}</span>
                </div>
              </div>
            );
          })}

          <div className="excel-sheet__row-number">{rows.length + 2}</div>
          <div className="excel-sheet__cell excel-sheet__total">Total</div>
          <div className="excel-sheet__cell excel-sheet__total">{totals.plan.toLocaleString()}</div>
          <div className={`excel-sheet__cell excel-sheet__total ${activeFormula === "total" ? "is-source is-result" : ""}`}>{totals.actual.toLocaleString()}</div>
          <div className="excel-sheet__cell excel-sheet__total">{signed(totalVariance)}</div>
          <div className="excel-sheet__cell excel-sheet__total">{rate}%</div>
        </div>
      </div>

      <div className="excel-workspace__footer">
        <span><CheckCircle2 size={13} /> Formulas updated</span>
        <p><Calculator size={13} /> Edit any <strong>Actual</strong> cell to recalculate the sheet.</p>
      </div>
    </div>
  );
}
