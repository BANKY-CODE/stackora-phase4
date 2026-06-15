"use client";

import { useState } from "react";
import { ArrowDownCircle, Copy, Check, CreditCard, Building2, Smartphone } from "lucide-react";

const fundMethods = [
  { id: "transfer", label: "Bank Transfer", icon: Building2, desc: "Transfer from any Nigerian bank" },
  { id: "card", label: "Debit Card", icon: CreditCard, desc: "Instant funding with your card" },
  { id: "ussd", label: "USSD", icon: Smartphone, desc: "Fund via *737# or *919#" },
];

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

export default function FundWalletPage() {
  const [method, setMethod] = useState("transfer");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"select" | "confirm" | "success">("select");

  const accountNumber = "9087654321";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFund = async () => {
    if (!amount || parseFloat(amount) < 100) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Initiated</h2>
        <p className="text-gray-400 mb-8">
          Your wallet will be credited once your payment of <span className="text-white font-semibold">₦{parseFloat(amount).toLocaleString()}</span> is confirmed.
        </p>
        <button
          onClick={() => { setStep("select"); setAmount(""); }}
          className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl transition-colors"
        >
          Fund Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Fund Wallet</h1>
        <p className="text-gray-400 text-sm mt-1">Add money to your Stackora wallet</p>
      </div>

      {/* Method Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Choose funding method</label>
        <div className="grid grid-cols-3 gap-2">
          {fundMethods.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setMethod(id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                method === id
                  ? "border-[#00D4AA] bg-[#00D4AA]/10"
                  : "border-white/10 bg-[#111827] hover:border-white/20"
              }`}
            >
              <Icon size={20} className={method === id ? "text-[#00D4AA]" : "text-gray-400"} />
              <p className={`text-xs font-medium mt-2 ${method === id ? "text-[#00D4AA]" : "text-white"}`}>{label}</p>
              <p className="text-gray-500 text-xs mt-0.5 hidden sm:block">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Bank Transfer Details */}
      {method === "transfer" && (
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 space-y-4">
          <p className="text-sm text-gray-400">Transfer to this dedicated account number:</p>
          <div className="bg-[#0A0E1A] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs mb-1">Account Number</p>
              <p className="text-2xl font-bold text-white tracking-widest">{accountNumber}</p>
              <p className="text-gray-400 text-sm mt-1">Providus Bank · Stackora/Chukwuemeka Obi</p>
            </div>
            <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 text-[#00D4AA] rounded-lg text-sm transition-colors">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="text-xs text-gray-500 space-y-1 border-t border-white/5 pt-3">
            <p>• Transfer any amount from any Nigerian bank</p>
            <p>• Your wallet is credited within 5 minutes</p>
            <p>• This account number is permanent and unique to you</p>
          </div>
        </div>
      )}

      {/* Card / Amount section */}
      {(method === "card" || method === "ussd") && (
        <div className="space-y-4">
          {/* Quick amounts */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Quick amounts</label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map(a => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    amount === String(a)
                      ? "border-[#00D4AA] bg-[#00D4AA]/10 text-[#00D4AA]"
                      : "border-white/10 bg-[#111827] text-gray-300 hover:border-white/20"
                  }`}
                >
                  ₦{a.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Or enter amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₦</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                min="100"
                className="w-full bg-[#111827] border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors"
              />
            </div>
            {amount && parseFloat(amount) < 100 && (
              <p className="text-red-400 text-xs mt-1">Minimum funding amount is ₦100</p>
            )}
          </div>

          {method === "ussd" && (
            <div className="bg-orange-400/5 border border-orange-400/20 rounded-xl p-4">
              <p className="text-orange-400 text-sm font-medium mb-2">USSD Instructions</p>
              <p className="text-gray-400 text-xs">Dial <span className="text-white font-mono">*737*2*{amount || "AMOUNT"}*9087654321#</span> on your mobile phone to fund your wallet.</p>
            </div>
          )}

          <button
            onClick={handleFund}
            disabled={!amount || parseFloat(amount) < 100 || loading}
            className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <ArrowDownCircle size={18} />
                Fund ₦{amount ? parseFloat(amount).toLocaleString() : "0"}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
