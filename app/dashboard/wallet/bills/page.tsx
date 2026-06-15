"use client";

import { useState } from "react";
import { Zap, Tv, Droplets, Wifi, GraduationCap, Car, Check, ChevronRight } from "lucide-react";

const billCategories = [
  { id: "electricity", label: "Electricity", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  { id: "cable", label: "Cable TV", icon: Tv, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  { id: "water", label: "Water", icon: Droplets, color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20" },
  { id: "internet", label: "Internet", icon: Wifi, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  { id: "school", label: "School Fees", icon: GraduationCap, color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20" },
  { id: "vehicle", label: "Vehicle", icon: Car, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
];

const billers: Record<string, { id: string; name: string; desc?: string }[]> = {
  electricity: [
    { id: "ekedc", name: "EKEDC", desc: "Eko Electricity" },
    { id: "ikedc", name: "IKEDC", desc: "Ikeja Electric" },
    { id: "aedc", name: "AEDC", desc: "Abuja Electricity" },
    { id: "phedc", name: "PHEDC", desc: "Port Harcourt Electric" },
    { id: "eedc", name: "EEDC", desc: "Enugu Electricity" },
    { id: "kedco", name: "KEDCO", desc: "Kano Electricity" },
  ],
  cable: [
    { id: "dstv", name: "DSTV", desc: "MultiChoice" },
    { id: "gotv", name: "GOtv", desc: "MultiChoice" },
    { id: "startimes", name: "StarTimes", desc: "StarTimes Nigeria" },
  ],
  water: [
    { id: "lwsc", name: "Lagos Water Corporation" },
    { id: "fwsc", name: "FCT Water Board" },
  ],
  internet: [
    { id: "smile", name: "Smile 4G LTE" },
    { id: "spectranet", name: "Spectranet" },
    { id: "swift", name: "Swift Networks" },
    { id: "ipnx", name: "IPNX" },
  ],
  school: [
    { id: "unilag", name: "UNILAG" },
    { id: "ui", name: "University of Ibadan" },
    { id: "unn", name: "UNN" },
    { id: "abuad", name: "ABUAD" },
  ],
  vehicle: [
    { id: "lasg", name: "Lagos State Vehicle Licence" },
    { id: "frsc", name: "FRSC – Driver's Licence" },
  ],
};

const dstvPlans = [
  { name: "Padi", price: 2150 },
  { name: "Yanga", price: 3600 },
  { name: "Confam", price: 6200 },
  { name: "Compact", price: 10500 },
  { name: "Compact Plus", price: 16600 },
  { name: "Premium", price: 24500 },
];

type Step = "category" | "biller" | "details" | "confirm" | "success";

export default function BillPaymentsPage() {
  const [step, setStep] = useState<Step>("category");
  const [category, setCategory] = useState("");
  const [biller, setBiller] = useState<{ id: string; name: string } | null>(null);
  const [smartNumber, setSmartNumber] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null);
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 1200));
    setVerifying(false);
    setCustomerName("Chukwuemeka Obi");
  };

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setStep("success");
  };

  const payAmount = category === "cable" && selectedPlan ? selectedPlan.price : parseFloat(amount) || 0;

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-gray-400 mb-2">{biller?.name} bill paid</p>
        <p className="text-[#00D4AA] font-bold text-2xl mb-1">₦{payAmount.toLocaleString()}</p>
        <p className="text-gray-500 text-sm mb-8">Token/Confirmation will be sent to you via SMS</p>
        <button
          onClick={() => { setStep("category"); setCategory(""); setBiller(null); setSmartNumber(""); setSelectedPlan(null); setAmount(""); setCustomerName(""); }}
          className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] text-black font-semibold rounded-xl transition-colors"
        >
          Pay Another Bill
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Bill Payments</h1>
        <p className="text-gray-400 text-sm mt-1">Pay electricity, cable TV, water and more</p>
      </div>

      {/* Breadcrumb */}
      {step !== "category" && (
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => { setStep("category"); setCategory(""); setBiller(null); setCustomerName(""); }} className="text-gray-500 hover:text-white transition-colors capitalize">{category}</button>
          {biller && <><ChevronRight size={14} className="text-gray-600" /><button onClick={() => { setStep("biller"); setBiller(null); setCustomerName(""); }} className="text-gray-500 hover:text-white transition-colors">{biller.name}</button></>}
          {step === "confirm" && <><ChevronRight size={14} className="text-gray-600" /><span className="text-[#00D4AA]">Review</span></>}
        </div>
      )}

      {/* Step: Category */}
      {step === "category" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {billCategories.map(({ id, label, icon: Icon, color, bg }) => (
            <button
              key={id}
              onClick={() => { setCategory(id); setStep("biller"); }}
              className={`p-5 rounded-2xl border flex flex-col items-center gap-3 hover:scale-105 transition-all ${bg}`}
            >
              <Icon size={28} className={color} />
              <span className="text-white text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step: Biller */}
      {step === "biller" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block mb-3">
            Select {category.charAt(0).toUpperCase() + category.slice(1)} provider
          </label>
          {(billers[category] || []).map(b => (
            <button
              key={b.id}
              onClick={() => { setBiller(b); setStep("details"); }}
              className="w-full flex items-center justify-between p-4 bg-[#111827] border border-white/5 rounded-xl hover:border-[#00D4AA]/30 transition-all group"
            >
              <div>
                <p className="text-white font-medium text-sm">{b.name}</p>
                {b.desc && <p className="text-gray-500 text-xs">{b.desc}</p>}
              </div>
              <ChevronRight size={16} className="text-gray-600 group-hover:text-[#00D4AA] transition-colors" />
            </button>
          ))}
        </div>
      )}

      {/* Step: Details */}
      {step === "details" && (
        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-3 flex items-center gap-3">
            {(() => { const c = billCategories.find(b => b.id === category); return c ? <c.icon size={18} className={c.color} /> : null; })()}
            <span className="text-white font-medium">{biller?.name}</span>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1.5">
              {category === "electricity" ? "Meter Number" : category === "cable" ? "Smart Card / IUC Number" : category === "internet" ? "Account Number" : "Reference Number"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={smartNumber}
                onChange={e => { setSmartNumber(e.target.value); setCustomerName(""); }}
                placeholder={category === "electricity" ? "Enter meter number" : "Enter number"}
                className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors font-mono"
              />
              <button
                onClick={handleVerify}
                disabled={smartNumber.length < 6 || verifying}
                className="px-4 py-3.5 bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 text-[#00D4AA] rounded-xl text-sm font-medium transition-colors disabled:opacity-40 flex items-center gap-2"
              >
                {verifying ? <div className="w-4 h-4 border-2 border-[#00D4AA]/30 border-t-[#00D4AA] rounded-full animate-spin" /> : "Verify"}
              </button>
            </div>
            {customerName && (
              <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
                <Check size={14} /> {customerName}
              </div>
            )}
          </div>

          {/* Cable TV plans */}
          {category === "cable" && customerName && (
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Select Package</label>
              <div className="grid grid-cols-2 gap-2">
                {(biller?.id === "dstv" ? dstvPlans : [{ name: "Basic", price: 1900 }, { name: "Classic", price: 3800 }, { name: "Super", price: 5700 }]).map(plan => (
                  <button
                    key={plan.name}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPlan?.name === plan.name
                        ? "border-[#00D4AA] bg-[#00D4AA]/5"
                        : "border-white/10 bg-[#111827] hover:border-white/20"
                    }`}
                  >
                    <p className={`text-sm font-medium ${selectedPlan?.name === plan.name ? "text-[#00D4AA]" : "text-white"}`}>{plan.name}</p>
                    <p className="text-gray-400 text-xs mt-1">₦{plan.price.toLocaleString()}/month</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Electricity amount */}
          {category !== "cable" && customerName && (
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1.5">Amount (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Minimum ₦500"
                  min="500"
                  className="w-full bg-[#111827] border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors"
                />
              </div>
              {category === "electricity" && amount && (
                <p className="text-gray-500 text-xs mt-1">
                  Estimated units: ~{Math.floor(parseFloat(amount) / 90)} kWh
                </p>
              )}
            </div>
          )}

          <button
            onClick={() => setStep("confirm")}
            disabled={!customerName || (category === "cable" ? !selectedPlan : !amount || parseFloat(amount) < 500)}
            className="w-full py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step: Confirm */}
      {step === "confirm" && (
        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-semibold">Payment Summary</h3>
            {[
              { label: "Provider", value: biller?.name || "" },
              { label: "Customer", value: customerName },
              { label: "Reference", value: smartNumber },
              ...(category === "cable" && selectedPlan ? [{ label: "Package", value: selectedPlan.name }] : []),
              { label: "Amount", value: `₦${payAmount.toLocaleString()}`, highlight: true },
              { label: "Fee", value: "₦100" },
              { label: "Total", value: `₦${(payAmount + 100).toLocaleString()}`, bold: true },
            ].map(({ label, value, highlight, bold }) => (
              <div key={label} className="flex justify-between text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <span className="text-gray-400">{label}</span>
                <span className={`${highlight ? "text-[#00D4AA] font-semibold" : bold ? "text-white font-bold" : "text-white"}`}>{value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("details")} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-colors">Back</button>
            <button
              onClick={handlePay}
              disabled={loading}
              className="flex-1 py-3.5 bg-[#00D4AA] hover:bg-[#00BF9A] disabled:opacity-60 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <>Pay ₦{(payAmount + 100).toLocaleString()}</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
