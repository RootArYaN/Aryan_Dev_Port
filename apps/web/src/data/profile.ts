import type { Project } from "@/lib/api";

export const profile = {
  name: "Aryan Tembhekar",
  initials: "AT",
  location: "Surat, India",
  email: "aryantembhekar294@gmail.com",
  linkedin: "https://www.linkedin.com/in/aryan-tembhekar-5697602a3/",
  github: "https://github.com/your-github-username",
  headline: "Analytics Engineer building clear tools for real work.",
  introduction:
    "I turn production, inventory, pricing, and sales data into fast tools that teams can trust.",
  shortBio:
    "A mechanical engineer who now builds data tools, web apps, and automation for real business work.",
};

export const impactMetrics = [
  { value: "3M+", label: "production records", detail: "Past and near-live data" },
  { value: "92", label: "production measures", detail: "Across key work stages" },
  { value: "200–300", label: "daily reports", detail: "Moved from manual work to automation" },
  { value: "80–90%", label: "automation goal", detail: "People still approve key actions" },
];

export const experience = [
  {
    company: "Shree Ram Krishna Exports Pvt. Ltd.",
    role: "Supply Chain Analyst — Data & Manufacturing Analytics",
    period: "Jun 2025 — Present",
    type: "Work",
    description:
      "I build near-live tools for production, inventory, pricing, sales, tracking, and reports using SQL Server, Python, and React.",
    highlights: [
      "Automated daily reports",
      "Built React and Python tools",
      "Worked with large SQL databases",
    ],
  },
  {
    company: "Indian Institute of Technology Mandi",
    role: "Research Intern",
    period: "Jun 2024 — Jul 2024",
    type: "Research",
    description:
      "Worked on drone-mounted controls and self-driving ground vehicles for inspection work.",
    highlights: ["System testing", "Part selection", "Robotics research"],
  },
];

export const timeline = [
  {
    year: "2026",
    title: "Business systems",
    eyebrow: "Current focus",
    description:
      "Learning more about ERP systems, backends, databases, security, testing, and deployment.",
    tags: ["ERP architecture", "System design", "Deployment"],
  },
  {
    year: "2025",
    title: "Analytics tools at work",
    eyebrow: "Professional work",
    description:
      "Started building production, inventory, pricing, sales, and reporting tools with SQL Server, React, and Python.",
    tags: ["SQL Server", "React", "Python", "Automation"],
  },
  {
    year: "2024",
    title: "Robotics research",
    eyebrow: "IIT Mandi",
    description:
      "Tested drone-mounted systems and self-driving ground vehicles for inspections.",
    tags: ["UAV", "AGV", "Research"],
  },
  {
    year: "2023–24",
    title: "Drone team leadership",
    eyebrow: "SAE Phoenix Aero",
    description:
      "Led a student drone team, ran workshops, and helped win funding for a delivery drone idea.",
    tags: ["Leadership", "UAV systems", "Innovation"],
  },
  {
    year: "2021–25",
    title: "Mechanical engineering",
    eyebrow: "SVNIT Surat",
    description:
      "Learned design, manufacturing, robotics, controls, testing, and technical communication.",
    tags: ["Mechanical engineering", "Robotics", "Manufacturing"],
  },
];

export const capabilityGroups = [
  {
    title: "Data",
    summary: "Clean data for clear decisions.",
    items: ["SQL Server", "Multi-schema databases", "CTEs & window functions", "Views & stored procedures", "Query optimization", "DuckDB", "Data validation"],
    level: 88,
  },
  {
    title: "Web apps",
    summary: "Simple web tools for internal teams.",
    items: ["Python", "FastAPI-style services", "Uvicorn", "REST APIs", "Authentication", "React", "Vite", "TypeScript", "Radix UI", "shadcn/ui"],
    level: 82,
  },
  {
    title: "Reports and automation",
    summary: "Repeatable reports and workflows.",
    items: ["Production analytics", "Inventory intelligence", "Sales & pricing", "Excel-to-web migration", "Caching", "Preprocessing", "Automated reporting", "Scenario analysis"],
    level: 92,
  },
  {
    title: "Learning now",
    summary: "Skills I am building now.",
    items: ["ERP architecture", "Database internals", "Docker", "CI/CD", "Cloud deployment", "Automated testing", "Observability", "System design"],
    level: 64,
  },
];

export const workflowSteps = [
  {
    number: "01",
    title: "Understand the decision",
    text: "Start with the user, the problem, and the decision they need to make.",
  },
  {
    number: "02",
    title: "Model the data flow",
    text: "Map the data, rules, updates, checks, and owners.",
  },
  {
    number: "03",
    title: "Build a small, reliable tool",
    text: "Keep the first version simple, reusable, and easy to test.",
  },
  {
    number: "04",
    title: "Validate with humans",
    text: "Check the results with users and keep people in control of key choices.",
  },
  {
    number: "05",
    title: "Automate and improve",
    text: "Remove repeat work, watch how the tool is used, and improve it with feedback.",
  },
];

export const principles = [
  "Build tools, not isolated charts",
  "Automate work, keep people in control",
  "Use clear logic",
  "Keep the interface fast",
  "Check every AI-assisted result",
  "Make it reliable before making it bigger",
];

export const labItems = [
  {
    title: "How ERP systems work",
    status: "Active learning",
    description: "Learning how inventory, production, sales, pricing, access, history, and reports fit into one system.",
    tags: ["Domain modelling", "RBAC", "Transactions"],
  },
  {
    title: "AI-assisted development",
    status: "Applied daily",
    description: "Using AI to explore ideas, fix code, improve the UI, and work faster. I still test the result myself.",
    tags: ["Prompt design", "Verification", "Prototyping"],
  },
  {
    title: "Faster analytics tools",
    status: "Ongoing",
    description: "Testing caching, smaller queries, and saved results to keep large data tools fast.",
    tags: ["Caching", "SQL", "Performance"],
  },
  {
    title: "Autonomous systems",
    status: "Core experience",
    description: "Building on work with drones, computer vision, sensors, navigation, and robotics.",
    tags: ["Robotics", "Computer vision", "Control"],
  },
];

export const fallbackProjects: Project[] = [
  {
    id: "manufacturing-analytics",
    slug: "manufacturing-analytics-platform",
    title: "Manufacturing Analytics Platform",
    summary: "Near-live production data and reports in one clear tool.",
    problem: "Large datasets and manual reports slowed daily decisions.",
    solution: "SQL collects the data, Python checks it, and React shows the result.",
    impact: "Millions of records now support fast, repeatable reports.",
    techStack: ["SQL Server", "Python", "React", "Vite", "Uvicorn", "DuckDB"],
    featured: true,
  },
  {
    id: "inventory-intelligence",
    slug: "inventory-intelligence",
    title: "Inventory and Overstock Analysis",
    summary: "Tracks stock, movement, ageing, and work stages.",
    problem: "Teams relied on repeated exports and separate spreadsheets.",
    solution: "Automatic data updates, checked totals, filters, and simple trends.",
    impact: "Moves most repeat work toward automation while people approve key actions.",
    techStack: ["SQL Server", "Python", "React", "shadcn/ui", "Radix UI"],
    featured: true,
  },
  {
    id: "sales-pricing",
    slug: "sales-pricing-analytics",
    title: "Sales & Pricing Analytics",
    summary: "Shows sales trends, price changes, and simple what-if views.",
    problem: "Static reports made price and sales comparisons slow.",
    solution: "Fast web reports with saved results, filters, and clear steps.",
    impact: "Teams can compare options faster and use the same numbers.",
    techStack: ["SQL", "Python", "React", "Data validation", "Caching"],
    featured: true,
  },
  {
    id: "report-automation",
    slug: "report-automation",
    title: "Report Automation",
    summary: "Moves repeat Excel reports into a fast web tool.",
    problem: "Each report took 30–45 minutes and the work repeated all day.",
    solution: "Direct SQL queries, automatic updates, shared calculations, and clear pages.",
    impact: "Makes 200–300 daily reports available in seconds.",
    techStack: ["SQL Server", "Python", "React", "Excel", "APIs"],
    featured: true,
  },
  {
    id: "drone-platform",
    slug: "autonomous-drone-platform",
    title: "Autonomous Drone Platform",
    summary: "A drone with precise landing and live payload checks.",
    problem: "Build a competition drone that could land without GPS and track its payload.",
    solution: "Used a Raspberry Pi, visual markers, flight controls, and sensors.",
    impact: "Reached the national Top 10 and supported a patent and project funding.",
    techStack: ["Python", "Raspberry Pi", "Computer vision", "IoT", "UAV systems"],
    featured: false,
  },
  {
    id: "hexapod",
    slug: "hexapod-autonomous-robot",
    title: "Autonomous Hexapod Robot",
    summary: "A six-leg robot that sees objects and walks on uneven ground.",
    problem: "Build a stable robot that could move and change how it walks.",
    solution: "Created walking rules, added sensors and vision, then tested each part together.",
    impact: "Won second place at the Robofest robotics competition.",
    techStack: ["Embedded systems", "Python", "Robotics", "Computer vision"],
    featured: false,
  },
];

export const projectMeta: Record<string, { category: string; index: string; accent: string; statement: string }> = {
  "manufacturing-analytics-platform": {
    category: "Production data",
    index: "01",
    accent: "cyan",
    statement: "Making production data easy to use.",
  },
  "inventory-intelligence": {
    category: "Inventory",
    index: "02",
    accent: "violet",
    statement: "Seeing stock issues before they grow.",
  },
  "sales-pricing-analytics": {
    category: "Sales data",
    index: "03",
    accent: "amber",
    statement: "Using past sales to guide pricing.",
  },
  "report-automation": {
    category: "Report automation",
    index: "04",
    accent: "emerald",
    statement: "Replacing manual reports with one shared tool.",
  },
  "autonomous-drone-platform": {
    category: "Drones",
    index: "05",
    accent: "sky",
    statement: "Helping a drone see, sense, and land.",
  },
  "hexapod-autonomous-robot": {
    category: "Robotics",
    index: "06",
    accent: "rose",
    statement: "Making six legs move as one system.",
  },
};
