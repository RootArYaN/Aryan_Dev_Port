import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Message = { id?: string; name?: string; email?: string; company?: string; subject?: string; message?: string; createdAt?: string };

export function AdminPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    api.me().then(() => api.adminMessages()).then((items) => setMessages(items as Message[])).catch(() => navigate("/admin/login"));
  }, [navigate]);

  const logout = async () => { try { await api.logout(); } finally { navigate("/"); } };

  return <main className="min-h-screen px-5 py-12 lg:px-8"><div className="mx-auto max-w-6xl"><div className="flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Administration</p><h1 className="mt-2 text-4xl font-semibold text-white">Contact messages</h1></div><Button onClick={logout}>Sign out</Button></div><div className="mt-10 grid gap-4">{messages.length === 0 ? <Card className="p-7 text-slate-400">No messages yet.</Card> : messages.map((message) => <Card key={message.id} className="p-7"><div className="flex flex-col justify-between gap-2 sm:flex-row"><div><h2 className="text-lg font-semibold text-white">{message.subject}</h2><p className="mt-1 text-sm text-slate-400">{message.name} · {message.email}{message.company ? ` · ${message.company}` : ""}</p></div><time className="text-xs text-slate-500">{message.createdAt}</time></div><p className="mt-5 whitespace-pre-wrap leading-7 text-slate-300">{message.message}</p></Card>)}</div></div></main>;
}
