"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, TrendingUp, ShieldCheck, Wallet, Headphones } from "lucide-react";
import { Button } from "@/components/ui/Button";

const features = [
  { icon: TrendingUp, title: "Live Bidding", body: "Drivers bid in real time. You pick the best fare." },
  { icon: ShieldCheck, title: "Safe & Verified", body: "All drivers are verified for your safety." },
  { icon: Wallet, title: "Secure Payments", body: "Cashless payments you can trust." },
];

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push(searchParams.get("next") || "/dashboard");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel - hidden on mobile per "single-column on mobile" spec */}
      <div className="hidden lg:flex flex-col justify-between bg-navy text-white px-12 pt-14 pb-10 relative overflow-hidden">
        <div className="relative z-10">
          <span className="font-display text-2xl font-bold">
            Bid<span className="text-gold">Ride</span>
          </span>

          <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight mt-14 mb-4">
            Drivers compete.
            <br />
            <span className="text-gold">You</span> choose.
          </h1>
          <p className="text-white/60 text-lg mb-10 max-w-sm">
            The smart way to get a ride at the best possible fare.
          </p>

          <div className="flex flex-col gap-5">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3.5">
                <span className="h-11 w-11 rounded-full border border-white/15 flex items-center justify-center shrink-0">
                  <f.icon size={18} className="text-gold" />
                </span>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-white/50 text-sm">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-10 h-56 rounded-input bg-white/5 border border-white/10 flex items-center justify-center">
          <p className="text-white/30 text-xs">welcome-illustration.png</p>
        </div>
      </div>

      {/* Right panel - the form */}
      <div className="flex flex-col bg-bg">
        <div className="flex justify-end px-6 sm:px-10 pt-6">
          <button className="text-sm text-navy/60 flex items-center gap-1.5 hover:text-navy transition-colors">
            <Headphones size={16} /> Need help?
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-sm">
            <div className="lg:hidden mb-8 text-center">
              <span className="font-display text-2xl font-bold text-navy">
                Bid<span className="text-gold">Ride</span>
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-1">Welcome back</h2>
            <p className="text-navy/50 mb-7">
              Sign in to continue to <span className="text-gold font-medium">BidRide</span>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    placeholder="Enter your password"
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

              <div className="text-right -mt-1">
                <Link href="#" className="text-sm text-gold font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className="text-sm text-urgency bg-urgency/5 border border-urgency/20 rounded-input px-3.5 py-2.5">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
                {loading ? "Signing in…" : "Sign in →"}
              </Button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-cardBorder" />
              <span className="text-xs text-navy/40">OR</span>
              <div className="flex-1 h-px bg-cardBorder" />
            </div>

            <div className="flex flex-col gap-3">
              <button className="h-12 rounded-input border border-cardBorder flex items-center justify-center gap-2.5 text-sm font-medium hover:bg-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.55-5.17 3.55-8.87z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.92l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.28a12 12 0 0 0 0 10.73z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.63l3.99 3.1C6.22 6.86 8.87 4.75 12 4.75z" />
                </svg>
                Continue with Google
              </button>
              <button className="h-12 rounded-input border border-cardBorder flex items-center justify-center gap-2.5 text-sm font-medium hover:bg-white transition-colors">
                <svg width="15" height="15" viewBox="0 0 384 512" fill="currentColor" aria-hidden>
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 0 184.8 0 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 37.3 59 128.8 107.2 127.3 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-84.1 102.6-121.5-65.2-30.7-57.7-90-57.7-91.8zm-56.6-164.2c27-32.1 24.5-61.4 23.7-71.9-23.8 1.4-51.3 16.4-67 34.9-17.3 19.8-27.5 44.3-25.3 71.4 25.9 2 49.4-11.4 68.6-34.4z" />
                </svg>
                Continue with Apple
              </button>
            </div>

            <p className="text-center text-sm text-navy/50 mt-7">
              Don&rsquo;t have an account?{" "}
              <Link href="/signup" className="text-gold font-medium hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-navy/40 px-6 pb-6">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-navy/60 hover:underline">Terms of Service</Link> and{" "}
          <Link href="#" className="text-navy/60 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
