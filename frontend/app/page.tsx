import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-xl font-bold tracking-tight">
          ALICE Synth Cloud
        </span>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <Link href="/dashboard/console" className="hover:text-white transition-colors">
            Console
          </Link>
          <a
            href="https://github.com/ext-sakamoro/alice-synth-cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8 py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs text-white/60 bg-white/5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Powered by ALICE-Synth
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-none max-w-4xl">
          ALICE{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            Synth
          </span>{" "}
          Cloud
        </h1>

        <p className="text-xl sm:text-2xl font-medium text-white/70 italic max-w-2xl">
          &ldquo;Don&rsquo;t sample sounds.{" "}
          <span className="text-white not-italic font-semibold">
            Synthesize the law of waveforms.
          </span>
          &rdquo;
        </p>

        <p className="text-base text-white/50 max-w-xl leading-relaxed">
          Cloud audio synthesis powered by ALICE-Synth. Generate, compress,
          and analyze waveforms at scale — entirely in the cloud.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            href="/dashboard/console"
            className="rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors px-6 py-3 text-sm font-semibold"
          >
            Open Console
          </Link>
          <a
            href="#features"
            className="rounded-lg border border-white/20 hover:border-white/40 transition-colors px-6 py-3 text-sm font-semibold text-white/70 hover:text-white"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: "~",
              title: "Waveform Synthesis",
              desc: "Generate sine, square, sawtooth, triangle, noise, pad, lead, and bass waveforms at any frequency and duration.",
            },
            {
              icon: "#",
              title: "Preset Library",
              desc: "8 built-in synthesis presets covering basic oscillators and advanced synth timbres, ready to use out of the box.",
            },
            {
              icon: "=",
              title: "Spectrum Analysis",
              desc: "Real-time DFT-based spectrum analysis. Identify dominant frequencies and magnitude distribution across your audio data.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-3 hover:border-white/20 transition-colors"
            >
              <span className="text-2xl font-mono text-violet-400">{f.icon}</span>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-5 flex items-center justify-between text-xs text-white/30">
        <span>ALICE Synth Cloud</span>
        <span>AGPL-3.0 &mdash; Project A.L.I.C.E.</span>
      </footer>
    </main>
  );
}
