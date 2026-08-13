export type WalletTransaction = {
  id: string;
  label: string;
  date: string;
  amount: number;
  status: string;
};

export type WalletState = {
  balance: number;
  totalSpent: number;
  totalAdded: number;
  saved: number;
  rewards: number;
  transactions: WalletTransaction[];
};

const STORAGE_KEY = "bidride-wallet";

export const defaultWallet: WalletState = {
  balance: 12400,
  totalSpent: 8650,
  totalAdded: 21050,
  saved: 1250,
  rewards: 1250,
  transactions: [
    { id: "airport", label: "Ride to Murtala Muhammed Airport", date: "May 19, 2025 · 10:42 AM", amount: -1440, status: "Completed" },
    { id: "vi", label: "Ride to Victoria Island, Lagos", date: "May 17, 2025 · 7:15 PM", amount: -980, status: "Completed" },
    { id: "ikoyi", label: "Ride to Ikoyi, Lagos", date: "May 15, 2025 · 2:30 PM", amount: -1260, status: "Completed" },
    { id: "top-up", label: "Money added via Card", date: "May 14, 2025 · 9:08 AM", amount: 5000, status: "Successful" },
    { id: "bonus", label: "Referral bonus from Tunde", date: "May 12, 2025 · 6:45 PM", amount: 450, status: "Bonus" },
    { id: "refund", label: "Ride cancelled refund", date: "May 10, 2025 · 11:20 AM", amount: 870, status: "Refunded" },
  ],
};

export function loadWallet(): WalletState {
  if (typeof window === "undefined") return defaultWallet;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as WalletState) : defaultWallet;
  } catch {
    return defaultWallet;
  }
}

export function saveWallet(wallet: WalletState) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
}
