"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Clock3, Gift, ShieldCheck, Tag } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "bidride-notifications";
type NotificationItem = { id: string; title: string; body: string; time: string; icon: "ride" | "safety" | "promo" | "reward"; read: boolean };
const defaultNotifications: NotificationItem[] = [
  { id: "ride-ready", title: "Your ride is ready to rate", body: "Share feedback about your recent airport trip.", time: "Today", icon: "ride", read: false },
  { id: "safety", title: "Safety reminder", body: "Share your trip with someone you trust before pickup.", time: "Yesterday", icon: "safety", read: false },
  { id: "reward", title: "You earned a BidRide reward", body: "Your recent ride saved you ₦120 compared with the estimate.", time: "May 19", icon: "reward", read: true },
  { id: "promo", title: "Weekend fares are live", body: "Check driver bids before the weekend rush begins.", time: "May 17", icon: "promo", read: true },
];
const icons = { ride: Clock3, safety: ShieldCheck, promo: Tag, reward: Gift };

function NotificationsContent() {
  const openMobileMenu = useMobileMenu();
  const [items, setItems] = useState(defaultNotifications);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setItems(JSON.parse(stored) as NotificationItem[]); } catch { /* use defaults */ }
    }
  }, []);

  function persist(next: NotificationItem[]) {
    setItems(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const unread = items.filter((item) => !item.read).length;

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} backHref="/dashboard" title="Notifications" subtitle={unread ? `${unread} unread update${unread === 1 ? "" : "s"}` : "You’re all caught up"} notificationCount={unread} />
      <main className="flex-1 px-5 sm:px-8 py-6 max-w-3xl w-full"><Card className="p-5 sm:p-6"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><span className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center"><Bell size={18} className="text-gold" /></span><div><h2 className="font-display text-xl font-bold">Updates for you</h2><p className="text-sm text-navy/50">Ride, safety, and reward activity.</p></div></div><Button variant="ghost" onClick={() => persist(items.map((item) => ({ ...item, read: true })))} disabled={!unread}><Check size={15} /> Mark all read</Button></div><div className="divide-y divide-cardBorder">{items.map((item) => { const Icon = icons[item.icon]; return <button type="button" key={item.id} onClick={() => persist(items.map((current) => current.id === item.id ? { ...current, read: true } : current))} className={`w-full flex items-start gap-3 py-4 text-left transition-colors hover:bg-bg/70 rounded-input px-2 ${item.read ? "opacity-70" : ""}`}><span className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${item.read ? "bg-bg" : "bg-gold/10"}`}><Icon size={16} className={item.read ? "text-navy/50" : "text-gold"} /></span><span className="flex-1 min-w-0"><span className="flex items-center gap-2"><span className="text-sm font-semibold">{item.title}</span>{!item.read && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}</span><span className="block text-sm text-navy/60 mt-1">{item.body}</span><span className="block text-xs text-navy/40 mt-1">{item.time}</span></span></button>; })}</div>{items.length === 0 && <div className="py-10 text-center"><p className="text-sm text-navy/50">No notifications yet.</p></div>}</Card></main>
    </>
  );
}

export default function NotificationsPage() { return <AppShell><NotificationsContent /></AppShell>; }
