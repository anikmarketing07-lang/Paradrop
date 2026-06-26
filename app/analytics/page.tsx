"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, TrendingUp, Mail, MousePointer, MessageSquare, ArrowUpRight, ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub: string; color: string;
}) {
  return (
    <div className="gradient-border p-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-white/40">{label}</div>
      <div className="text-xs text-emerald-400 mt-1 flex items-center gap-0.5">
        <ArrowUpRight size={10} /> {sub}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/sign-in";
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0b1220] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    );
  }

  return <AnalyticsContent />;
}

function AnalyticsContent() {
  const [range, setRange] = useState<"7d" | "30d" | "all">("7d");
  const [stats, setStats] = useState<{ leadCount: number; emailCount: number; plan: string; limit: number } | null>(null);

  useEffect(() => {
    fetch("/api/usage").then((r) => r.json()).then((data) => {
      setStats({
        leadCount: data.leadCount ?? 0,
        emailCount: data.emailCount ?? 0,
        plan: data.plan ?? "free",
        limit: data.limit ?? 20,
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* Nav */}
      <nav className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-600 flex items-center justify-center">
            <Zap size={12} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm">Paradrop</span>
        </Link>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <Link href="/app" className="hover:text-white transition-colors flex items-center gap-1"><ArrowLeft size={12}/> Dashboard</Link>
          <Link href="/analytics" className="text-white font-medium">Analytics</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Upgrade</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-white/40 text-sm mt-0.5">Track your outreach performance</p>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-lg p-0.5">
            {(["7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  range === r ? "bg-sky-600 text-white" : "text-white/40 hover:text-white"
                }`}
              >
                {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "All time"}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards — real data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Mail} label="Emails sent" value={stats?.emailCount ?? 0} sub={`This cycle`} color="bg-sky-600/20 border border-sky-600/20" />
          <StatCard icon={TrendingUp} label="Leads generated" value={stats?.leadCount ?? 0} sub={`Limit ${stats?.limit === Infinity ? "∞" : (stats?.limit ?? 20)}`} color="bg-emerald-600/20 border border-emerald-600/20" />
          <StatCard icon={MousePointer} label="Opens" value="—" sub="Tracking soon" color="bg-white/[0.05] border border-white/[0.06]" />
          <StatCard icon={MessageSquare} label="Replies" value="—" sub="Tracking soon" color="bg-white/[0.05] border border-white/[0.06]" />
        </div>

        <div className="gradient-border p-4 mb-6 flex items-start gap-3">
          <TrendingUp size={16} className="text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs text-white/60 leading-relaxed">
            <strong className="text-white">Open / click / reply tracking coming soon.</strong> Switching from Gmail web link to API send (Resend) unlocks real-time tracking pixels and click redirects.
          </div>
        </div>

        <div className="gradient-border p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={20} className="text-sky-400" />
          </div>
          <h3 className="font-semibold text-white text-base mb-1">Detailed funnel & charts coming soon</h3>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Track opens, clicks, and replies once we switch to API-based email sending. For now, your sent and lead counts above are live.
          </p>
        </div>

      </div>
    </div>
  );
}
