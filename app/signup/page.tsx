"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, Headphones, Car as CarIcon, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Role = "rider" | "driver";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("rider");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center bg-navy text-white px-12 relative overflow-hidden">
        <span className="absolute top-14 left-12 font-display text-2xl font-bold">
          Bid<span className="text-gold">Ride</span>
        </span>
        <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight mb-4">
          Join thousands
          <br />
          getting <span className="text-gold">better fares.</span>
        </h1>
        <p className="text-white/60 text-lg max-w-sm">
          Create an account and let drivers compete for your next ride.
        </p>
      </div>

      <div className="flex flex-col bg-bg">
        <div className="flex justify-end px-6 sm:px-10 pt-6">
          <a href="mailto:support@bidride.test" className="text-sm text-navy/60 flex items-center gap-1.5 hover:text-navy transition-colors">
            <Headphones size={16} /> Need help?
          </a>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-sm">
            <div className="lg:hidden mb-8 text-center">
              <span className="font-display text-2xl font-bold text-navy">
                Bid<span className="text-gold">Ride</span>
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-1">Create your account</h2>
            <p className="text-navy/50 mb-5">Start requesting rides in under a minute.</p>

            <div className="mb-6">
              <p className="text-sm font-medium text-navy/70 mb-2">How will you use BidRide?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("rider")}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-input border px-4 py-3.5 text-left transition-colors min-h-[44px]",
                    role === "rider"
                      ? "border-gold bg-gold/10"
                      : "border-cardBorder hover:bg-bg"
                  )}
                >
                  <UserRound size={18} className={role === "rider" ? "text-gold" : "text-navy/50"} />
                  <span>
                    <span className="block text-sm font-semibold">Ride with BidRide</span>
                    <span className="block text-xs text-navy/50">Request rides, drivers bid for your fare</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("driver")}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-input border px-4 py-3.5 text-left transition-colors min-h-[44px]",
                    role === "driver"
                      ? "border-gold bg-gold/10"
                      : "border-cardBorder hover:bg-bg"
                  )}
                >
                  <CarIcon size={18} className={role === "driver" ? "text-gold" : "text-navy/50"} />
                  <span>
                    <span className="block text-sm font-semibold">Drive with BidRide</span>
                    <span className="block text-xs text-navy/50">Bid on ride requests and earn</span>
                  </span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-navy/70 mb-1.5 block">
                  Full name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    placeholder="Your full name"
                    className="w-full h-12 rounded-input border border-cardBorder pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-navy/70 mb-1.5 block">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full h-12 rounded-input border border-cardBorder pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-navy/70 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    className="w-full h-12 rounded-input border border-cardBorder pl-11 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="text-sm font-medium text-navy/70 mb-1.5 block">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
                  <input
                    id="confirm"
                    name="confirm"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Re-enter your password"
                    className="w-full h-12 rounded-input border border-cardBorder pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-urgency bg-urgency/5 border border-urgency/20 rounded-input px-3.5 py-2.5">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
                {loading ? "Creating account…" : "Create account →"}
              </Button>
            </form>

            <p className="text-center text-sm text-navy/50 mt-7">
              Already have an account?{" "}
              <Link href="/login" className="text-gold font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-navy/40 px-6 pb-6">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-navy/60 hover:underline">Terms of Service</Link> and{" "}
          <Link href="/privacy" className="text-navy/60 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
