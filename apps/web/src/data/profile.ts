import type { Project } from "@/lib/api";

export const profile = {
  name: "Aryan Tembhekar",
  initials: "AT",
  location: "Surat, India",
  email: "aryantembhekar294@gmail.com",
  linkedin: "https://www.linkedin.com/in/aryan-tembhekar-5697602a3/",
  github: "https://github.com/your-github-username",
  headline: "Analytics Engineer building intelligent internal systems.",
  introduction:
    "I turn complex production, inventory, pricing, and sales workflows into dependable data products—combining enterprise SQL, Python services, React interfaces, and AI-assisted engineering with human validation at the final decision point.",
  shortBio:
    "Mechanical engineer turned analytics and full-stack builder, working at the intersection of manufacturing intelligence, internal platforms, automation, and applied AI.",
};

export const impactMetrics = [
  { value: "3M+", label: "production records modelled", detail: "Historical and near-live operational data" },
  { value: "92", label: "parameters analysed", detail: "Across rough-to-polish production stages" },
  { value: "200–300", label: "daily reports automated", detail: "Converted from repetitive manual preparation" },
  { value: "80–90%", label: "workflow automation target", detail: "With final human control retained" },
];

export const experience = [
  {
    company: "Shree Ram Krishna Exports Pvt. Ltd.",
    role: "Supply Chain Analyst — Data & Manufacturing Analytics",
    period: "Jun 2025 — Present",
    type: "Work",
    description:
      "Designing near-live analytics and internal enterprise applications for production, inventory, pricing, sales, packet tracking, and management reporting across production and pre-production SQL Server environments.",
    highlights: [
      "Automated high-frequency operational reporting",
      "Built React + Python internal tools",
      "Worked with multi-schema production databases",
    ],
  },
  {
    company: "Indian Institute of Technology Mandi",
    role: "Research Intern",
    period: "Jun 2024 — Jul 2024",
    type: "Research",
    description:
      "Worked on UAV-mounted teleoperation and autonomous ground-vehicle system integration for specialized inspection scenarios.",
    highlights: ["System integration", "Component selection", "Autonomous systems research"],
  },
];

export const timeline = [
  {
    year: "2026",
    title: "Enterprise systems direction",
    eyebrow: "Current focus",
    description:
      "Deepening ERP architecture, backend structure, deployment, database internals, security, testing, and maintainable system design.",
    tags: ["ERP architecture", "System design", "Deployment"],
  },
  {
    year: "2025",
    title: "Analytics applications in production",
    eyebrow: "Professional work",
    description:
      "Started building production, inventory, pricing, sales, and management reporting tools on enterprise SQL Server data with React and Python.",
    tags: ["SQL Server", "React", "Python", "Automation"],
  },
  {
    year: "2024",
    title: "Applied robotics research",
    eyebrow: "IIT Mandi",
    description:
      "Explored UAV-mounted robotic systems and autonomous ground vehicles for inspection-oriented use cases.",
    tags: ["UAV", "AGV", "Research"],
  },
  {
    year: "2023–24",
    title: "Competition engineering and leadership",
    eyebrow: "SAE Phoenix Aero",
    description:
      "Led multidisciplinary UAV development, workshops, and autonomous navigation initiatives while securing innovation funding for a drone-delivery concept.",
    tags: ["Leadership", "UAV systems", "Innovation"],
  },
  {
    year: "2021–25",
    title: "Mechanical engineering foundation",
    eyebrow: "SVNIT Surat",
    description:
      "Built a systems-thinking foundation across mechanical design, manufacturing, robotics, controls, experimentation, and technical communication.",
    tags: ["Mechanical engineering", "Robotics", "Manufacturing"],
  },
];

export const capabilityGroups = [
  {
    title: "Data systems",
    summary: "From enterprise queries to decision-ready datasets.",
    items: ["SQL Server", "Multi-schema databases", "CTEs & window functions", "Views & stored procedures", "Query optimization", "DuckDB", "Data validation"],
    level: 88,
  },
  {
    title: "Application engineering",
    summary: "Readable full-stack tools for internal teams.",
    items: ["Python", "FastAPI-style services", "Uvicorn", "REST APIs", "Authentication", "React", "Vite", "TypeScript", "Radix UI", "shadcn/ui"],
    level: 82,
  },
  {
    title: "Analytics & automation",
    summary: "Operational logic translated into repeatable workflows.",
    items: ["Production analytics", "Inventory intelligence", "Sales & pricing", "Excel-to-web migration", "Caching", "Preprocessing", "Automated reporting", "Scenario analysis"],
    level: 92,
  },
  {
    title: "Engineering growth",
    summary: "Capabilities being deliberately strengthened.",
    items: ["ERP architecture", "Database internals", "Docker", "CI/CD", "Cloud deployment", "Automated testing", "Observability", "System design"],
    level: 64,
  },
];

export const workflowSteps = [
  {
    number: "01",
    title: "Understand the decision",
    text: "Start with the user, the operational friction, and the final decision—not the chart or technology.",
  },
  {
    number: "02",
    title: "Model the data flow",
    text: "Map source schemas, calculation rules, refresh paths, validation checkpoints, and ownership boundaries.",
  },
  {
    number: "03",
    title: "Build the smallest reliable system",
    text: "Use simple service boundaries, reusable components, precomputation, and clear APIs before adding complexity.",
  },
  {
    number: "04",
    title: "Validate with humans",
    text: "Compare outputs with known reports, test edge cases, and preserve human approval where business judgment matters.",
  },
  {
    number: "05",
    title: "Automate and improve",
    text: "Reduce repetitive work, monitor usage, capture feedback, and evolve the product around real workflows.",
  },
];

export const principles = [
  "Systems over isolated dashboards",
  "Automation with accountable human control",
  "Clear logic before clever abstractions",
  "Fast interfaces backed by validated calculations",
  "AI-assisted delivery, never unverified output",
  "Production discipline before scale theatre",
];

export const labItems = [
  {
    title: "ERP from first principles",
    status: "Active learning",
    description: "Studying how inventory, production, sales, pricing, permissions, auditability, and reporting connect inside one maintainable business system.",
    tags: ["Domain modelling", "RBAC", "Transactions"],
  },
  {
    title: "AI-assisted engineering workflow",
    status: "Applied daily",
    description: "Using structured prompts to explore architecture, generate alternatives, debug logic, improve UI, and accelerate delivery while manually testing the result.",
    tags: ["Prompt design", "Verification", "Prototyping"],
  },
  {
    title: "Analytics platform performance",
    status: "Ongoing",
    description: "Experimenting with preprocessing, caching, query reduction, and precomputed metrics to keep large-data interfaces responsive and understandable.",
    tags: ["Caching", "SQL", "Performance"],
  },
  {
    title: "Autonomous systems",
    status: "Engineering foundation",
    description: "Continuing the systems mindset developed through UAVs, computer vision, sensing, navigation, and robotics competitions.",
    tags: ["Robotics", "Computer vision", "Control"],
  },
];

export const fallbackProjects: Project[] = [
  {
    id: "manufacturing-analytics",
    slug: "manufacturing-analytics-platform",
    title: "Manufacturing Analytics Platform",
    summary: "Near-live analytics spanning rough-to-polish production history, operational parameters, and management reporting.",
    problem: "Large operational datasets and repeated manual analysis slowed management visibility and production decisions.",
    solution: "Structured SQL retrieval, preprocessing, statistical comparisons, cached calculations, Python services, and React reporting workflows.",
    impact: "Processes millions of records and converts repetitive reporting into reusable, fast internal applications.",
    techStack: ["SQL Server", "Python", "React", "Vite", "Uvicorn", "DuckDB"],
    featured: true,
  },
  {
    id: "inventory-intelligence",
    slug: "inventory-intelligence",
    title: "Inventory Intelligence & Overstock Analysis",
    summary: "Tracks movement, stock position, overstock patterns, and operational throughput across manufacturing stages.",
    problem: "Inventory decisions required repeated extracts, manual reconciliation, and fragmented spreadsheet reporting.",
    solution: "Automated SQL refresh, validated calculations, interactive filters, trend views, and decision-support summaries.",
    impact: "Moves the workflow toward 80–90% automation while retaining final human approval for business-critical actions.",
    techStack: ["SQL Server", "Python", "React", "shadcn/ui", "Radix UI"],
    featured: true,
  },
  {
    id: "sales-pricing",
    slug: "sales-pricing-analytics",
    title: "Sales & Pricing Analytics",
    summary: "Explores sales trends, pricing behaviour, product parameters, and user-specific decision scenarios.",
    problem: "Static reports made it difficult to test scenarios and compare historical patterns with current activity.",
    solution: "Dynamic web reports with precomputed metrics, caching, filtering, and simplified user workflows.",
    impact: "Faster scenario exploration and more consistent pricing and sales analysis for management discussions.",
    techStack: ["SQL", "Python", "React", "Data validation", "Caching"],
    featured: true,
  },
  {
    id: "report-automation",
    slug: "report-automation",
    title: "Report Automation & Excel-to-Web Migration",
    summary: "Transforms repetitive Excel preparation into dynamic, refreshable web reporting tools.",
    problem: "Teams spent 30–45 minutes compiling individual reports and repeated the workflow hundreds of times per day.",
    solution: "Direct SQL querying, scheduled refresh, reusable backend calculations, and clear web interfaces.",
    impact: "Reduced report generation from manual compilation to near-instant output for 200–300 daily reports.",
    techStack: ["SQL Server", "Python", "React", "Excel", "APIs"],
    featured: true,
  },
  {
    id: "drone-platform",
    slug: "autonomous-drone-platform",
    title: "Autonomous Drone Development Platform",
    summary: "Aerodynamically optimized UAV with precision landing and IoT payload monitoring.",
    problem: "Create a competition-ready autonomous platform capable of GPS-independent landing and payload monitoring.",
    solution: "Raspberry Pi computing, ArUco detection, flight-platform integration, and environmental sensing.",
    impact: "Achieved a national Top 10 ranking and supported a product patent and innovation funding journey.",
    techStack: ["Python", "Raspberry Pi", "Computer vision", "IoT", "UAV systems"],
    featured: false,
  },
  {
    id: "hexapod",
    slug: "hexapod-autonomous-robot",
    title: "18-DOF Autonomous Hexapod",
    summary: "Custom gait control, object detection, and autonomous movement across uneven terrain.",
    problem: "Build a mechanically stable, software-controlled robot that could navigate and adapt its gait.",
    solution: "Custom gait algorithms, sensor integration, object detection, and iterative hardware-software testing.",
    impact: "Won 2nd overall at the Robofest robotics competition.",
    techStack: ["Embedded systems", "Python", "Robotics", "Computer vision"],
    featured: false,
  },
];

export const projectMeta: Record<string, { category: string; index: string; accent: string; statement: string }> = {
  "manufacturing-analytics-platform": {
    category: "Data platform",
    index: "01",
    accent: "cyan",
    statement: "Turning manufacturing complexity into a decision layer.",
  },
  "inventory-intelligence": {
    category: "Inventory intelligence",
    index: "02",
    accent: "violet",
    statement: "Making stock movement visible before it becomes friction.",
  },
  "sales-pricing-analytics": {
    category: "Commercial analytics",
    index: "03",
    accent: "amber",
    statement: "Connecting historical signals to present pricing conversations.",
  },
  "report-automation": {
    category: "Workflow automation",
    index: "04",
    accent: "emerald",
    statement: "Replacing repetitive compilation with a reusable reporting system.",
  },
  "autonomous-drone-platform": {
    category: "Autonomous systems",
    index: "05",
    accent: "sky",
    statement: "Combining aerodynamics, perception, sensing, and precision control.",
  },
  "hexapod-autonomous-robot": {
    category: "Robotics",
    index: "06",
    accent: "rose",
    statement: "Engineering coordinated movement across eighteen degrees of freedom.",
  },
};
