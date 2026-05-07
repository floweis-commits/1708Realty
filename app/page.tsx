import Link from "next/link";
import DotField from "@/components/DotField";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-stone-800 to-stone-400">
      <DotField />
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <span className="label-md text-white">1708 — Realty</span>
        <Link href="/login" className="label-md text-white/70 hover:text-white">Login</Link>
      </nav>
      <section className="relative z-10 flex flex-col justify-center px-8 pt-24 pb-32">
        <h1 className="display text-white max-w-[14ch]">A Quiet<br/>Place To<br/>Live.</h1>
        <div className="mt-16 flex gap-12">
          <Link href="/login" className="label-md text-white border-b border-white/40 pb-1 hover:border-white">Tenant</Link>
          <Link href="/login" className="label-md text-white border-b border-white/40 pb-1 hover:border-white">Landlord</Link>
        </div>
      </section>
    </main>
  );
}
