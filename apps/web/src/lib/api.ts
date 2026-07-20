export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string;
  techStack: string[];
  featured: boolean;
};

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  website?: string;
};

export type AdminMetrics = {
  totalMessages: number;
  todayMessages: number;
  lastSevenDays: number;
  trend: Array<{ date: string; label: string; count: number }>;
  mail: {
    configured: boolean;
    recipient: string;
    sent: number;
    failed: number;
    pending: number;
    notConfigured: number;
    deliveryRate: number | null;
  };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new Error("The backend API is not configured");

  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const csrf = getCookie("portfolio_csrf");
  if (csrf && init?.method && !["GET", "HEAD", "OPTIONS"].includes(init.method)) {
    headers.set("X-CSRF-Token", decodeURIComponent(csrf));
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch {
    throw new Error("Cannot reach the backend. Start the API on port 8000 and try again.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(body.detail ?? `Request failed with ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  isConfigured: Boolean(API_BASE_URL),
  projects: () => request<Project[]>("/projects"),
  contact: (payload: ContactPayload) =>
    request<{ message: string }>("/contact", { method: "POST", body: JSON.stringify(payload) }),
  login: (email: string, password: string) =>
    request<{ name: string; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<{ email: string; name: string; role: string }>("/auth/me"),
  logout: () => request<void>("/auth/logout", { method: "POST" }),
  adminMetrics: () => request<AdminMetrics>("/admin/metrics"),
  adminMessages: () => request<Array<Record<string, string>>>("/admin/messages"),
};
