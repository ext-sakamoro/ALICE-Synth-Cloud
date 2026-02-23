"use client";

import { useSynthStore } from "@/lib/hooks/use-store";
import { SynthClient } from "@/lib/api/client";

const WAVEFORMS = ["sine", "square", "sawtooth", "triangle", "noise"] as const;

export default function SynthConsolePage() {
  const {
    waveform,
    frequency,
    duration,
    amplitude,
    result,
    loading,
    setWaveform,
    setFrequency,
    setDuration,
    setAmplitude,
    setResult,
    setLoading,
  } = useSynthStore();

  async function handleGenerate() {
    setLoading(true);
    setResult(null);
    try {
      const client = new SynthClient();
      const data = await client.generate({
        waveform,
        frequency,
        duration_ms: duration,
        amplitude,
      });
      setResult(data as unknown as Record<string, unknown>);
    } catch (err) {
      setResult({ ok: false, message: String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Synth Console</h1>
          <p className="text-xs text-white/40 mt-0.5">
            ALICE Synth Cloud &mdash; Waveform Generator
          </p>
        </div>
        <span className="text-xs text-white/30">Core Engine :8081</span>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <section className="flex flex-col gap-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
            Parameters
          </h2>

          {/* Waveform selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50">Waveform</label>
            <div className="flex flex-wrap gap-2">
              {WAVEFORMS.map((w) => (
                <button
                  key={w}
                  onClick={() => setWaveform(w)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    waveform === w
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {w.charAt(0).toUpperCase() + w.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency slider */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 flex justify-between">
              <span>Frequency</span>
              <span className="text-white font-mono">{frequency.toFixed(0)} Hz</span>
            </label>
            <input
              type="range"
              min={20}
              max={20000}
              step={1}
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-white/25">
              <span>20 Hz</span>
              <span>20 000 Hz</span>
            </div>
          </div>

          {/* Duration input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50">Duration (ms)</label>
            <input
              type="number"
              min={1}
              max={60000}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Amplitude slider */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 flex justify-between">
              <span>Amplitude</span>
              <span className="text-white font-mono">{amplitude.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={amplitude}
              onChange={(e) => setAmplitude(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-white/25">
              <span>0.00</span>
              <span>1.00</span>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-6 py-3 text-sm font-semibold"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </section>

        {/* Result panel */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
            Result
          </h2>

          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-5 min-h-64 font-mono text-xs overflow-auto">
            {!result && !loading && (
              <p className="text-white/25 italic">
                Configure parameters and press Generate.
              </p>
            )}
            {loading && (
              <p className="text-violet-400 animate-pulse">Processing...</p>
            )}
            {result && (
              <pre className="text-emerald-300 whitespace-pre-wrap break-all">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>

          {result && Boolean(result.ok) && (
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Waveform",
                  value: (result.waveform as string | undefined) ?? "-",
                },
                {
                  label: "Frequency",
                  value: `${(result.frequency as number | undefined) ?? 0} Hz`,
                },
                {
                  label: "Samples",
                  value: ((result.samples as number | undefined) ?? 0).toLocaleString(),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/10 bg-white/5 p-3 flex flex-col gap-1"
                >
                  <span className="text-xs text-white/40">{stat.label}</span>
                  <span className="text-sm font-semibold font-mono">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
