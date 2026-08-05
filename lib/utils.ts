import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a number as a Naira amount, e.g. 12400 -> "₦12,400" */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}
