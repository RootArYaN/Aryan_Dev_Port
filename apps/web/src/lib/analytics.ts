type AnalyticsEventMap = {
  flagship_story_started: { chapter: string };
  flagship_story_completed: { chapter: string };
  scenario_interaction: { surface: string; slug: string; scenario: "current" | "improved" };
  project_opened: { source: string; slug: string };
  case_study_depth: { slug: string; depth: "50" | "90" };
  resume_click: { surface: string };
  contact_cta_click: { surface: string };
};

type AnalyticsEventName = keyof AnalyticsEventMap;
type PlausibleFunction = ((eventName: string, options?: { props?: Record<string, string> }) => void) & {
  q?: unknown[];
};

declare global {
  interface Window {
    plausible?: PlausibleFunction;
  }
}

const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim();
const scriptUrl = import.meta.env.VITE_PLAUSIBLE_SCRIPT_URL?.trim();
let initialized = false;

function safeProperties(properties: object) {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([, value]) => typeof value === "string" && value.length > 0)
      .map(([key, value]) => [key.slice(0, 40), String(value).slice(0, 120)]),
  );
}

export function initializeAnalytics() {
  if (initialized || !domain || !scriptUrl || typeof document === "undefined") return;
  initialized = true;

  if (!window.plausible) {
    const queuedPlausible = ((...args: unknown[]) => {
      queuedPlausible.q = queuedPlausible.q ?? [];
      queuedPlausible.q.push(args);
    }) as PlausibleFunction;
    window.plausible = queuedPlausible;
  }

  const existing = document.querySelector<HTMLScriptElement>("script[data-portfolio-analytics]");
  if (existing) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = scriptUrl;
  script.dataset.domain = domain;
  script.dataset.portfolioAnalytics = "plausible";
  document.head.appendChild(script);
}

export function trackEvent<Name extends AnalyticsEventName>(
  name: Name,
  properties: AnalyticsEventMap[Name],
) {
  if (!domain || !scriptUrl || typeof window === "undefined" || !window.plausible) return;
  window.plausible(name, { props: safeProperties(properties) });
}

export const analyticsConfigured = Boolean(domain && scriptUrl);
