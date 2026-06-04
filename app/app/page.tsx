"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Zap, Send, Loader2, CheckCircle, BarChart2, Crown } from "lucide-react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

type Lead = {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  industry: string;
  location: string;
  verified: boolean;
  selected: boolean;
  generatedEmail?: string;
  emailSubject?: string;
  status?: "idle" | "generating" | "done" | "sent";
};

const niches = [
  "Shopify agencies",
  "SaaS startups (Series A)",
  "Marketing agencies",
  "E-commerce brands",
  "Real estate companies",
  "Healthcare startups",
  "Web design studios",
  "Fintech companies",
];

export default function AppDashboard() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/sign-in";
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#08080f] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    );
  }

  return <AppDashboardContent />;
}

function AppDashboardContent() {
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "leads" | "compose">("search");
  const [yourSkill, setYourSkill] = useState("");
  const [yourName, setYourName] = useState("");
  const [usage, setUsage] = useState<{ plan: string; limit: number; leadCount: number } | null>(null);

  useEffect(() => {
    fetch("/api/usage").then((r) => r.json()).then(setUsage).catch(() => {});
  }, []);

  const selectedNiche = customNiche || niche;
  const selectedLeads = leads.filter((l) => l.selected);

  async function findLeads() {
    if (!selectedNiche) return;
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: selectedNiche }),
      });
      const data = await res.json();
      if (data.limitReached) {
        if (confirm(`${data.error}\n\nUpgrade to Pro for 500 leads/month?`)) {
          window.location.href = "/pricing";
        }
        return;
      }
      if (!data.leads || data.leads.length === 0) {
        alert(data.error || "No leads found. Try a different niche.");
        return;
      }
      setLeads(data.leads.map((l: Omit<Lead, "selected" | "status">) => ({ ...l, selected: true, status: "idle" })));
      setActiveTab("leads");
      // Refresh usage
      fetch("/api/usage").then((r) => r.json()).then(setUsage).catch(() => {});
    } catch {
      alert("Failed to fetch leads. Check your API key.");
    } finally {
      setLoading(false);
    }
  }

  async function generateEmail(leadId: string) {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: "generating" } : l));
    try {
      const res = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, yourSkill, yourName }),
      });
      const data = await res.json();
      setLeads((prev) => prev.map((l) =>
        l.id === leadId ? { ...l, status: "done", generatedEmail: data.email, emailSubject: data.subject } : l
      ));
    } catch {
      setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: "idle" } : l));
    }
  }

  async function generateAllEmails() {
    setGeneratingAll(true);
    setActiveTab("compose");
    for (const lead of selectedLeads) {
      if (lead.status === "idle") {
        await generateEmail(lead.id);
      }
    }
    setGeneratingAll(false);
  }

  function toggleLead(id: string) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, selected: !l.selected } : l));
  }

  function markSent(id: string) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: "sent" } : l));
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Top bar */}
      <nav className="border-b border-white/[0.06] bg-[#08080f]/90 backdrop-blur-xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
            <Zap size={12} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm">LeadDrop</span>
        </Link>
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-lg p-0.5">
          {(["search", "leads", "compose"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                activeTab === tab
                  ? "bg-violet-600 text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {tab === "leads" ? `Leads ${leads.length > 0 ? `(${leads.length})` : ""}` : tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {usage && (
            <div className="text-xs text-white/50 hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1.5 rounded-lg">
              <span className="font-semibold text-white">{usage.leadCount}</span>
              <span className="text-white/30">/</span>
              <span>{usage.limit === Infinity ? "∞" : usage.limit}</span>
              <span className="text-white/30">leads</span>
              <span className="text-[10px] uppercase tracking-wider text-violet-400 font-bold ml-1">{usage.plan}</span>
            </div>
          )}
          <Link href="/analytics" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
            <BarChart2 size={13} /> Analytics
          </Link>
          {usage?.plan === "free" && (
            <Link href="/pricing" className="flex items-center gap-1.5 text-xs bg-violet-600/10 border border-violet-600/20 text-violet-400 hover:bg-violet-600/20 px-2.5 py-1.5 rounded-lg transition-colors">
              <Crown size={12} /> Upgrade
            </Link>
          )}
          <UserButton />
        </div>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">

        {/* SEARCH TAB */}
        {activeTab === "search" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Find your leads</h1>
              <p className="text-white/40 text-sm">Tell us who to target. AI finds verified contacts.</p>
            </div>

            {/* Your info */}
            <div className="gradient-border p-5 mb-4">
              <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-4">About you</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/50 block mb-1.5">Your name</label>
                  <input
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-violet-600/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 block mb-1.5">Your skill / service</label>
                  <input
                    value={yourSkill}
                    onChange={(e) => setYourSkill(e.target.value)}
                    placeholder="React developer, Brand designer..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-violet-600/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Niche selector */}
            <div className="gradient-border p-5 mb-4">
              <div className="text-xs text-white/40 uppercase tracking-wider font-medium mb-4">Target niche</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {niches.map((n) => (
                  <button
                    key={n}
                    onClick={() => { setNiche(n); setCustomNiche(""); }}
                    className={`text-left px-3 py-2.5 rounded-lg text-xs transition-all border ${
                      niche === n && !customNiche
                        ? "bg-violet-600/20 border-violet-600/40 text-violet-300"
                        : "bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white hover:border-white/[0.12]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <input
                value={customNiche}
                onChange={(e) => { setCustomNiche(e.target.value); setNiche(""); }}
                placeholder="Or type a custom niche..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-600/50 transition-colors"
              />
            </div>

            <button
              onClick={findLeads}
              disabled={loading || !selectedNiche}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-600/30"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Finding leads...</>
              ) : (
                <><Search size={16} /> Find 20 verified leads</>
              )}
            </button>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{leads.length} leads found</h2>
                <p className="text-white/40 text-xs mt-0.5">{selectedLeads.length} selected for outreach</p>
              </div>
              <button
                onClick={generateAllEmails}
                disabled={generatingAll || selectedLeads.length === 0}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                {generatingAll ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                Generate {selectedLeads.length} emails
              </button>
            </div>

            <div className="space-y-2">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className={`gradient-border p-4 flex items-center gap-4 transition-all ${
                    lead.selected ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={lead.selected}
                    onChange={() => toggleLead(lead.id)}
                    className="w-4 h-4 accent-violet-600 cursor-pointer"
                  />
                  <div className="w-9 h-9 rounded-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                    {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-white">{lead.name}</div>
                    <div className="text-xs text-white/40">{lead.role} · {lead.company}</div>
                  </div>
                  <div className="hidden md:block text-xs text-white/30">{lead.location}</div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full shrink-0">
                    <CheckCircle size={10} />
                    Verified
                  </div>
                  <button
                    onClick={() => generateEmail(lead.id)}
                    disabled={lead.status === "generating" || lead.status === "sent"}
                    className="text-xs text-violet-400 hover:text-violet-300 disabled:opacity-40 shrink-0 transition-colors"
                  >
                    {lead.status === "generating" ? <Loader2 size={14} className="animate-spin" /> :
                     lead.status === "done" ? "✓ Ready" :
                     lead.status === "sent" ? "✓ Sent" : "Generate"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPOSE TAB */}
        {activeTab === "compose" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold">Review & send</h2>
              <p className="text-white/40 text-xs mt-0.5">AI-written emails for each lead. Edit before sending.</p>
            </div>

            {leads.filter((l) => l.selected).length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <Mail size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No leads selected. Go back and select leads first.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.filter((l) => l.selected).map((lead) => (
                  <div key={lead.id} className="gradient-border p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-300">
                          {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{lead.name}</div>
                          <div className="text-xs text-white/40">{lead.email}</div>
                        </div>
                      </div>
                      {lead.status === "sent" ? (
                        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle size={10} /> Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(lead.email)}&su=${encodeURIComponent(lead.emailSubject || "")}&body=${encodeURIComponent(lead.generatedEmail || "")}`, "_blank");
                            markSent(lead.id);
                          }}
                          disabled={!lead.generatedEmail || lead.status === "generating"}
                          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        >
                          <Send size={12} />
                          Send via Gmail
                        </button>
                      )}
                    </div>

                    {lead.status === "generating" ? (
                      <div className="flex items-center gap-2 text-white/40 text-sm py-4">
                        <Loader2 size={14} className="animate-spin" />
                        Writing personalized email...
                      </div>
                    ) : lead.generatedEmail ? (
                      <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                        <div className="text-xs text-white/30 mb-1">Subject</div>
                        <div className="text-sm font-medium text-white mb-3">{lead.emailSubject}</div>
                        <div className="text-xs text-white/30 mb-1">Body</div>
                        <div className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{lead.generatedEmail}</div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <button
                          onClick={() => generateEmail(lead.id)}
                          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          Click to generate email →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
