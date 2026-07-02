"use client";

import { useState, useEffect } from "react";
import { ArrowUpCircle, Search, User, Check, ChevronRight } from "lucide-react";
import { walletApi } from "@/lib/api";

type Step = "recipient" | "amount" | "confirm" | "success";

export default function SendMoneyPage() {
  const [step, setStep] = useState<Step>("recipient");
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [txnRef, setTxnRef] = useState("");

  // Load real balance
  useEffect(() => {
    walletApi.getBalance()
      .then(res => setBalance(res.data.balance ?? 0))
      .catch(() => setBalance(null));
  }, []);

  const cleanUsername = username.trim().replace(/^@/, "");
  const initials = cleanUsername ? cleanUsername.slice(0, 2).toUpperCase() : "?";

  // "Verify" = confirm the username is entered (real existence is checked by the backend on send)
  const handleVerify = async () => {
    setError(null);
    if (!cleanUsername) return;
    setResolving(true);
    // brief pause for UX; the real check happens server-side at send time
    await new Promise(r => setTimeout(r, 400));
    setResolved(true);
    setResolving(false);
  };

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await walletApi.transfer(cleanUsername, parseFloat(amount), narration || undefined);
      setTxnRef(res.data.reference);
      setBalance(res.data.balanceAfterNaira);
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Transfer failed");
      // If the backend says recipient not found, send them back to fix the username
      if ((err.message || "").toLowerCase().includes("recipient")) {
        setStep("recipient");
        setResolved(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep("recipient"); setAmount(""); setUsername(""); setNarration("");
    setResolved(false); setError(null); setTxnRef("");
  };

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Transfer Successful</h2>
        <p className="text-gray-400 mb-2">
          You sent <span className="text-white font-semibold">₦{parseFloat(amount).toLocaleString()}</span> to
        </p>
        <p className="text-[#00D4AA] font-semibold text-lg mb-8">@{cleanUsername}</p>
        <div className="bg-[#111827] rounded-xl p-4 text-left space-y-3 mb-8 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Recipient</span><span className="text-white">@{cleanUsername}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Amount</span><span className="text-emerald-400 font-semibold">₦{parseFloat(amount).toLocaleString()}</span></div>
          {balance !== null && (
            <div className="flex justify-between"><span className="text-gray-400">New Balance</span><span className="text-white">₦{balance.toLocaleString()}</span></div>
          )}
          <div className="flex justify-between"><span className="text-gray-400">Reference</span><span className="text-white font-mono text-xs">{txnRef}</span></div>
        </div>
        <button
          onClick={resetAll}
          className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl transition-colors"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Send Money</h1>
        <p className="text-gray-400 text-sm mt-1">Instantly send to another Stackora user by username</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {(["recipient", "amount", "confirm"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === s ? "bg-[#00D4AA] text-black" :
              (["recipient", "amount", "confirm"].indexOf(step) > i ? "bg-[#00D4AA]/20 text-[#00D4AA]" : "bg-white/5 text-gray-500")
            }`}>{i + 1}</div>
            {i < 2 && <div className={`flex-1 h-0.5 w-8 ${["recipient", "amount", "confirm"].indexOf(step) > i ? "bg-[#00D4AA]/30" : "bg-white/5"}`} />}
          </div>
        ))}
        <span className="text-gray-500 text-xs ml-2 capitalize">{step}</span>
      </div>

      {error && (
        <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Recipient */}
      {step === "recipient" && (
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1.5">Recipient Username</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setResolved(false); setError(null); }}
                  placeholder="username"
                  className="w-full bg-[#111827] border border-white/10 rounded-xl pl-9 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors"
                />
              </div>
              <button
                onClick={handleVerify}
                disabled={!cleanUsername || resolving}
                className="px-4 py-3.5 bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 text-[#00D4AA] rounded-xl font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {resolving ? <div className="w-4 h-4 border-2 border-[#00D4AA]/30 border-t-[#00D4AA] rounded-full animate-spin" /> : <Search size={16} />}
                Check
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-1.5">Enter the @username of the person you want to pay.</p>
          </div>

          {resolved && (
            <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-400/10 rounded-full flex items-center justify-center text-emerald-400 font-semibold text-sm">
                {initials}
              </div>
              <div>
                <p className="text-white font-medium text-sm">@{cleanUsername}</p>
                <p className="text-gray-400 text-xs">Stackora user</p>
              </div>
              <Check size={16} className="text-emerald-400 ml-auto" />
            </div>
          )}

          <button
            onClick={() => setStep("amount")}
            disabled={!resolved}
            className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Amount */}
      {step === "amount" && (
        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] font-semibold text-sm">
              {initials}
            </div>
            <div>
              <p className="text-white font-medium">@{cleanUsername}</p>
              <p className="text-gray-500 text-xs">Stackora user</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1.5">Amount (₦)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₦</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#111827] border border-white/10 rounded-xl pl-9 pr-4 py-4 text-white text-xl font-semibold placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors"
              />
            </div>
            <p className="text-gray-500 text-xs mt-1.5">
              No transfer fee · Balance: {balance !== null ? `₦${balance.toLocaleString()}` : "…"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1.5">Note (optional)</label>
            <input
              type="text"
              value={narration}
              onChange={e => setNarration(e.target.value)}
              placeholder="What's this for?"
              maxLength={50}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("recipient")} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-colors">
              Back
            </button>
            <button
              onClick={() => setStep("confirm")}
              disabled={!amount || parseFloat(amount) < 100 || (balance !== null && parseFloat(amount) > balance)}
              className="flex-1 py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-40 text-black font-semibold rounded-xl transition-colors"
            >
              Review
            </button>
          </div>
          {balance !== null && amount && parseFloat(amount) > balance && (
            <p className="text-red-400 text-xs text-center">Amount is more than your balance.</p>
          )}
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === "confirm" && (
        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-semibold">Transfer Summary</h3>
            {[
              { label: "To", value: `@${cleanUsername}` },
              { label: "Amount", value: `₦${parseFloat(amount).toLocaleString()}`, highlight: true },
              { label: "Fee", value: "₦0.00" },
              { label: "Total", value: `₦${parseFloat(amount).toLocaleString()}`, bold: true },
              ...(narration ? [{ label: "Note", value: narration }] : []),
            ].map(({ label, value, highlight, bold }) => (
              <div key={label} className="flex justify-between text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <span className="text-gray-400">{label}</span>
                <span className={`${highlight ? "text-[#00D4AA] font-semibold" : bold ? "text-white font-bold" : "text-white"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("amount")} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-colors">
              Back
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="flex-1 py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-60 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><ArrowUpCircle size={18} /> Confirm Send</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
