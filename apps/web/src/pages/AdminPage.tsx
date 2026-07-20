import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, Inbox, LogOut, MailCheck, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { api, type AdminMetrics } from "@/lib/api";

type Message = {
  id?: string;
  name?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
  mailStatus?: string;
  createdAt?: string;
};

const mailStatusLabels: Record<string, string> = {
  sent: "Delivered",
  failed: "Failed",
  pending: "Sending",
  not_configured: "Mail off",
};

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await api.me();
    } catch {
      navigate("/admin/login");
      return;
    }

    try {
      const [metricData, messageData] = await Promise.all([
        api.adminMetrics(),
        api.adminMessages(),
      ]);
      setMetrics(metricData);
      setMessages(messageData as Message[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const maxTrend = useMemo(
    () => Math.max(1, ...(metrics?.trend.map((point) => point.count) ?? [1])),
    [metrics],
  );

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      navigate("/");
    }
  };

  const headlineMetrics = [
    { label: "All enquiries", value: metrics?.totalMessages ?? "—", icon: Inbox },
    { label: "Today", value: metrics?.todayMessages ?? "—", icon: CalendarDays },
    { label: "Last 7 days", value: metrics?.lastSevenDays ?? "—", icon: BarChart3 },
    { label: "Mail delivered", value: metrics?.mail.sent ?? "—", icon: MailCheck },
  ];

  return (
    <main className="min-h-screen px-5 py-8 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Enquiry dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-400">Messages and mail delivery in one place.</p>
          </div>
          <div className="flex gap-3">
            <Button
              className="min-h-10 bg-white/5 px-4 text-slate-200 shadow-none hover:bg-white/10"
              disabled={loading}
              onClick={() => void loadDashboard()}
            >
              <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
              <span className="ml-2">Refresh</span>
            </Button>
            <Button className="min-h-10 px-4" onClick={logout}>
              <LogOut size={16} />
              <span className="ml-2">Sign out</span>
            </Button>
          </div>
        </header>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-300/20 bg-rose-300/5 px-5 py-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {headlineMetrics.map(({ label, value, icon: Icon }, index) => (
              <div
                className={`p-6 lg:p-7 ${index > 0 ? "border-t border-white/10 sm:border-l sm:border-t-0" : ""} ${index === 2 ? "sm:border-l-0 sm:border-t lg:border-l lg:border-t-0" : ""}`}
                key={label}
              >
                <Icon className="text-cyan-200" size={19} />
                <strong className="mt-7 block text-3xl font-semibold tracking-[-0.04em] text-white">
                  {value}
                </strong>
                <span className="mt-1 block text-sm text-slate-400">{label}</span>
              </div>
            ))}
          </div>

          <div className="grid border-t border-white/10 lg:grid-cols-[1.4fr_1fr]">
            <div className="p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">Seven-day activity</h2>
                  <p className="mt-1 text-sm text-slate-500">New enquiries by day</p>
                </div>
                <span className="text-xs uppercase tracking-[0.16em] text-slate-600">Live data</span>
              </div>
              <div className="mt-8 flex h-44 items-end gap-3 sm:gap-5">
                {(metrics?.trend ?? []).map((point) => (
                  <div className="flex h-full flex-1 flex-col justify-end" key={point.date}>
                    <span className="mb-2 text-center text-xs font-medium text-slate-400">
                      {point.count}
                    </span>
                    <div
                      className="min-h-1 rounded-t-md bg-gradient-to-t from-cyan-500/35 to-cyan-200 transition-[height] duration-500"
                      style={{ height: `${Math.max(4, (point.count / maxTrend) * 100)}%` }}
                    />
                    <span className="mt-3 text-center text-xs text-slate-500">{point.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-6 lg:border-l lg:border-t-0 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">Mail delivery</h2>
                  <p className="mt-1 max-w-[16rem] truncate text-sm text-slate-500">
                    {metrics?.mail.recipient ?? "Checking configuration"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${metrics?.mail.configured ? "bg-emerald-300/10 text-emerald-200" : "bg-amber-300/10 text-amber-200"}`}
                >
                  {metrics?.mail.configured ? "Configured" : "Setup needed"}
                </span>
              </div>
              <div className="mt-8 flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                  <strong className="text-4xl font-semibold tracking-[-0.04em] text-white">
                    {metrics?.mail.deliveryRate == null ? "—" : `${metrics.mail.deliveryRate}%`}
                  </strong>
                  <span className="mt-1 block text-sm text-slate-500">Delivery rate</span>
                </div>
                <MailCheck className="text-cyan-200/70" size={30} />
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
                <div><dt className="text-slate-500">Sent</dt><dd className="mt-1 font-semibold text-slate-200">{metrics?.mail.sent ?? "—"}</dd></div>
                <div><dt className="text-slate-500">Failed</dt><dd className="mt-1 font-semibold text-slate-200">{metrics?.mail.failed ?? "—"}</dd></div>
                <div><dt className="text-slate-500">Waiting</dt><dd className="mt-1 font-semibold text-slate-200">{metrics?.mail.pending ?? "—"}</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Inbox</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Contact messages</h2>
            </div>
            <span className="text-sm text-slate-500">{messages.length} shown</span>
          </div>

          <div>
            {!loading && messages.length === 0 ? (
              <p className="py-12 text-sm text-slate-400">No messages yet.</p>
            ) : (
              messages.map((message) => (
                <article className="grid gap-5 border-b border-white/10 py-7 lg:grid-cols-[1fr_2fr]" key={message.id}>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-white">{message.subject}</h3>
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                        {mailStatusLabels[message.mailStatus ?? ""] ?? "Unknown"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      {message.name} · {message.email}
                    </p>
                    {message.company && <p className="mt-1 text-sm text-slate-500">{message.company}</p>}
                    <time className="mt-3 block text-xs text-slate-600">{formatDate(message.createdAt)}</time>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{message.message}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
