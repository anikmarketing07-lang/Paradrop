"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Check, X, Loader2, RefreshCw } from "lucide-react";

type Payment = {
  userId: string;
  userName: string;
  email?: string;
  plan: string;
  interval: string;
  amount: number;
  txnId: string;
  submittedAt: string;
};

export default function AdminPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/approve");
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      const data = await res.json();
      setPayments(data.pending || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function act(p: Payment, action: "approve" | "reject") {
    setActing(p.txnId);
    try {
      await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: p.userId, txnId: p.txnId, action }),
      });
      setPayments((prev) => prev.filter((x) => x.txnId !== p.txnId));
    } catch {
      alert("Failed");
    } finally {
      setActing(null);
    }
  }

  if (forbidden) {
    return (
      <div className="min-h-screen bg-[#050509] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access denied</h1>
          <p className="text-white/40 text-sm">Admin only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050509] text-white">
      <nav className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Zap size={12} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm">LeadDrop Admin</span>
        </Link>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">Pending UPI payments</h1>
        <p className="text-white/40 text-sm mb-8">Verify in your UPI app, then approve to activate the user&apos;s plan.</p>

        {loading ? (
          <div className="flex items-center gap-2 text-white/40 text-sm py-12 justify-center">
            <Loader2 size={16} className="animate-spin" /> Loading...
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <p className="text-sm">No pending payments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.txnId} className="gradient-border p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-white">{p.userName}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full">
                      {p.plan} · {p.interval}
                    </span>
                  </div>
                  <div className="text-xs text-white/40">{p.email}</div>
                  <div className="text-xs text-white/40 mt-1">
                    Txn: <span className="font-mono text-white/70">{p.txnId}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-white">₹{p.amount.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-white/30">{new Date(p.submittedAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => act(p, "approve")}
                    disabled={acting === p.txnId}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
                  >
                    {acting === p.txnId ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    Approve
                  </button>
                  <button
                    onClick={() => act(p, "reject")}
                    disabled={acting === p.txnId}
                    className="flex items-center gap-1 bg-white/[0.06] hover:bg-red-500/20 text-white/60 hover:text-red-400 px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
                  >
                    <X size={12} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
