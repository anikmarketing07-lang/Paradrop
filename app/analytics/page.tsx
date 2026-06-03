"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, TrendingUp, Mail, MousePointer, MessageSquare, ArrowUpRight, ArrowLeft } from "lucide-react";

// Mock data — replace with real DB queries once you have a database
const mockStats = {
  totalSent: 147,
  opened: 89,
  clicked: 34,
  replied: 21,
  openRate: 60.5,
  replyRate: 14.3,
};

const mockActivity = [
  { name: "James Carter", company: "Pixel Studio", action: "replied", time: "2h ago", status: "replied" },
  { name: "Priya Sharma", company: "GrowthLab", action: "opened email", time: "4h ago", status: "opened" },
  { name: "Tom Nguyen", company: "Layr", action: "opened email", time: "6h ago", status: "opened" },
  { name: "Lisa Park", company: "BuildFast", action: "replied", time: "1d ago", status: "replied" },
  { name: "Marcus Bell", company: "TechFlow", action: "opened email", time: "1d ago", status: "opened" },
  { name: "Anika Patel", company: "Spark Agency", action: "sent", time: "2d ago", status: "sent" },
  { name: "Chris Wu", company: "NoCode Labs", action: "sent", time: "2d ago", status: "sent" },
  { name: "Rachel Kim", company: "Fold Studio", action: "replied", time: "3d ago", status: "replied" },
];

const weekData = [12, 19, 8, 24, 31, 18, 35];
const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxVal = Math.max(...weekData);

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
  const [range, setRange] = useState<"7d" | "30d" | "all">("7d");

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
            <Zap size={12} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm">LeadDrop</span>
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
                  range === r ? "bg-violet-600 text-white" : "text-white/40 hover:text-white"
                }`}
              >
                {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "All time"}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Mail} label="Emails sent" value={mockStats.totalSent} sub="+12 this week" color="bg-violet-600/20 border border-violet-600/20" />
          <StatCard icon={MousePointer} label="Opened" value={`${mockStats.openRate}%`} sub="Above average" color="bg-blue-600/20 border border-blue-600/20" />
          <StatCard icon={TrendingUp} label="Clicked" value={mockStats.clicked} sub="+5 this week" color="bg-emerald-600/20 border border-emerald-600/20" />
          <StatCard icon={MessageSquare} label="Replied" value={`${mockStats.replyRate}%`} sub="2x industry avg" color="bg-orange-600/20 border border-orange-600/20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bar chart */}
          <div className="lg:col-span-2 gradient-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-white text-sm">Emails sent</h3>
                <p className="text-white/40 text-xs">Last 7 days</p>
              </div>
              <div className="text-2xl font-bold text-white">147</div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {weekData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-violet-600/30 hover:bg-violet-600/50 transition-colors relative group"
                    style={{ height: `${(val / maxVal) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}
                    </div>
                  </div>
                  <span className="text-[10px] text-white/30">{weekLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel */}
          <div className="gradient-border p-6">
            <h3 className="font-semibold text-white text-sm mb-6">Conversion funnel</h3>
            <div className="space-y-3">
              {[
                { label: "Sent", val: 147, pct: 100, color: "bg-white/20" },
                { label: "Opened", val: 89, pct: 60.5, color: "bg-blue-500/50" },
                { label: "Clicked", val: 34, pct: 23.1, color: "bg-violet-500/50" },
                { label: "Replied", val: 21, pct: 14.3, color: "bg-emerald-500/50" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{item.label}</span>
                    <span className="text-white font-medium">{item.val} <span className="text-white/30">({item.pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div className="mt-4 gradient-border p-6">
          <h3 className="font-semibold text-white text-sm mb-4">Recent activity</h3>
          <div className="space-y-3">
            {mockActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-600/20 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                  {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white">{a.name}</span>
                  <span className="text-sm text-white/40"> · {a.company}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  a.status === "replied" ? "bg-emerald-400/10 text-emerald-400" :
                  a.status === "opened" ? "bg-blue-400/10 text-blue-400" :
                  "bg-white/[0.06] text-white/40"
                }`}>
                  {a.action}
                </span>
                <span className="text-xs text-white/20 shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
