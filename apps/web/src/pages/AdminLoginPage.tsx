import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(""); setLoading(true);
    try { await api.login(email, password); navigate("/admin"); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Login failed"); }
    finally { setLoading(false); }
  };

  return <main className="grid min-h-screen place-items-center px-5"><Card className="w-full max-w-md p-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Private administration</p><h1 className="mt-3 text-3xl font-semibold text-white">Sign in</h1><form onSubmit={submit} className="mt-8 space-y-5"><label className="text-sm text-slate-300">Email<Input className="mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label className="text-sm text-slate-300">Password<Input className="mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <p className="text-sm text-rose-300">{error}</p>}<Button className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button></form></Card></main>;
}
