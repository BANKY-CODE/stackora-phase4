"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  Smartphone,
  Receipt,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from "lucide-react";

const quickActions = [
  { href: "/dashboard/wallet/fund", label: "Fund", icon: ArrowDownCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { href: "/dashboard/wallet/send", label: "Send", icon: ArrowUpCircle, color: "text-blue-400", bg: "bg-blue-400/10" },
  { href: "/dashboard/wallet/withdraw", label: "Withdraw", icon: ArrowLeftRight, color: "text-purple-400", bg: "bg-purple-400/10" },
  { href: "/dashboard/wallet/airtime", label: "Airtime", icon: Smartphone, color: "text-orange-400", bg: "bg-orange-400/10" },
  { href: "/dashboard/wallet/bills", label: "Bills", icon: Receipt, color: "text-pink-400", bg: "bg-pink-400/10" },
];

const recentTxns = [
  { id: 1, type: "credit", desc: "Wallet Funding", amount: 50000, time: "2 mins ago", status: "success" },
  { id: 2, type: "debit", desc: "Transfer to Emeka Obi", amount: 15000, time: "1 hour ago", status: "success" },
  { id: 3, type: "debit", desc: "MTN Airtime", amount: 2000, time: "3 hours ago", status: "success" },
  { id: 4, type: "debit", desc: "EKEDC Electricity", amount: 8500, time: "Yesterday", status: "success" },
  { id: 5, type: "credit", desc: "Payment Received", amount: 25000, time: "Yesterday", status: "success" },
];

export default function WalletOverviewPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Wallet</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your funds, transfers and payments</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Balance */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#00D4AA]/20 to-[#0066FF]/10 border border-[#00D4AA]/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#00D4AA]">
              <Wallet size={18} />
              <span className="text-sm font-medium">Main Balance</span>
            </div>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <div className="mb-6">
            <p className="text-4xl font-bold text-white tracking-tight">
              {balanceVisible ? "₦ 284,500.00" : "₦ ••••••"}
            </p>
            <p className="text-gray-400 text-sm mt-1">Available balance</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-emerald-400">
              <TrendingUp size={14} />
              +₦75,000 this month
            </span>
            <span className="text-gray-500">|</span>
            <span className="flex items-center gap-1 text-red-400">
              <TrendingDown size={14} />
              -₦25,500 spent
            </span>
          </div>
        </div>

        {/* Ledger Balance */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-2">Ledger Balance</p>
            <p className="text-2xl font-bold text-white">
              {balanceVisible ? "₦ 284,500.00" : "₦ ••••••"}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-gray-400 text-xs">Total Transactions</p>
            <p className="text-white font-semibold text-lg mt-0.5">48</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-semibold mb-3">Quick Actions</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {quickActions.map(({ href, label, icon: Icon, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 min-w-[80px] group"
            >
              <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                <Icon size={22} className={color} />
              </div>
              <span className="text-gray-400 text-xs font-medium group-hover:text-white transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Recent Transactions</h2>
          <Link href="/dashboard/wallet/transactions" className="text-[#00D4AA] text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
          {recentTxns.map((txn, i) => (
            <div key={txn.id} className={`flex items-center justify-between px-5 py-4 hover:bg-white/2 transition-colors ${i < recentTxns.length - 1 ? "border-b border-white/5" : ""}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === "credit" ? "bg-emerald-400/10" : "bg-red-400/10"}`}>
                  {txn.type === "credit"
                    ? <ArrowDownCircle size={18} className="text-emerald-400" />
                    : <ArrowUpCircle size={18} className="text-red-400" />
                  }
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{txn.desc}</p>
                  <p className="text-gray-500 text-xs">{txn.time}</p>
                </div>
              </div>
              <span className={`font-semibold text-sm ${txn.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                {txn.type === "credit" ? "+" : "-"}₦{txn.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
