"use client";

import { useState } from "react";
import { ArrowUpCircle, Search, User, Check, ChevronRight } from "lucide-react";

type Step = "recipient" | "amount" | "confirm" | "success";

const recentRecipients = [
  { id: 1, name: "Emeka Obi", bank: "GTBank", account: "0123456789", initials: "EO" },
  { id: 2, name: "Amaka Nwosu", bank: "Access Bank", account: "0987654321", initials: "AN" },
  { id: 3, name: "Tunde Adeyemi", bank: "UBA", account: "1122334455", initials: "TA" },
];

const banks = [
  "Access Bank", "GTBank", "First Bank", "UBA", "Zenith Bank",
  "Fidelity Bank", "FCMB", "Wema Bank", "Stanbic IBTC", "Polaris Bank",
  "Ecobank", "Heritage Bank", "Keystone Bank", "Union Bank", "Sterling Bank",
];

export default function SendMoneyPage() {
  const [step, setStep] = useState<Step>("recipient");
  const [recipient, setRecipient] = useState({ name: "", bank: "", account: "", initials: "" });
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccountResolve = async () => {
    if (accountNumber.length !== 10 || !selectedBank) return;
    setResolving(true);
    await new Promise(r => setTimeout(r, 1200));
    setResolved(true);
    setResolving(false);
    setRecipient({ name: "Chidi Eze", bank: selectedBank, account: accountNumber, initials: "CE" });
  };

  const handleSend = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setStep("success");
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
        <p className="text-[#00D4AA] font-semibold text-lg mb-8">{recipient.name}</p>
        <div className="bg-[#111827] rounded-xl p-4 text-left space-y-3 mb-8 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Bank</span><span className="text-white">{recipient.bank}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Account</span><span className="text-white">{recipient.account}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Amount</span><span className="text-emerald-400 font-semibold">₦{parseFloat(amount).toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Reference</span><span className="text-white font-mono text-xs">STK{Date.now()}</span></div>
        </div>
        <button
          onClick={() => { setStep("recipient"); setAmount(""); setAccountNumber(""); setSelectedBank(""); setResolved(false); setRecipient({ name: "", bank: "", account: "", initials: "" }); }}
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
        <p className="text-gray-400 text-sm mt-1">Transfer funds to any Nigerian bank account</p>
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

      {/* Step 1: Recipient */}
      {step === "recipient" && (
        <div className="space-y-5">
          {/* Recent */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Recent recipients</label>
            <div className="space-y-2">
              {recentRecipients.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setRecipient(r); setStep("amount"); }}
                  className="w-full flex items-center gap-3 p-3.5 bg-[#111827] border border-white/5 rounded-xl hover:border-[#00D4AA]/30 transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] font-semibold text-sm">
                    {r.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{r.name}</p>
                    <p className="text-gray-500 text-xs">{r.bank} · {r.account}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-[#00D4AA] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-gray-500 text-xs">or enter new account</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* New account */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1.5">Select Bank</label>
              <select
                value={selectedBank}
                onChange={e => { setSelectedBank(e.target.value); setResolved(false); }}
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#00D4AA] transition-colors appearance-none"
              >
                <option value="" className="bg-[#111827]">Choose a bank</option>
                {banks.map(b => <option key={b} value={b} className="bg-[#111827]">{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1.5">Account Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={e => { setAccountNumber(e.target.value.replace(/\D/g, "")); setResolved(false); }}
                  placeholder="10-digit account number"
                  className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors font-mono"
                />
                <button
                  onClick={handleAccountResolve}
                  disabled={accountNumber.length !== 10 || !selectedBank || resolving}
                  className="px-4 py-3.5 bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 text-[#00D4AA] rounded-xl font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {resolving ? <div className="w-4 h-4 border-2 border-[#00D4AA]/30 border-t-[#00D4AA] rounded-full animate-spin" /> : <Search size={16} />}
                  Verify
                </button>
              </div>
            </div>

            {resolved && (
              <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-400/10 rounded-full flex items-center justify-center">
                  <User size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{recipient.name}</p>
                  <p className="text-gray-400 text-xs">{selectedBank}</p>
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
        </div>
      )}

      {/* Step 2: Amount */}
      {step === "amount" && (
        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] font-semibold text-sm">
              {recipient.initials}
            </div>
            <div>
              <p className="text-white font-medium">{recipient.name}</p>
              <p className="text-gray-500 text-xs">{recipient.bank} · {recipient.account}</p>
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
            <p className="text-gray-500 text-xs mt-1.5">Fee: ₦{parseFloat(amount) > 5000 ? "25.00" : "10.00"} · Balance: ₦284,500.00</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1.5">Narration (optional)</label>
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
              disabled={!amount || parseFloat(amount) < 100}
              className="flex-1 py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-40 text-black font-semibold rounded-xl transition-colors"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === "confirm" && (
        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-semibold">Transfer Summary</h3>
            {[
              { label: "To", value: recipient.name },
              { label: "Bank", value: recipient.bank },
              { label: "Account", value: recipient.account },
              { label: "Amount", value: `₦${parseFloat(amount).toLocaleString()}`, highlight: true },
              { label: "Fee", value: parseFloat(amount) > 5000 ? "₦25.00" : "₦10.00" },
              { label: "Total", value: `₦${(parseFloat(amount) + (parseFloat(amount) > 5000 ? 25 : 10)).toLocaleString()}`, bold: true },
              ...(narration ? [{ label: "Narration", value: narration }] : []),
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
