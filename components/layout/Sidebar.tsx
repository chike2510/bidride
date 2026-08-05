"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Car,
  TrendingUp,
  Navigation,
  Clock,
  Wallet,
  Bookmark,
  Bell,
  HelpCircle,
  ChevronDown,
  Gift,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/data";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/request-ride", label: "Request Ride", icon: Car },
  { href: "/live-bidding", label: "Live Bidding", icon: TrendingUp, live: true },
  { href: "/live-tracking", label: "Live Tracking", icon: Navigation },
  { href: "/ride-history", label: "Ride History", icon: Clock },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/saved-places", label: "Saved Places", icon: Bookmark },
  { href: "/notifications", label: "Notifications", icon: Bell, badge: 3 },
  { href: "/help-center", label: "Help Center", icon: HelpCircle },
];

export function Sidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] shrink-0",
          "bg-navy flex flex-col overflow-y-auto no-scrollbar",
          "transition-transform duration-200 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-6 pt-7 pb-6">
          <Link href="/dashboard" className="font-display text-2xl font-bold tracking-tight">
            <span className="text-white">Bid</span>
            <span className="text-gold">Ride</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white h-11 w-11 flex items-center justify-center"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-btn px-4 min-h-[44px] py-2.5 text-sm font-medium",
                  "transition-colors duration-150 ease-out",
                  active
                    ? "bg-gold text-navy font-semibold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} className="shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.live && active && (
                  <span className="rounded-badge bg-navy/15 px-2 py-0.5 text-[10px] font-bold tracking-wide">
                    LIVE
                  </span>
                )}
                {item.badge && !active && (
                  <span className="rounded-badge bg-gold text-navy text-[10px] font-bold h-5 min-w-5 px-1.5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4 mt-4">
          <div className="rounded-card bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <p className="text-white text-sm font-semibold">Bids in real time</p>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Drivers are competing to offer you the best fare. You pick.
            </p>
            <div className="relative h-16 w-full overflow-hidden rounded-input mb-1">
              <Image src="/images/gift.png" alt="" fill className="object-cover opacity-90" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-4 flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white/10 shrink-0">
            <Image src={currentUser.avatar} alt={currentUser.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1 text-xs text-gold">
              <Star size={12} fill="currentColor" />
              <span>{currentUser.rating}</span>
            </div>
          </div>
          <ChevronDown size={16} className="text-white/50" />
        </div>
      </aside>
    </>
  );
}
