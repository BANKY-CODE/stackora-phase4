"use client";

import { useState, useEffect } from "react";
import { ArrowUpCircle, Search, User, Check } from "lucide-react";
import { walletApi } from "@/lib/api";

type Step = "recipient" | "amount" | "confirm" | "success";

export default function SendMoneyPage() {
  const [step, setStep] = useState<Step>("recipient");
  const [accountNumber, setAccountNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [myAccount, setMyAccount] = useState<string | null>(null);
  const [txnRef, setTxnRef] = useState("");

  useEffect(() => {
    walletApi.getBalance()
      .then(res => { setBalance(res.data.balance ?? 0); setMyAccount(res.data.accountNumber); })
      .catch(() => {});
  }, []);

  const handleResolve = async () => {
    setError(null);
    if (accountNumber.length !== 10) return;
    setResolving(true);
    try {
      const res = await walletApi.resolveAccount(accountNumber);
      setRecipientName(res.data.name);
      setResolved(true);
    } catch (err: any) {
      setError(err.message || "Account number not found");
      setResolved(false);
      setRecipientName("");
    } finally {
      setResolving(false);
    }
  };

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await walletApi.transfer(accountNumber, parseFloat(amount), narration || undefined);
      setTxnRef(res.data.reference);
      setBalance(res.data.balanceAfterNaira);
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep("recipient"); setAmount(""); setAccountNumber(""); setNarration("");
    setResolved(false); setRecipientName(""); setError(null); setTxnRef("");
  };

  const initials = recipientName
    ? recipientName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

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
        <p className="text-[#00D4AA] font-semibold text-lg mb-8">{recipientName}</p>
        <div className="bg-[#111827] rounded-xl p-4 text-left space-y-3 mb-8 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Recipient</span><span className="text-white">{recipientName}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Account</span><span className="text-white font-mono">{accountNumber}</span></div>
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
        <p className="text-gray-400 text-sm mt-1">Send instantly to another Stackora account number</p>
        {myAccount && (
          <p className="text-gray-500 text-xs mt-2">
            Your account number: <span className="text-[#00D4AA] font-mono font-semibold">{myAccount}</span>
          </p>
        )}
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

      {/* Step 1: Recipient account number */}
      {step === "recipient" && (
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1.5">Recipient Account Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={accountNumber}
                onChange={e => { setAccountNumber(e.target.value.replace(/\D/g, "")); setResolved(false); setError(null); }}
                placeholder="10-digit account number"
                className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors font-mono"
              />
              <button
                onClick={handleResolve}
                disabled={accountNumber.length !== 10 || resolving}
                className="px-4 py-3.5 bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 text-[#00D4AA] rounded-xl font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {resolving ? <div className="w-4 h-4 border-2 border-[#00D4AA]/30 border-t-[#00D4AA] rounded-full animate-spin" /> : <Search size={16} />}
                Verify
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-1.5">Enter the recipient's 10-digit Stackora account number.</p>
          </div>

          {resolved && (
            <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-400/10 rounded-full flex items-center justify-center text-emerald-400 font-semibold text-sm">
                {initials}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{recipientName}</p>
                <p className="text-gray-400 text-xs font-mono">{accountNumber}</p>
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
              <p className="text-white font-medium">{recipientName}</p>
              <p className="text-gray-500 text-xs font-mono">{accountNumber}</p>
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
              { label: "To", value: recipientName },
              { label: "Account", value: accountNumber },
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
