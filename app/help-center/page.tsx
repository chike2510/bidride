"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const faqs = [
  { question: "How does BidRide bidding work?", answer: "You submit pickup, destination, and preferences. Available drivers review the request and send offers. You compare fare, ETA, rating, and vehicle details before accepting one." },
  { question: "Can I cancel after accepting a bid?", answer: "Yes. Open the active ride and choose Cancel ride. You will see any applicable policy or fee before confirming." },
  { question: "How do I share my trip?", answer: "Use Share trip from the confirmation or tracking screen. The shared message includes the driver and route details you choose to send." },
  { question: "What happens if a driver does not arrive?", answer: "Use the contact controls first, then cancel or report the issue from the active ride. BidRide should keep the trip record available for support." },
  { question: "How are payments handled?", answer: "The accepted fare is shown before you confirm. Your receipt summarizes the fare, optional tip, and final amount after the ride is complete." },
];

function HelpCenterContent() {
  const openMobileMenu = useMobileMenu();
  const [open, setOpen] = useState(0);
  const [notice, setNotice] = useState("");

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} backHref="/dashboard" title="Help Center" subtitle="Answers for a smoother ride" />
      <main className="flex-1 px-5 sm:px-8 py-6 max-w-4xl w-full grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5"><Card className="p-5 sm:p-6"><div className="flex items-start gap-3 mb-5"><span className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center"><HelpCircle size={18} className="text-gold" /></span><div><h2 className="font-display text-xl font-bold">Frequently asked questions</h2><p className="text-sm text-navy/50">Quick answers about requesting, choosing, and completing rides.</p></div></div><div className="divide-y divide-cardBorder">{faqs.map((faq, index) => { const expanded = index === open; return <div key={faq.question}><button type="button" onClick={() => setOpen(expanded ? -1 : index)} aria-expanded={expanded} className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-semibold"><span>{faq.question}</span><ChevronDown size={17} className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} /></button>{expanded && <p className="pb-4 pr-8 text-sm text-navy/60 leading-relaxed">{faq.answer}</p>}</div>; })}</div></Card><div className="flex flex-col gap-4"><Card className="p-5 bg-navy text-white"><ShieldCheck size={20} className="text-gold mb-3" /><h3 className="font-semibold mb-1">Need urgent help?</h3><p className="text-sm text-white/65 leading-relaxed mb-4">For an active ride, use the safety actions on the tracking screen.</p><Button variant="secondary" className="w-full" onClick={() => setNotice("Open your active ride to access safety actions.")}><MessageCircle size={15} /> Active ride help</Button></Card><Card className="p-5"><h3 className="font-semibold mb-2">Contact support</h3><p className="text-sm text-navy/55 leading-relaxed mb-4">Tell us what happened and include your ride ID if you have one.</p><a className="flex items-center gap-2 text-sm text-gold font-semibold hover:underline" href="mailto:support@bidride.app"><Mail size={15} /> support@bidride.app</a>{notice && <p className="mt-3 text-xs text-success" role="status">{notice}</p>}</Card></div></main>
    </>
  );
}

export default function HelpCenterPage() { return <AppShell><HelpCenterContent /></AppShell>; }
