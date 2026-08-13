"use client";

import { useEffect, useState } from "react";
import { Bookmark, Briefcase, Home, MapPin, Plane, Plus, Trash2 } from "lucide-react";
import { AppShell, useMobileMenu } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { recentPlaces as defaultPlaces } from "@/lib/data";

const STORAGE_KEY = "bidride-saved-places";
const iconFor = { home: Home, briefcase: Briefcase, plane: Plane } as const;
type SavedPlace = { id: string; label: string; address: string; icon: keyof typeof iconFor };

function SavedPlacesContent() {
  const openMobileMenu = useMobileMenu();
  const [places, setPlaces] = useState<SavedPlace[]>(defaultPlaces);
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setPlaces(JSON.parse(stored) as SavedPlace[]); } catch { /* use defaults */ }
    }
  }, []);

  function persist(next: SavedPlace[]) {
    setPlaces(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addPlace() {
    if (!label.trim() || !address.trim()) return;
    persist([...places, { id: `${Date.now()}`, label: label.trim(), address: address.trim(), icon: "home" }]);
    setLabel("");
    setAddress("");
    setNotice("Saved place added.");
  }

  return (
    <>
      <TopBar onMenuClick={openMobileMenu} backHref="/dashboard" title="Saved Places" subtitle="Save frequent destinations for faster requests" />
      <main className="flex-1 px-5 sm:px-8 py-6 max-w-4xl w-full">
        <Card className="p-5 sm:p-6 mb-5"><div className="flex items-start gap-3 mb-4"><span className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center"><Bookmark size={18} className="text-gold" /></span><div><h2 className="font-display text-xl font-bold">Your places</h2><p className="text-sm text-navy/50">Use a saved place as a destination from the request screen.</p></div></div><div className="grid grid-cols-1 sm:grid-cols-[150px_1fr_auto] gap-2"><input value={label} onChange={(event) => setLabel(event.target.value)} className="rounded-input border border-cardBorder px-4 py-3 text-sm outline-none focus:border-gold" placeholder="Label" aria-label="Saved place label" /><input value={address} onChange={(event) => setAddress(event.target.value)} className="rounded-input border border-cardBorder px-4 py-3 text-sm outline-none focus:border-gold" placeholder="Address" aria-label="Saved place address" /><Button onClick={addPlace} disabled={!label.trim() || !address.trim()}><Plus size={15} /> Save place</Button></div>{notice && <p className="mt-3 text-sm text-success" role="status">{notice}</p>}</Card>
        <Card className="p-5"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Saved destinations</h3><span className="text-xs text-navy/40">{places.length} places</span></div><div className="divide-y divide-cardBorder">{places.map((place) => { const Icon = iconFor[place.icon] ?? MapPin; return <div key={place.id} className="flex items-center gap-3 py-3"><span className="h-10 w-10 rounded-full bg-bg flex items-center justify-center shrink-0"><Icon size={16} className="text-navy/60" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{place.label}</p><p className="text-xs text-navy/50 truncate">{place.address}</p></div><button type="button" onClick={() => persist(places.filter((item) => item.id !== place.id))} className="h-10 w-10 rounded-full flex items-center justify-center text-navy/40 hover:bg-urgency/5 hover:text-urgency" aria-label={`Delete ${place.label}`}><Trash2 size={16} /></button></div>; })}</div>{places.length === 0 && <div className="py-10 text-center"><MapPin size={24} className="mx-auto text-navy/30 mb-2" /><p className="text-sm text-navy/50">No saved places yet.</p></div>}</Card>
      </main>
    </>
  );
}

export default function SavedPlacesPage() { return <AppShell><SavedPlacesContent /></AppShell>; }
