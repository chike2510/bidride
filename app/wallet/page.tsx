"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Car, ChevronRight, CreditCard, Eye, Gift, LockKeyhole, Percent, Plus, Send, ShieldAlert, Star, XCircle } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GiftIllustration } from "@/components/illustrations/GiftIllustration";
import { defaultWallet, loadWallet, saveWallet, type WalletState } from "@/lib/wallet-store";
import { formatNaira, cn } from "@/lib/utils";

const quickActions = [
  { icon: Plus, label: "Add Money" },
  { icon: Send, label: "Send Money" },
  { icon: Percent, label: "Promo Code" },
  { icon: ShieldAlert, label: "Transaction Limits" },
];
const paymentMethods = [
  { type: "VISA", last4: "4242", isDefault: true },
  { type: "Mastercard", last4: "8888", isDefault: false },
  { type: "GTBank", last4: "1234", isDefault: false },
];
const transactionIcons = { ride: Car, topup: ArrowUpRight, bonus: Gift, refund: XCircle };

function iconForTransaction(label: string) {
  if (label.includes("Money added")) return transactionIcons.topup;
  if (label.includes("bonus")) return transactionIcons.bonus;
  if (label.includes("refund")) return transactionIcons.refund;
  return transactionIcons.ride;
}

function WalletContent() {
  const openMobileMenu = useMobileMenu();
  const [wallet, setWallet] = useState<WalletState>(defaultWallet);
  const [notice, setNotice] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("4242");

  useEffect(() => setWallet(loadWallet()), []);

  function addMoney() {
    const amount = 1000;
    const next = { ...wallet, balance: wallet.balance + amount, totalAdded: wallet.totalAdded + amount, transactions: [{ id: `topup-${Date.now()}`, label: "Money added via Card", date: "Just now", amount, status: "Successful" }, ...wallet.transactions] };
    setWallet(next);
    saveWallet(next);
    setNotice(`${formatNaira(amount)} added in preview mode.`);
  }

  function action(label: string) {
    if (label === "Add Money") addMoney();
    else setNotice(`${label} will open a secure payment flow when a provider is connected.`);
  }

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} title="Wallet" subtitle="Manage your balance and payments" />
      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6"><div className="flex flex-col gap-6"><Card className="p-6 sm:p-7 bg-navy border-navy text-white"><div className="flex items-center justify-between mb-1"><p className="text-white/60 text-sm flex items-center gap-1.5">Current balance <Eye size={14} /></p><Button variant="secondary" className="bg-white text-navy h-9 px-3.5" onClick={addMoney}><Plus size={14} /> Add money</Button></div><p className="font-mono text-4xl font-bold mb-1">{formatNaira(wallet.balance)}</p><p className="text-white/50 text-sm mb-5">Available to spend · preview wallet</p><div className="flex flex-wrap gap-6 pt-5 border-t border-white/10">{[{ label: "Total spent", value: formatNaira(wallet.totalSpent), color: "text-success" }, { label: "Total added", value: formatNaira(wallet.totalAdded), color: "text-white" }, { label: "Saved with BidRide", value: formatNaira(wallet.saved), color: "text-gold" }, { label: "Rewards earned", value: formatNaira(wallet.rewards), color: "text-gold" }].map((item) => <div key={item.label}><p className={cn("font-mono font-semibold", item.color)}>{item.value}</p><p className="text-white/40 text-xs">{item.label}</p></div>)}</div></Card>
        <div><div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Quick actions</h3><span className="text-xs text-navy/40">Preview mode</span></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{quickActions.map((item) => <button type="button" key={item.label} onClick={() => action(item.label)} className="bg-white rounded-card border border-cardBorder shadow-soft p-4 flex flex-col items-center gap-2 text-center cursor-pointer hover:-translate-y-1 transition-transform"><span className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center"><item.icon size={17} className="text-gold" /></span><span className="text-xs font-medium">{item.label}</span></button>)}</div>{notice && <p className="mt-3 text-sm text-success" role="status">{notice}</p>}</div>
        <Card className="p-5"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Transaction history</h3><span className="text-xs text-navy/40">{wallet.transactions.length} records</span></div><div className="flex flex-col divide-y divide-cardBorder">{wallet.transactions.map((transaction) => { const Icon = iconForTransaction(transaction.label); return <div key={transaction.id} className="flex items-center gap-3 py-3.5"><span className="h-10 w-10 rounded-full bg-bg flex items-center justify-center shrink-0"><Icon size={16} className="text-navy/60" /></span><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{transaction.label}</p><p className="text-xs text-navy/40">{transaction.date}</p></div><div className="text-right shrink-0"><p className={cn("font-mono font-semibold", transaction.amount < 0 ? "text-navy" : "text-success")}>{transaction.amount < 0 ? "-" : "+"}{formatNaira(Math.abs(transaction.amount))}</p><p className="text-xs text-navy/60">{transaction.status}</p></div></div>; })}</div></Card><p className="flex items-center justify-center gap-2 text-xs text-navy/50"><LockKeyhole size={13} className="text-success" /> Payment provider connection is required before real charges are made.</p></div>
        <div className="flex flex-col gap-4"><Card className="p-5"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Payment methods</h3><button type="button" onClick={() => setNotice("Payment method management will open a secure provider flow.")} className="text-sm text-gold font-medium hover:underline">Manage</button></div><div className="flex flex-col gap-3">{paymentMethods.map((method) => <button type="button" key={method.last4} onClick={() => { setSelectedMethod(method.last4); setNotice(`${method.type} ending in ${method.last4} selected.`); }} className={`w-full flex items-center gap-3 rounded-input border px-4 py-3 min-h-[44px] transition-colors ${selectedMethod === method.last4 ? "border-gold bg-gold/5" : "border-cardBorder hover:bg-bg"}`}><span className="h-8 w-11 rounded-[6px] bg-navy flex items-center justify-center shrink-0"><CreditCard size={14} className="text-white" /></span><span className="flex-1 text-left text-sm font-medium">{method.type} ••••{method.last4}</span>{selectedMethod === method.last4 && <span className="rounded-badge bg-success/10 text-success text-[10px] font-semibold px-2 py-0.5">Selected</span>}<ChevronRight size={15} className="text-navy/30" /></button>)}<button type="button" onClick={() => setNotice("Add payment method will open a secure provider flow.")} className="text-sm text-gold font-medium flex items-center gap-1.5 px-1 py-2"><Plus size={14} /> Add payment method</button></div></Card><Card className="p-5"><h3 className="font-semibold mb-3">Wallet summary</h3><div className="flex flex-col gap-2.5 text-sm">{[{ label: "Total balance", value: formatNaira(wallet.balance) }, { label: "Pending balance", value: formatNaira(0) }, { label: "Total spent", value: formatNaira(wallet.totalSpent) }, { label: "Total added", value: formatNaira(wallet.totalAdded) }].map((row) => <div key={row.label} className="flex justify-between"><span className="text-navy/50">{row.label}</span><span className="font-mono font-medium">{row.value}</span></div>)}<div className="flex justify-between items-center pt-2.5 border-t border-cardBorder"><span className="text-navy/50 flex items-center gap-1.5"><Star size={13} className="text-gold" /> Rewards balance</span><span className="font-mono font-semibold text-gold flex items-center gap-1">{wallet.rewards.toLocaleString()} pts <ChevronRight size={13} /></span></div></div></Card><Card className="p-5 bg-success/5 border-success/20"><div className="relative h-16 w-16 mb-3 flex items-center justify-center"><GiftIllustration className="h-14 w-auto" /></div><p className="font-semibold text-sm mb-1">Get more with BidRide</p><p className="text-xs text-navy/50 mb-4">Add money and enjoy exclusive offers when payments are connected.</p><Button variant="success" size="lg" className="w-full" onClick={addMoney}>Add money now</Button></Card></div>
      </main>
    </>
  );
}

export default function WalletPage() { return <AppShell><WalletContent /></AppShell>; }
