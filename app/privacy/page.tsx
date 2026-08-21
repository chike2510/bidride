export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-12">
      <article className="mx-auto max-w-2xl rounded-card border border-cardBorder bg-white p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">BidRide</p>
        <h1 className="font-display text-3xl font-bold mt-2">Privacy Notice</h1>
        <p className="text-sm text-navy/60 mt-4">This prototype uses account details and ride information only to demonstrate the FUPRE campus mobility workflow.</p>
        <h2 className="font-display text-xl font-bold mt-8">Location data</h2>
        <p className="text-sm text-navy/70 leading-relaxed mt-2">Location is requested only after permission is granted. Driver availability expires when location heartbeats stop. Do not use this prototype to share sensitive personal locations or emergency information.</p>
        <h2 className="font-display text-xl font-bold mt-8">Prototype limitation</h2>
        <p className="text-sm text-navy/70 leading-relaxed mt-2">This is an academic project and does not provide commercial-grade payment, identity verification, or emergency-response guarantees.</p>
        <a href="/login" className="inline-flex mt-8 text-sm font-semibold text-gold hover:underline">Back to sign in</a>
      </article>
    </main>
  );
}
