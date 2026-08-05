"use client";

import { useState } from "react";
import {
  Camera, BadgeCheck, Phone, Mail, Calendar, Pencil, Home, Briefcase, Plane, Plus,
  CreditCard, Car, Bell, Globe, Moon, KeyRound, Users, Ban,
  ChevronRight, ShieldCheck, Award, LogOut, Sparkles,
} from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AvatarInitials } from "@/components/illustrations/AvatarInitials";
import { useCurrentUser, useLogout } from "@/lib/use-current-user";
import { cn } from "@/lib/utils";

const savedPlaces = [
  { icon: Home, label: "Home", address: "15 Admiralty Way, Lekki Phase 1" },
  { icon: Briefcase, label: "Work", address: "Chevron Drive, Lekki, Lagos" },
  { icon: Plane, label: "Airport", address: "Murtala Muhammed International Airport" },
];

const preferences = [
  { icon: CreditCard, label: "Payment Method", value: "BidRide Wallet" },
  { icon: Car, label: "Ride Preferences", value: "Economy, Any vehicle" },
  { icon: Bell, label: "Notifications", value: "Push, Email, SMS" },
  { icon: Globe, label: "Language", value: "English" },
];

function ProfileContent() {
  const openMobileMenu = useMobileMenu();
  const { user } = useCurrentUser();
  const logout = useLogout();
  const [darkMode, setDarkMode] = useState(false);

  const security = [
    { icon: Mail, label: "Verify Your Email", value: user?.email ?? "—", verified: false },
    { icon: Phone, label: "Verify Your Phone", value: "No phone number added", verified: false, action: true },
    { icon: KeyRound, label: "Change Password", value: "Update your password", verified: false, action: true },
    { icon: Users, label: "Emergency Contacts", value: "No contacts added", verified: false, action: true },
    { icon: Ban, label: "Blocked Users", value: "0 users blocked", verified: false, action: true },
  ];

  const memberSince = user
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} title="My Profile" subtitle="Manage your account and preferences" />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <AvatarInitials name={user?.name ?? "?"} size={80} />
              <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-navy border-2 border-white flex items-center justify-center">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl font-bold">{user?.name ?? "—"}</h2>
                <span className="inline-flex items-center gap-1 rounded-badge bg-bg text-navy/50 text-xs font-semibold px-2 py-0.5">
                  {user?.role === "driver" ? "Driver" : "Rider"}
                </span>
              </div>
              <p className="text-sm text-navy/60 mt-0.5">No rides yet</p>
              <div className="flex flex-col gap-1 mt-3 text-sm text-navy/60">
                <span className="flex items-center gap-2">
                  <Phone size={13} /> Not added
                  <button className="text-gold text-xs font-medium hover:underline">Add</button>
                </span>
                <span className="flex items-center gap-2">
                  <Mail size={13} /> {user?.email ?? "—"}
                  <span className="text-navy/40 text-xs font-medium">Unverified</span>
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={13} /> Member since {memberSince}
                </span>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="w-full mt-5">
            <Pencil size={14} /> Edit Profile
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Your Ride Summary</h3>
            <button className="text-sm text-gold font-medium hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Rides", value: "0", color: "text-navy bg-bg" },
              { label: "Completed", value: "0", color: "text-success bg-success/10" },
              { label: "Cancelled", value: "0", color: "text-gold bg-gold/10" },
              { label: "Average Rating", value: "—", color: "text-navy/40 bg-bg" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", s.color)}>
                  <span className="font-mono text-xs font-bold">{s.value}</span>
                </span>
                <div>
                  <p className="font-mono font-bold text-lg leading-none">{s.value}</p>
                  <p className="text-xs text-navy/50">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy/40 mt-4">Your stats will fill in after your first ride.</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Saved Places</h3>
            <button className="text-sm text-gold font-medium hover:underline">Manage</button>
          </div>
          <div className="flex flex-col divide-y divide-cardBorder">
            {savedPlaces.map((p) => (
              <div key={p.label} className="flex items-center gap-3 py-3">
                <span className="h-10 w-10 rounded-full bg-bg flex items-center justify-center shrink-0">
                  <p.icon size={16} className="text-navy/60" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-navy/50 truncate">{p.address}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full flex items-center justify-center gap-1.5 text-sm text-gold font-medium py-3 mt-1 min-h-[44px]">
            <Plus size={14} /> Add New Place
          </button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Preferences</h3>
            <button className="text-sm text-gold font-medium hover:underline">Manage</button>
          </div>
          <div className="flex flex-col divide-y divide-cardBorder">
            {preferences.map((p) => (
              <button key={p.label} className="flex items-center gap-3 py-3 w-full text-left min-h-[44px]">
                <span className="h-9 w-9 rounded-full bg-bg flex items-center justify-center shrink-0">
                  <p.icon size={15} className="text-navy/60" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-navy/50">{p.value}</p>
                </div>
                <ChevronRight size={15} className="text-navy/30" />
              </button>
            ))}
            <div className="flex items-center gap-3 py-3">
              <span className="h-9 w-9 rounded-full bg-bg flex items-center justify-center shrink-0">
                <Moon size={15} className="text-navy/60" />
              </span>
              <p className="flex-1 text-sm font-medium">Dark Mode</p>
              <button
                onClick={() => setDarkMode((d) => !d)}
                className={cn(
                  "h-6 w-11 rounded-full transition-colors relative shrink-0",
                  darkMode ? "bg-gold" : "bg-cardBorder"
                )}
                aria-pressed={darkMode}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    darkMode ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Safety &amp; Security</h3>
          <div className="flex flex-col divide-y divide-cardBorder">
            {security.map((s) => (
              <button key={s.label} className="flex items-center gap-3 py-3 w-full text-left min-h-[44px]">
                <span className="h-9 w-9 rounded-full bg-bg flex items-center justify-center shrink-0">
                  <s.icon size={15} className="text-navy/60" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-navy/50 truncate">{s.value}</p>
                </div>
                {s.verified ? (
                  <BadgeCheck size={17} className="text-success" />
                ) : (
                  <ChevronRight size={15} className="text-navy/30" />
                )}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Achievements</h3>
          </div>
          <div className="rounded-input bg-bg border border-cardBorder p-5 flex flex-col items-center text-center gap-2">
            <span className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
              <Sparkles size={18} className="text-gold" />
            </span>
            <p className="text-sm font-semibold">No achievements yet</p>
            <p className="text-xs text-navy/50 max-w-[220px]">
              Complete your first ride to start earning badges like Reliable Rider and Top Rated.
            </p>
          </div>
        </Card>

        <Card className="p-2 lg:col-span-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] text-urgency"
          >
            <LogOut size={17} />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Log Out</p>
              <p className="text-xs text-urgency/60">Sign out of your BidRide account</p>
            </div>
            <ChevronRight size={16} />
          </button>
        </Card>
      </main>
    </>
  );
}

export default function ProfilePage() {
  return (
    <AppShell>
      <ProfileContent />
    </AppShell>
  );
}
