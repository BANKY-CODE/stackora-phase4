"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  Clock,
  Smartphone,
  Receipt,
} from "lucide-react";

const walletNav = [
  { href: "/dashboard/wallet", label: "Overview", icon: Wallet },
  { href: "/dashboard/wallet/fund", label: "Fund Wallet", icon: ArrowDownCircle },
  { href: "/dashboard/wallet/send", label: "Send Money", icon: ArrowUpCircle },
  { href: "/dashboard/wallet/withdraw", label: "Withdraw", icon: ArrowLeftRight },
  { href: "/dashboard/wallet/transactions", label: "Transactions", icon: Clock },
  { href: "/dashboard/wallet/airtime", label: "Airtime & Data", icon: Smartphone },
  { href: "/dashboard/wallet/bills", label: "Bill Payments", icon: Receipt },
];

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Top wallet nav bar */}
      <div className="border-b border-white/5 bg-[#0D1221]">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {walletNav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
