export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-12">
      <article className="mx-auto max-w-2xl rounded-card border border-cardBorder bg-white p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">BidRide</p>
        <h1 className="font-display text-3xl font-bold mt-2">Terms of Service</h1>
        <p className="text-sm text-navy/60 mt-4">This final-year prototype is provided for demonstration and academic evaluation. It is not a commercial transport, payment, or safety service.</p>
        <h2 className="font-display text-xl font-bold mt-8">Responsible use</h2>
        <p className="text-sm text-navy/70 leading-relaxed mt-2">Users must provide accurate information, respect other campus users, and follow FUPRE and applicable transport-safety rules. Demo accounts and sample trip data must not be used for real-world bookings.</p>
        <a href="/login" className="inline-flex mt-8 text-sm font-semibold text-gold hover:underline">Back to sign in</a>
      </article>
    </main>
  );
}
