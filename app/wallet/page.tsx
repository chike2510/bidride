"use client";

import Image from "next/image";
import { Eye, Plus, Send, Percent, ShieldAlert, Car, CreditCard, ArrowUpRight, Gift, XCircle, Star, ChevronRight, LockKeyhole } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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

const transactions = [
  { icon: Car, label: "Ride to Murtala Muhammed Airport", date: "May 19, 2025 · 10:42 AM", amount: -1440, status: "Completed", statusColor: "text-success" },
  { icon: Car, label: "Ride to Victoria Island, Lagos", date: "May 17, 2025 · 7:15 PM", amount: -980, status: "Completed", statusColor: "text-success" },
  { icon: Car, label: "Ride to Ikoyi, Lagos", date: "May 15, 2025 · 2:30 PM", amount: -1260, status: "Completed", statusColor: "text-success" },
  { icon: ArrowUpRight, label: "Money added via Card", date: "May 14, 2025 · 9:08 AM", amount: 5000, status: "Successful", statusColor: "text-navy/60" },
  { icon: Gift, label: "Referral bonus from Tunde", date: "May 12, 2025 · 6:45 PM", amount: 450, status: "Bonus", statusColor: "text-gold" },
  { icon: XCircle, label: "Ride cancelled refund", date: "May 10, 2025 · 11:20 AM", amount: 870, status: "Refunded", statusColor: "text-navy/60" },
];

function WalletContent() {
  const openMobileMenu = useMobileMenu();

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} title="Wallet" subtitle="Manage your balance and payments" />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-6">
          <Card className="p-6 sm:p-7 bg-navy border-navy text-white">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/60 text-sm flex items-center gap-1.5">
                Current Balance <Eye size={14} />
              </p>
              <Button variant="secondary" className="bg-white text-navy h-9 px-3.5">
                <Plus size={14} /> Add Money
              </Button>
            </div>
            <p className="font-mono text-4xl font-bold mb-1">{formatNaira(12400)}</p>
            <p className="text-white/50 text-sm mb-5">Available to spend</p>

            <div className="flex flex-wrap gap-6 pt-5 border-t border-white/10">
              {[
                { label: "Total Spent", value: formatNaira(8650), color: "text-success" },
                { label: "Total Added", value: formatNaira(21050), color: "text-white" },
                { label: "Saved with BidRide", value: formatNaira(1250), color: "text-gold" },
                { label: "Rewards Earned", value: "12", color: "text-gold" },
              ].map((item) => (
                <div key={item.label}>
                  <p className={cn("font-mono font-semibold", item.color)}>{item.value}</p>
                  <p className="text-white/40 text-xs">{item.label}</p>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((a) => (
                <Card key={a.label} hoverLift className="p-4 flex flex-col items-center gap-2 text-center cursor-pointer">
                  <span className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <a.icon size={17} className="text-gold" />
                  </span>
                  <p className="text-xs font-medium">{a.label}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Transaction History</h3>
              <button className="text-sm text-gold font-medium hover:underline">View All</button>
            </div>
            <div className="flex flex-col divide-y divide-cardBorder">
              {transactions.map((t, i) => (
                <div key={i} className="flex items-center gap-3 py-3.5">
                  <span className="h-10 w-10 rounded-full bg-bg flex items-center justify-center shrink-0">
                    <t.icon size={16} className="text-navy/60" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.label}</p>
                    <p className="text-xs text-navy/40">{t.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("font-mono font-semibold", t.amount < 0 ? "text-navy" : "text-success")}>
                      {t.amount < 0 ? "-" : "+"}
                      {formatNaira(Math.abs(t.amount))}
                    </p>
                    <p className={cn("text-xs", t.statusColor)}>{t.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <p className="flex items-center justify-center gap-2 text-xs text-navy/50">
            <LockKeyhole size={13} className="text-success" />
            Your payments are secure with 256-bit SSL encryption. <span className="text-gold font-medium">Learn more</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Payment Methods</h3>
              <button className="text-sm text-gold font-medium hover:underline">Manage</button>
            </div>
            <div className="flex flex-col gap-3">
              {paymentMethods.map((m) => (
                <button
                  key={m.last4}
                  className="w-full flex items-center gap-3 rounded-input border border-cardBorder px-4 py-3 min-h-[44px] hover:bg-bg transition-colors"
                >
                  <span className="h-8 w-11 rounded-[6px] bg-navy flex items-center justify-center shrink-0">
                    <CreditCard size={14} className="text-white" />
                  </span>
                  <span className="flex-1 text-left text-sm font-medium">
                    {m.type} ••••{m.last4}
                  </span>
                  {m.isDefault && (
                    <span className="rounded-badge bg-success/10 text-success text-[10px] font-semibold px-2 py-0.5">
                      Default
                    </span>
                  )}
                  <ChevronRight size={15} className="text-navy/30" />
                </button>
              ))}
              <button className="text-sm text-gold font-medium flex items-center gap-1.5 px-1 py-2">
                <Plus size={14} /> Add Payment Method
              </button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-3">Wallet Summary</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                { label: "Total Balance", value: formatNaira(12400) },
                { label: "Pending Balance", value: formatNaira(0) },
                { label: "Total Spent", value: formatNaira(8650) },
                { label: "Total Added", value: formatNaira(21050) },
              ].map((r) => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-navy/50">{r.label}</span>
                  <span className="font-mono font-medium">{r.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2.5 border-t border-cardBorder">
                <span className="text-navy/50 flex items-center gap-1.5">
                  <Star size={13} className="text-gold" /> Rewards Balance
                </span>
                <span className="font-mono font-semibold text-gold flex items-center gap-1">
                  1,250 pts <ChevronRight size={13} />
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-success/5 border-success/20">
            <div className="relative h-16 w-16 mb-3">
              <Image src="/images/gift.png" alt="" fill className="object-contain" />
            </div>
            <p className="font-semibold text-sm mb-1">Get more with BidRide!</p>
            <p className="text-xs text-navy/50 mb-4">Add money to your wallet and enjoy exclusive offers.</p>
            <Button variant="success" size="lg" className="w-full">
              Add Money Now
            </Button>
          </Card>
        </div>
      </main>
    </>
  );
}

export default function WalletPage() {
  return (
    <AppShell>
      <WalletContent />
    </AppShell>
  );
}
