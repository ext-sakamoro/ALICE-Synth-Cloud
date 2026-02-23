const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface GenerateRequest {
  waveform: string;
  frequency: number;
  duration_ms: number;
  amplitude: number;
}

export interface GenerateResponse {
  ok: boolean;
  waveform: string;
  frequency: number;
  duration_ms: number;
  amplitude: number;
  samples: number;
  message: string;
}

export interface CompressRequest {
  preset_id: string;
  format: string;
}

export interface CompressResponse {
  ok: boolean;
  preset_id: string;
  format: string;
  original_bytes: number;
  compressed_bytes: number;
  ratio: number;
}

export interface Preset {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface PresetsResponse {
  ok: boolean;
  presets: Preset[];
}

export interface AnalyzeRequest {
  data: number[];
}

export interface SpectrumBin {
  frequency_hz: number;
  magnitude: number;
  phase: number;
}

export interface AnalyzeResponse {
  ok: boolean;
  sample_count: number;
  dominant_frequency_hz: number;
  peak_magnitude: number;
  spectrum: SpectrumBin[];
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export class SynthClient {
  private readonly base: string;

  constructor(base?: string) {
    this.base = base ?? BASE_URL;
  }

  generate(body: GenerateRequest): Promise<GenerateResponse> {
    return request<GenerateResponse>("/api/v1/synth/generate", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  compress(body: CompressRequest): Promise<CompressResponse> {
    return request<CompressResponse>("/api/v1/synth/compress", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  presets(): Promise<PresetsResponse> {
    return request<PresetsResponse>("/api/v1/synth/presets");
  }

  analyze(body: AnalyzeRequest): Promise<AnalyzeResponse> {
    return request<AnalyzeResponse>("/api/v1/synth/analyze", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}
