"use client";

import Link from "next/link";
import { ChevronDown, Wallet as WalletIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { loadWallet } from "@/lib/wallet-store";
import { formatNaira } from "@/lib/utils";

export function WalletShortcut() {
  const [balance, setBalance] = useState(12400);

  useEffect(() => {
    const refresh = () => setBalance(loadWallet().balance);
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  return (
    <Link href="/wallet" className="hidden xs:flex items-center gap-2.5 rounded-input bg-white border border-cardBorder px-3.5 h-11 hover:bg-bg transition-colors">
      <span className="h-8 w-8 rounded-full bg-bg flex items-center justify-center"><WalletIcon size={15} className="text-navy" /></span>
      <div className="text-left leading-tight hidden sm:block"><p className="text-[11px] text-navy/50">Wallet balance</p><p className="font-mono text-sm font-semibold">{formatNaira(balance)}</p></div>
      <ChevronDown size={14} className="text-navy/40 hidden sm:block" />
    </Link>
  );
}
