"use client";

import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Search, Filter, Download, ChevronRight, X } from "lucide-react";

const allTransactions = [
  { id: "TXN001", type: "credit", desc: "Wallet Funding via Card", amount: 50000, date: "2024-01-15", time: "14:23", status: "success", category: "funding", ref: "STK1705329780" },
  { id: "TXN002", type: "debit", desc: "Transfer to Emeka Obi", amount: 15000, date: "2024-01-15", time: "12:05", status: "success", category: "transfer", ref: "STK1705321100" },
  { id: "TXN003", type: "debit", desc: "MTN Airtime", amount: 2000, date: "2024-01-15", time: "09:30", status: "success", category: "airtime", ref: "STK1705311000" },
  { id: "TXN004", type: "debit", desc: "EKEDC Electricity", amount: 8500, date: "2024-01-14", time: "18:45", status: "success", category: "bills", ref: "STK1705244700" },
  { id: "TXN005", type: "credit", desc: "Payment Received from Amaka", amount: 25000, date: "2024-01-14", time: "11:20", status: "success", category: "transfer", ref: "STK1705228200" },
  { id: "TXN006", type: "debit", desc: "Airtel Data Bundle 5GB", amount: 3500, date: "2024-01-13", time: "16:00", status: "success", category: "data", ref: "STK1705143600" },
  { id: "TXN007", type: "debit", desc: "DSTV Premium", amount: 24500, date: "2024-01-13", time: "10:15", status: "success", category: "bills", ref: "STK1705122900" },
  { id: "TXN008", type: "credit", desc: "Wallet Funding via Transfer", amount: 100000, date: "2024-01-12", time: "09:00", status: "success", category: "funding", ref: "STK1705054400" },
  { id: "TXN009", type: "debit", desc: "Withdrawal to GTBank", amount: 30000, date: "2024-01-11", time: "13:30", status: "success", category: "withdrawal", ref: "STK1704979800" },
  { id: "TXN010", type: "debit", desc: "Glo Airtime", amount: 500, date: "2024-01-11", time: "08:00", status: "failed", category: "airtime", ref: "STK1704952800" },
  { id: "TXN011", type: "debit", desc: "Transfer to Tunde Adeyemi", amount: 7500, date: "2024-01-10", time: "17:45", status: "success", category: "transfer", ref: "STK1704908700" },
  { id: "TXN012", type: "credit", desc: "Reversal - Failed Txn", amount: 500, date: "2024-01-10", time: "08:30", status: "success", category: "reversal", ref: "STK1704876600" },
];

const categoryColors: Record<string, string> = {
  funding: "text-emerald-400 bg-emerald-400/10",
  transfer: "text-blue-400 bg-blue-400/10",
  airtime: "text-orange-400 bg-orange-400/10",
  data: "text-purple-400 bg-purple-400/10",
  bills: "text-pink-400 bg-pink-400/10",
  withdrawal: "text-red-400 bg-red-400/10",
  reversal: "text-yellow-400 bg-yellow-400/10",
};

const filterOptions = ["All", "Credit", "Debit", "Funding", "Transfer", "Bills", "Airtime", "Withdrawal"];

export default function TransactionHistoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<typeof allTransactions[0] | null>(null);

  const filtered = allTransactions.filter(t => {
    const matchSearch = t.desc.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" ||
      (filter === "Credit" && t.type === "credit") ||
      (filter === "Debit" && t.type === "debit") ||
      t.category.toLowerCase() === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const totalCredit = filtered.filter(t => t.type === "credit" && t.status === "success").reduce((a, t) => a + t.amount, 0);
  const totalDebit = filtered.filter(t => t.type === "debit" && t.status === "success").reduce((a, t) => a + t.amount, 0);

  // Group by date
  const grouped = filtered.reduce<Record<string, typeof allTransactions>>((acc, t) => {
    const key = t.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const formatDate = (d: string) => {
    const date = new Date(d);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d === today.toISOString().split("T")[0]) return "Today";
    if (d === yesterday.toISOString().split("T")[0]) return "Yesterday";
    return date.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "short" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400 text-sm mt-1">{allTransactions.length} total transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-white/10 text-gray-300 hover:text-white rounded-xl text-sm transition-colors">
          <Download size={15} /> Export
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-400/5 border border-emerald-400/10 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Total Money In</p>
          <p className="text-emerald-400 font-bold text-lg">₦{totalCredit.toLocaleString()}</p>
        </div>
        <div className="bg-red-400/5 border border-red-400/10 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Total Money Out</p>
          <p className="text-red-400 font-bold text-lg">₦{totalDebit.toLocaleString()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full bg-[#111827] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4AA] transition-colors text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filterOptions.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === f
                ? "bg-[#00D4AA] text-black"
                : "bg-[#111827] border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, txns]) => (
            <div key={date}>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-3">{formatDate(date)}</p>
              <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
                {txns.map((txn, i) => (
                  <button
                    key={txn.id}
                    onClick={() => setSelected(txn)}
                    className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-white/2 transition-colors text-left ${i < txns.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${txn.type === "credit" ? "bg-emerald-400/10" : "bg-red-400/10"}`}>
                      {txn.type === "credit"
                        ? <ArrowDownCircle size={18} className="text-emerald-400" />
                        : <ArrowUpCircle size={18} className="text-red-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{txn.desc}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-500 text-xs">{txn.time}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[txn.category] || "text-gray-400 bg-gray-400/10"}`}>
                          {txn.category}
                        </span>
                        {txn.status === "failed" && (
                          <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">failed</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-semibold text-sm ${txn.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                        {txn.type === "credit" ? "+" : "-"}₦{txn.amount.toLocaleString()}
                      </p>
                      <ChevronRight size={14} className="text-gray-600 ml-auto mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Transaction Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selected.type === "credit" ? "bg-emerald-400/10" : "bg-red-400/10"}`}>
                {selected.type === "credit" ? <ArrowDownCircle size={22} className="text-emerald-400" /> : <ArrowUpCircle size={22} className="text-red-400" />}
              </div>
              <div>
                <p className="text-white font-medium">{selected.desc}</p>
                <p className={`text-xl font-bold ${selected.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                  {selected.type === "credit" ? "+" : "-"}₦{selected.amount.toLocaleString()}
                </p>
              </div>
            </div>
            {[
              { label: "Reference", value: selected.ref },
              { label: "Date", value: `${selected.date} ${selected.time}` },
              { label: "Category", value: selected.category },
              { label: "Status", value: selected.status },
              { label: "Type", value: selected.type },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className={`font-medium ${value === "failed" ? "text-red-400" : value === "success" ? "text-emerald-400" : "text-white"} capitalize`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
