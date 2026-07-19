export type StoryChapter = {
  id: "problem" | "signal" | "response" | "outcome";
  eyebrow: string;
  title: string;
  summary: string;
  evidence: string[];
  metric: {
    value: string;
    label: string;
    detail: string;
  };
  visual: {
    trend: number[];
    distribution: number[];
    flowStage: number;
    status: string;
  };
  prompt: string;
};

export const manufacturingStory = {
  slug: "manufacturing-analytics-platform",
  title: "Manufacturing Analytics Platform",
  label: "Demo with safe sample data",
  disclosure:
    "This demo uses safe sample values. Private company data and formulas are not shown.",
  chapters: [
    {
      id: "problem",
      eyebrow: "01 · Problem",
      title: "Manual reports slowed every decision.",
      summary:
        "Teams needed a faster view of production, but each question required another report.",
      evidence: [
        "Millions of past and near-live records",
        "Many production stages and measures",
        "Reports rebuilt before each review",
      ],
      metric: {
        value: "30–45 min",
        label: "per manual report",
        detail: "Typical time before automation.",
      },
      visual: {
        trend: [82, 78, 76, 70, 68, 64, 60, 58, 53, 49, 46, 42],
        distribution: [86, 72, 58, 44],
        flowStage: 0,
        status: "Separate data sources",
      },
      prompt: "Next: find reliable data",
    },
    {
      id: "signal",
      eyebrow: "02 · Data",
      title: "The data became useful after it was checked.",
      summary:
        "Source tables, known reports, and business rules were joined and checked before use.",
      evidence: [
        "Matched source totals to known reports",
        "Compared measures across each stage",
        "Checked results before showing them",
      ],
      metric: {
        value: "92",
        label: "production measures checked",
        detail: "Safe count across key stages.",
      },
      visual: {
        trend: [44, 47, 49, 55, 54, 61, 64, 66, 70, 73, 75, 78],
        distribution: [72, 81, 88, 74],
        flowStage: 2,
        status: "Checked data",
      },
      prompt: "Next: build the workflow",
    },
    {
      id: "response",
      eyebrow: "03 · Build",
      title: "The answer became a reusable tool.",
      summary:
        "SQL gets the data, Python checks it, and React shows it in clear steps.",
      evidence: [
        "Shared calculations replace repeat formulas",
        "Saved results keep the tool fast",
        "People approve important actions",
      ],
      metric: {
        value: "8 sec",
        label: "sample refresh time",
        detail: "Demo time for a prepared view.",
      },
      visual: {
        trend: [42, 49, 47, 58, 55, 66, 64, 71, 69, 78, 82, 86],
        distribution: [78, 86, 94, 82],
        flowStage: 4,
        status: "Workflow ready",
      },
      prompt: "Next: see the result",
    },
    {
      id: "outcome",
      eyebrow: "04 · Result",
      title: "Reports became faster and easier to review.",
      summary:
        "Teams can spend less time building reports and more time reviewing issues and choosing an action.",
      evidence: [
        "Results appear in seconds after refresh",
        "200–300 daily reports can be automated",
        "The tool shows where people must decide",
      ],
      metric: {
        value: "80–90%",
        label: "automation goal",
        detail: "People keep final control.",
      },
      visual: {
        trend: [44, 51, 53, 59, 61, 67, 70, 75, 78, 83, 88, 92],
        distribution: [82, 90, 96, 88],
        flowStage: 5,
        status: "Result measured",
      },
      prompt: "Open the full case",
    },
  ] satisfies StoryChapter[],
};

export type ProjectComparison = {
  label: string;
  action: string;
  units: string;
  labels: string[];
  current: {
    metric: string;
    delta: string;
    bars: number[];
  };
  improved: {
    metric: string;
    delta: string;
    bars: number[];
  };
};

export const projectComparisons: Record<string, ProjectComparison> = {
  "manufacturing-analytics-platform": {
    label: "Stable output",
    action: "Show improvement",
    units: "stage output",
    labels: ["Rough", "Cut", "Polish", "QC"],
    current: { metric: "91.8%", delta: "Current shift", bars: [72, 81, 88, 74] },
    improved: { metric: "93.1%", delta: "+1.3 pts", bars: [78, 86, 94, 82] },
  },
  "inventory-intelligence": {
    label: "Overstock risk",
    action: "Move stock",
    units: "stock age",
    labels: ["0–15d", "16–30d", "31–60d", "60d+"],
    current: { metric: "12.4%", delta: "Current risk", bars: [92, 73, 48, 26] },
    improved: { metric: "8.9%", delta: "−3.5 pts", bars: [94, 78, 39, 16] },
  },
  "sales-pricing-analytics": {
    label: "Conversion",
    action: "Test new price",
    units: "sales group result",
    labels: ["Domestic", "Export", "Repeat", "New"],
    current: { metric: "24.7%", delta: "Current mix", bars: [76, 88, 63, 52] },
    improved: { metric: "27.2%", delta: "+2.5 pts", bars: [81, 91, 71, 58] },
  },
  "report-automation": {
    label: "Report time",
    action: "Automate report",
    units: "report time",
    labels: ["Extract", "Prepare", "Check", "Publish"],
    current: { metric: "42 min", delta: "Manual", bars: [86, 92, 58, 70] },
    improved: { metric: "12 sec", delta: "Automated", bars: [18, 12, 16, 10] },
  },
  "autonomous-drone-platform": {
    label: "Landing error",
    action: "Use camera assist",
    units: "landing accuracy",
    labels: ["Detect", "Align", "Descend", "Land"],
    current: { metric: "1.8 m", delta: "GPS only", bars: [52, 61, 72, 84] },
    improved: { metric: "0.24 m", delta: "Vision assist", bars: [91, 88, 93, 96] },
  },
  "hexapod-autonomous-robot": {
    label: "Gait stability",
    action: "Change walking mode",
    units: "movement on rough ground",
    labels: ["Balance", "Stride", "Grip", "Recovery"],
    current: { metric: "74%", delta: "Fixed gait", bars: [74, 69, 62, 58] },
    improved: { metric: "91%", delta: "Adaptive", bars: [91, 88, 94, 86] },
  },
};

export const architectureStages = [
  {
    id: "inputs",
    title: "Inputs",
    short: "Source data",
    text: "Map the SQL tables, known reports, measures, and business context before any calculation.",
    proof: "Each source has a clear owner and update time.",
  },
  {
    id: "model",
    title: "Model",
    short: "Checked logic",
    text: "Shared queries and business rules create one clear data model.",
    proof: "Known results and unusual cases are checked before release.",
  },
  {
    id: "service",
    title: "Service",
    short: "Safe delivery",
    text: "Python services return small, fast results with login checks and clear errors.",
    proof: "Tests run before the tool reaches live data.",
  },
  {
    id: "experience",
    title: "Interface",
    short: "Clear screens",
    text: "React shows filters, comparisons, issues, and context in a useful order.",
    proof: "The screen separates sample data, system results, and human actions.",
  },
  {
    id: "control",
    title: "Control",
    short: "Human review",
    text: "Important results stay visible and need human approval.",
    proof: "Automation stops before a key business choice.",
  },
];
