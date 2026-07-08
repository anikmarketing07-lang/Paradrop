"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Mail, MousePointer, MessageSquare, ArrowUpRight, ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";

function StatCard({ icon: Icon, label, value, sub, color, iconColor }: {
  icon: React.ElementType; label: string; value: string | number; sub: string; color: string; iconColor: string;
}) {
  return (
    <div className="gradient-border p-5 bg-white shadow-sm shadow-[#08090A]/2">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={16} className={iconColor} />
      </div>
      <div className="text-2xl font-bold text-[#08090A] mb-0.5">{value}</div>
      <div className="text-xs text-[#08090A]/60">{label}</div>
      <div className="text-xs text-emerald-600 mt-1 flex items-center gap-0.5 font-medium">
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
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <div className="text-[#08090A]/40 text-sm">Loading...</div>
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
    }).catch(() => { });
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#08090A]">
      {/* Nav */}
      <nav className="border-b border-[#08090A]/10 px-6 py-3 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/paradrop-logo.png" alt="Paradrop" width={24} height={24} className="rounded-md object-cover" />
          <span className="font-bold text-sm text-[#08090A]">Paradrop</span>
        </Link>
        <div className="flex items-center gap-4 text-xs text-[#08090A]/60">
          <Link href="/app" className="hover:text-[#08090A] transition-colors flex items-center gap-1"><ArrowLeft size={12} /> Dashboard</Link>
          <Link href="/analytics" className="text-[#08090A] font-medium">Analytics</Link>
          <Link href="/pricing" className="hover:text-[#08090A] transition-colors">Upgrade</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#08090A]">Analytics</h1>
            <p className="text-[#08090A]/60 text-sm mt-0.5">Track your outreach performance</p>
          </div>
          <div className="flex items-center gap-1 bg-[#EEEDE7] border border-[#08090A]/10 rounded-lg p-0.5">
            {(["7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${range === r ? "bg-[#08090A] text-white" : "text-[#08090A]/60 hover:text-[#08090A]"
                  }`}
              >
                {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "All time"}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards — real data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Mail} label="Emails sent" value={stats?.emailCount ?? 0} sub={`This cycle`} color="bg-sky-500/10" iconColor="text-sky-600" />
          <StatCard icon={TrendingUp} label="Leads generated" value={stats?.leadCount ?? 0} sub={`Limit ${stats?.limit === Infinity ? "∞" : (stats?.limit ?? 20)}`} color="bg-emerald-500/10" iconColor="text-emerald-600" />
          <StatCard icon={MousePointer} label="Opens" value="—" sub="Tracking soon" color="bg-[#08090A]/5" iconColor="text-[#08090A]/60" />
          <StatCard icon={MessageSquare} label="Replies" value="—" sub="Tracking soon" color="bg-[#08090A]/5" iconColor="text-[#08090A]/60" />
        </div>

        <div className="gradient-border p-4 mb-6 flex items-start gap-3 bg-white">
          <TrendingUp size={16} className="text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs text-[#08090A]/70 leading-relaxed">
            <strong className="text-[#08090A]">Open / click / reply tracking coming soon.</strong> Switching from Gmail web link to API send (Resend) unlocks real-time tracking pixels and click redirects.
          </div>
        </div>

        <div className="gradient-border p-10 text-center bg-white shadow-sm shadow-[#08090A]/2">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={20} className="text-sky-600" />
          </div>
          <h3 className="font-semibold text-[#08090A] text-base mb-1">Detailed funnel & charts coming soon</h3>
          <p className="text-[#08090A]/60 text-sm max-w-md mx-auto">
            Track opens, clicks, and replies once we switch to API-based email sending. For now, your sent and lead counts above are live.
          </p>
        </div>

      </div>
    </div>
  );
}
