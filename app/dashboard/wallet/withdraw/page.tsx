"use client";

import { useState } from "react";
import { ArrowLeftRight, Plus, Check, Trash2 } from "lucide-react";

type Step = "amount" | "confirm" | "success";

const savedAccounts = [
  { id: 1, name: "Chukwuemeka Obi", bank: "GTBank", account: "0123456789", initials: "CO" },
  { id: 2, name: "Chukwuemeka Obi", bank: "First Bank", account: "3012345678", initials: "CO" },
];

export default function WithdrawPage() {
  const [step, setStep] = useState<Step>("amount");
  const [selectedAccount, setSelectedAccount] = useState(savedAccounts[0]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);

  const handleWithdraw = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setStep("success");
  };

  const walletBalance = 284500;
  const fee = parseFloat(amount) > 50000 ? 100 : parseFloat(amount) > 5000 ? 25 : 10;

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Withdrawal Successful</h2>
        <p className="text-gray-400 mb-2">
          <span className="text-white font-semibold">₦{parseFloat(amount).toLocaleString()}</span> is on its way to your account
        </p>
        <p className="text-[#00D4AA] font-medium">{selectedAccount.bank} · {selectedAccount.account}</p>
        <p className="text-gray-500 text-sm mt-2 mb-8">Settlement within 5–30 minutes</p>
        <button
          onClick={() => { setStep("amount"); setAmount(""); }}
          className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl transition-colors"
        >
          Withdraw Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
        <p className="text-gray-400 text-sm mt-1">Move money from your Stackora wallet to your bank</p>
      </div>

      {/* Balance pill */}
      <div className="inline-flex items-center gap-2 bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] px-4 py-2 rounded-full text-sm font-medium">
        <ArrowLeftRight size={14} />
        Available: ₦{walletBalance.toLocaleString()}
      </div>

      {step === "amount" && (
        <div className="space-y-5">
          {/* Saved accounts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Withdraw to</label>
              <button
                onClick={() => setShowAddAccount(!showAddAccount)}
                className="text-[#00D4AA] text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <Plus size={13} /> Add account
              </button>
            </div>
            <div className="space-y-2">
              {savedAccounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAccount(acc)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                    selectedAccount.id === acc.id
                      ? "border-[#00D4AA] bg-[#00D4AA]/5"
                      : "border-white/10 bg-[#111827] hover:border-white/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] font-semibold text-sm">
                    {acc.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{acc.name}</p>
                    <p className="text-gray-500 text-xs">{acc.bank} · {acc.account}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAccount.id === acc.id ? "border-[#00D4AA] bg-[#00D4AA]" : "border-white/20"
                  }`}>
                    {selectedAccount.id === acc.id && <Check size={10} className="text-black" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showAddAccount && (
            <div className="bg-[#111827] border border-white/10 rounded-xl p-4 space-y-3">
              <p className="text-white text-sm font-medium">Add New Account</p>
              <select className="w-full bg-[#0A0E1A] border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-[#00D4AA] transition-colors appearance-none">
                <option value="">Select bank</option>
                <option>GTBank</option><option>Access Bank</option><option>First Bank</option>
                <option>UBA</option><option>Zenith Bank</option><option>Fidelity Bank</option>
              </select>
              <input
                type="text"
                placeholder="Account number"
                maxLength={10}
                className="w-full bg-[#0A0E1A] border border-white/10 rounded-lg px-3 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] font-mono transition-colors"
              />
              <button className="w-full py-2.5 bg-[#00D4AA]/10 text-[#00D4AA] hover:bg-[#00D4AA]/20 rounded-lg text-sm font-medium transition-colors">
                Verify & Save Account
              </button>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1.5">Amount to withdraw</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₦</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                max={walletBalance}
                className="w-full bg-[#111827] border border-white/10 rounded-xl pl-9 pr-4 py-4 text-white text-xl font-semibold placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors"
              />
            </div>
            {amount && (
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-gray-500">Fee: ₦{fee}</span>
                {parseFloat(amount) > walletBalance && (
                  <span className="text-red-400">Insufficient balance</span>
                )}
              </div>
            )}
            <button
              onClick={() => setAmount(String(walletBalance - fee))}
              className="text-[#00D4AA] text-xs mt-1 hover:opacity-80 transition-opacity"
            >
              Withdraw all (₦{(walletBalance - fee).toLocaleString()})
            </button>
          </div>

          <button
            onClick={() => setStep("confirm")}
            disabled={!amount || parseFloat(amount) < 100 || parseFloat(amount) > walletBalance}
            className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-semibold">Withdrawal Summary</h3>
            {[
              { label: "To", value: selectedAccount.name },
              { label: "Bank", value: selectedAccount.bank },
              { label: "Account", value: selectedAccount.account },
              { label: "Amount", value: `₦${parseFloat(amount).toLocaleString()}`, highlight: true },
              { label: "Fee", value: `₦${fee}` },
              { label: "You'll receive", value: `₦${(parseFloat(amount) - fee).toLocaleString()}`, bold: true },
              { label: "Settlement", value: "5–30 minutes" },
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
              onClick={handleWithdraw}
              disabled={loading}
              className="flex-1 py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-60 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><ArrowLeftRight size={18} /> Withdraw Now</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
