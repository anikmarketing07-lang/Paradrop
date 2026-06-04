"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Key, CheckCircle, AlertCircle, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState("");
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<"ok" | "fail" | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Clear old keys from previous versions
    localStorage.removeItem("leaddrop_groq_key");
    localStorage.removeItem("leaddrop_apollo_key");
    setGeminiKey(localStorage.getItem("leaddrop_gemini_key") || "");
  }, []);

  function save() {
    localStorage.setItem("leaddrop_gemini_key", geminiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function testGemini() {
    if (!geminiKey) return;
    setTesting(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${geminiKey}` },
      });
      setStatus(res.ok ? "ok" : "fail");
    } catch {
      setStatus("fail");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <nav className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-600 flex items-center justify-center">
            <Zap size={12} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm">LeadDrop</span>
        </Link>
        <Link href="/app" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={12} /> Dashboard
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-white/40 text-sm mb-8">Connect your API key. Stored locally — never sent to our servers.</p>

        {/* Gemini */}
        <div className="gradient-border p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Key size={14} className="text-sky-400" />
                <span className="font-semibold text-sm">Groq API Key</span>
                <span className="text-[10px] bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium">FREE</span>
                {status === "ok" && <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle size={10} /> Connected</span>}
                {status === "fail" && <span className="flex items-center gap-1 text-xs text-red-400"><AlertCircle size={10} /> Invalid key</span>}
              </div>
              <p className="text-xs text-white/40">Powers lead generation + AI email writing. 100% free — works in India.</p>
            </div>
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors shrink-0">
              Get free key <ExternalLink size={10} />
            </a>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Paste your Gemini API key (AIza...)..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-sky-600/50 transition-colors font-mono"
            />
            <button
              onClick={testGemini}
              disabled={!geminiKey || testing}
              className="px-4 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs text-white/60 hover:text-white disabled:opacity-40 transition-colors shrink-0"
            >
              {testing ? <Loader2 size={12} className="animate-spin" /> : "Test"}
            </button>
          </div>
          <div className="mt-3 bg-white/[0.03] rounded-lg p-3 text-xs text-white/30">
            <span className="text-white/50 font-medium">How to get it:</span> console.groq.com â†’ Sign up free â†’ API Keys â†’ Create key â†’ Copy
          </div>
        </div>

        <button
          onClick={save}
          className="w-full bg-sky-600 hover:bg-sky-500 text-white py-3 rounded-lg font-semibold text-sm transition-all"
        >
          {saved ? "âœ“ Saved!" : "Save API key"}
        </button>

        <p className="text-center text-xs text-white/20 mt-4">
          Key stored in browser localStorage only. Never uploaded anywhere.
        </p>
      </div>
    </div>
  );
}
