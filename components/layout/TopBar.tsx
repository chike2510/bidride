"use client";

import { ArrowLeft, Bell, Wallet as WalletIcon, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { formatNaira } from "@/lib/utils";
import { mockWallet } from "@/lib/data";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  greeting?: { icon: React.ReactNode; name: string; line: string };
  onMenuClick?: () => void;
  notificationCount?: number;
}

export function TopBar({
  title,
  subtitle,
  backHref,
  greeting,
  onMenuClick,
  notificationCount = 1,
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-5 sm:px-8 py-5 border-b border-cardBorder bg-bg">
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden h-11 w-11 flex items-center justify-center rounded-full bg-white border border-cardBorder shrink-0"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        )}
        {backHref && (
          <Link
            href={backHref}
            className="h-11 w-11 flex items-center justify-center rounded-full bg-white border border-cardBorder shrink-0 hover:bg-bg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </Link>
        )}

        {greeting ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-input bg-gold/10 flex items-center justify-center shrink-0">
              {greeting.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-navy/60 truncate">{greeting.line}</p>
              <h1 className="font-display text-xl sm:text-2xl font-bold truncate">{greeting.name}</h1>
            </div>
          </div>
        ) : (
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl font-bold truncate">{title}</h1>
            {subtitle && <p className="text-sm text-navy/60 truncate">{subtitle}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/wallet"
          className="hidden xs:flex items-center gap-2.5 rounded-input bg-white border border-cardBorder px-3.5 h-11 hover:bg-bg transition-colors"
        >
          <span className="h-8 w-8 rounded-full bg-bg flex items-center justify-center">
            <WalletIcon size={15} className="text-navy" />
          </span>
          <div className="text-left leading-tight hidden sm:block">
            <p className="text-[11px] text-navy/50">Wallet Balance</p>
            <p className="font-mono text-sm font-semibold">{formatNaira(mockWallet.balance)}</p>
          </div>
          <ChevronDown size={14} className="text-navy/40 hidden sm:block" />
        </Link>

        <Link
          href="/notifications"
          className="relative h-11 w-11 rounded-full bg-white border border-cardBorder flex items-center justify-center hover:bg-bg transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-gold" />
          )}
        </Link>
      </div>
    </header>
  );
}
