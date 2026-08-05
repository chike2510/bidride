"use client";

import { createContext, useContext, useState } from "react";
import { Sidebar } from "./Sidebar";

const MobileMenuContext = createContext<() => void>(() => {});
export function useMobileMenu() {
  return useContext(MobileMenuContext);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileMenuContext.Provider value={() => setMobileOpen(true)}>
          {children}
        </MobileMenuContext.Provider>
      </div>
    </div>
  );
}
