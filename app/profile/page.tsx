"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Camera, BadgeCheck, Phone, Mail, Calendar, Pencil, Home, Briefcase, Plane, Plus,
  CreditCard, Car, Bell, Globe, Moon, Mail as MailIcon, Smartphone, KeyRound, Users, Ban,
  ChevronRight, ShieldCheck, Award, LogOut,
} from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { currentUser } from "@/lib/data";
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

const security = [
  { icon: MailIcon, label: "Verify Your Email", value: "Your email is verified", verified: true },
  { icon: Smartphone, label: "Verify Your Phone", value: "Your phone number is verified", verified: true },
  { icon: KeyRound, label: "Change Password", value: "Last changed 2 months ago", verified: false },
  { icon: Users, label: "Emergency Contacts", value: "2 contacts added", verified: false },
  { icon: Ban, label: "Blocked Users", value: "0 users blocked", verified: false },
];

const achievements = [
  { icon: ShieldCheck, label: "Reliable Rider", detail: "Completed 10 rides", date: "May 20, 2024" },
  { icon: Award, label: "Frequent Rider", detail: "Completed 25 rides", date: "Jun 18, 2024" },
  { icon: Award, label: "Top Rated", detail: "Maintain 4.5+ rating", date: "Jul 2, 2024" },
];

function ProfileContent() {
  const openMobileMenu = useMobileMenu();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} title="My Profile" subtitle="Manage your account and preferences" />

      <main className="flex-1 px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <Image src={currentUser.avatar} alt={currentUser.name} fill className="rounded-full object-cover bg-bg" />
              <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-navy border-2 border-white flex items-center justify-center">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl font-bold">{currentUser.name}</h2>
                <span className="inline-flex items-center gap-1 rounded-badge bg-success/10 text-success text-xs font-semibold px-2 py-0.5">
                  <BadgeCheck size={12} /> Verified
                </span>
              </div>
              <p className="text-sm text-navy/60 mt-0.5">
                ★ {currentUser.rating} <span className="text-navy/40">(128 rides)</span>
              </p>
              <div className="flex flex-col gap-1 mt-3 text-sm text-navy/60">
                <span className="flex items-center gap-2">
                  <Phone size={13} /> 0812 345 6789
                  <span className="text-success text-xs font-medium">Verified</span>
                </span>
                <span className="flex items-center gap-2">
                  <Mail size={13} /> auracle@gmail.com
                  <span className="text-success text-xs font-medium">Verified</span>
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={13} /> Member since May 2024
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
              { label: "Total Rides", value: "48", color: "text-navy bg-bg" },
              { label: "Completed", value: "42", color: "text-success bg-success/10" },
              { label: "Cancelled", value: "4", color: "text-gold bg-gold/10" },
              { label: "Average Rating", value: "4.8", color: "text-gold bg-gold/10" },
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
                  <p className="text-xs text-navy/50">{s.value}</p>
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
            <button className="text-sm text-gold font-medium hover:underline">View all</button>
          </div>
          <div className="rounded-input bg-success/5 border border-success/20 p-4 flex items-center gap-3 mb-4">
            <div className="relative h-10 w-10 shrink-0">
              <Image src="/images/achievements.png" alt="" fill className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-success">Great going!</p>
              <p className="text-xs text-navy/60">You&rsquo;re doing better than 85% of riders</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {achievements.map((a) => (
              <div key={a.label} className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <a.icon size={15} className="text-gold" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-navy/50">{a.detail}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-navy/40">{a.date}</p>
                </div>
                <BadgeCheck size={16} className="text-success shrink-0" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-2 lg:col-span-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] text-urgency">
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
