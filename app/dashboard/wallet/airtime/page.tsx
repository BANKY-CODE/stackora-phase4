"use client";

import { useState } from "react";
import { Smartphone, Wifi, Check } from "lucide-react";

type Tab = "airtime" | "data";

const networks = [
  { id: "mtn", label: "MTN", color: "#FFC107", bg: "bg-yellow-400/10 border-yellow-400/20" },
  { id: "airtel", label: "Airtel", color: "#FF0000", bg: "bg-red-500/10 border-red-500/20" },
  { id: "glo", label: "Glo", color: "#00AA00", bg: "bg-green-500/10 border-green-500/20" },
  { id: "9mobile", label: "9mobile", color: "#00AA66", bg: "bg-emerald-500/10 border-emerald-500/20" },
];

const airtimeAmounts = [100, 200, 500, 1000, 2000, 5000];

const dataPlans: Record<string, { size: string; price: number; validity: string }[]> = {
  mtn: [
    { size: "100MB", price: 100, validity: "1 day" },
    { size: "500MB", price: 300, validity: "7 days" },
    { size: "1GB", price: 500, validity: "30 days" },
    { size: "2GB", price: 900, validity: "30 days" },
    { size: "5GB", price: 1500, validity: "30 days" },
    { size: "10GB", price: 3000, validity: "30 days" },
    { size: "20GB", price: 5000, validity: "30 days" },
    { size: "50GB", price: 10000, validity: "30 days" },
  ],
  airtel: [
    { size: "200MB", price: 200, validity: "7 days" },
    { size: "1GB", price: 500, validity: "30 days" },
    { size: "3GB", price: 1000, validity: "30 days" },
    { size: "6GB", price: 1500, validity: "30 days" },
    { size: "10GB", price: 2500, validity: "30 days" },
    { size: "25GB", price: 6000, validity: "30 days" },
  ],
  glo: [
    { size: "150MB", price: 100, validity: "3 days" },
    { size: "1GB", price: 500, validity: "30 days" },
    { size: "2.5GB", price: 1000, validity: "30 days" },
    { size: "5GB", price: 2000, validity: "30 days" },
    { size: "12GB", price: 3000, validity: "30 days" },
  ],
  "9mobile": [
    { size: "500MB", price: 200, validity: "30 days" },
    { size: "1.5GB", price: 500, validity: "30 days" },
    { size: "3GB", price: 1000, validity: "30 days" },
    { size: "7GB", price: 2000, validity: "30 days" },
    { size: "15GB", price: 4000, validity: "30 days" },
  ],
};

export default function AirtimeDataPage() {
  const [tab, setTab] = useState<Tab>("airtime");
  const [network, setNetwork] = useState("mtn");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<typeof dataPlans.mtn[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  };

  const resetForm = () => {
    setSuccess(false);
    setPhone("");
    setAmount("");
    setSelectedPlan(null);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {tab === "airtime" ? "Airtime Sent!" : "Data Activated!"}
        </h2>
        <p className="text-gray-400 mb-1">
          {tab === "airtime"
            ? `₦${parseFloat(amount).toLocaleString()} airtime`
            : `${selectedPlan?.size} data bundle`}
          {" "}sent to
        </p>
        <p className="text-[#00D4AA] font-semibold text-lg mb-8">{phone}</p>
        <button onClick={resetForm} className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl transition-colors">
          Buy Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Airtime & Data</h1>
        <p className="text-gray-400 text-sm mt-1">Top up airtime or buy data bundles instantly</p>
      </div>

      {/* Tab */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-1 flex gap-1">
        {(["airtime", "data"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelectedPlan(null); setAmount(""); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              tab === t ? "bg-[#00D4AA] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            {t === "airtime" ? <Smartphone size={15} /> : <Wifi size={15} />}
            {t === "airtime" ? "Airtime" : "Data Bundle"}
          </button>
        ))}
      </div>

      {/* Network Selection */}
      <div>
        <label className="text-sm font-medium text-gray-300 block mb-2">Select Network</label>
        <div className="grid grid-cols-4 gap-2">
          {networks.map(n => (
            <button
              key={n.id}
              onClick={() => { setNetwork(n.id); setSelectedPlan(null); }}
              className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                network === n.id ? n.bg : "bg-[#111827] border-white/10 hover:border-white/20"
              }`}
              style={{ color: network === n.id ? n.color : "#9CA3AF" }}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label className="text-sm font-medium text-gray-300 block mb-1.5">Phone Number</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+234</span>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
            placeholder="08012345678"
            className="w-full bg-[#111827] border border-white/10 rounded-xl pl-14 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors font-mono"
          />
        </div>
        <div className="flex gap-2 mt-2">
          {["08012345678", "07098765432"].map(n => (
            <button key={n} onClick={() => setPhone(n)} className="text-xs text-[#00D4AA] bg-[#00D4AA]/10 px-3 py-1 rounded-full hover:bg-[#00D4AA]/20 transition-colors">
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Airtime Amount */}
      {tab === "airtime" && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300 block">Amount</label>
          <div className="grid grid-cols-3 gap-2">
            {airtimeAmounts.map(a => (
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
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₦</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Custom amount"
              className="w-full bg-[#111827] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors text-sm"
            />
          </div>
        </div>
      )}

      {/* Data Plans */}
      {tab === "data" && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300 block">Select Data Plan</label>
          <div className="grid grid-cols-2 gap-2">
            {(dataPlans[network] || []).map((plan, i) => (
              <button
                key={i}
                onClick={() => setSelectedPlan(plan)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedPlan === plan
                    ? "border-[#00D4AA] bg-[#00D4AA]/5"
                    : "border-white/10 bg-[#111827] hover:border-white/20"
                }`}
              >
                <p className={`text-base font-bold ${selectedPlan === plan ? "text-[#00D4AA]" : "text-white"}`}>{plan.size}</p>
                <p className="text-gray-400 text-xs mt-0.5">{plan.validity}</p>
                <p className={`text-sm font-semibold mt-2 ${selectedPlan === plan ? "text-[#00D4AA]" : "text-white"}`}>₦{plan.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary & Purchase */}
      {((tab === "airtime" && amount && parseFloat(amount) > 0) || (tab === "data" && selectedPlan)) && phone.length >= 10 && (
        <div className="bg-[#111827] border border-white/5 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Network</span><span className="text-white capitalize">{network.toUpperCase()}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Phone</span><span className="text-white">{phone}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">{tab === "airtime" ? "Airtime" : "Plan"}</span>
            <span className="text-white">{tab === "airtime" ? `₦${parseFloat(amount).toLocaleString()}` : `${selectedPlan?.size} (${selectedPlan?.validity})`}</span>
          </div>
          <div className="flex justify-between border-t border-white/5 pt-2"><span className="text-gray-400">You pay</span>
            <span className="text-[#00D4AA] font-semibold">₦{tab === "airtime" ? parseFloat(amount).toLocaleString() : selectedPlan?.price.toLocaleString()}</span>
          </div>
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={loading || phone.length < 10 || (tab === "airtime" ? !amount || parseFloat(amount) < 50 : !selectedPlan)}
        className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        ) : (
          <>{tab === "airtime" ? <Smartphone size={18} /> : <Wifi size={18} />} Buy {tab === "airtime" ? "Airtime" : "Data"}</>
        )}
      </button>
    </div>
  );
}
