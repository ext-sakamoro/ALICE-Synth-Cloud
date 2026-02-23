use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, sync::Arc, time::Instant};
use tracing::info;
use tracing_subscriber::EnvFilter;

// ── State ─────────────────────────────────────────────────────────────────────

#[derive(Clone)]
struct AppState {
    start_time: Instant,
}

// ── Request / Response types ──────────────────────────────────────────────────

#[derive(Debug, Deserialize)]
struct GenerateRequest {
    waveform: String,
    frequency: f64,
    duration_ms: u32,
    amplitude: f64,
}

#[derive(Debug, Serialize)]
struct GenerateResponse {
    ok: bool,
    waveform: String,
    frequency: f64,
    duration_ms: u32,
    amplitude: f64,
    samples: usize,
    message: String,
}

#[derive(Debug, Deserialize)]
struct CompressRequest {
    preset_id: String,
    format: String,
}

#[derive(Debug, Serialize)]
struct CompressResponse {
    ok: bool,
    preset_id: String,
    format: String,
    original_bytes: usize,
    compressed_bytes: usize,
    ratio: f64,
}

#[derive(Debug, Serialize)]
struct Preset {
    id: String,
    name: String,
    category: String,
    description: String,
}

#[derive(Debug, Serialize)]
struct PresetsResponse {
    ok: bool,
    presets: Vec<Preset>,
}

#[derive(Debug, Deserialize)]
struct AnalyzeRequest {
    data: Vec<f64>,
}

#[derive(Debug, Serialize)]
struct SpectrumBin {
    frequency_hz: f64,
    magnitude: f64,
    phase: f64,
}

#[derive(Debug, Serialize)]
struct AnalyzeResponse {
    ok: bool,
    sample_count: usize,
    dominant_frequency_hz: f64,
    peak_magnitude: f64,
    spectrum: Vec<SpectrumBin>,
}

#[derive(Debug, Serialize)]
struct HealthResponse {
    status: String,
    uptime_secs: u64,
}

// ── Handlers ──────────────────────────────────────────────────────────────────

async fn handle_generate(
    State(_state): State<Arc<AppState>>,
    Json(req): Json<GenerateRequest>,
) -> Result<Json<GenerateResponse>, StatusCode> {
    info!(
        waveform = %req.waveform,
        frequency = req.frequency,
        duration_ms = req.duration_ms,
        amplitude = req.amplitude,
        "generate request"
    );

    let sample_rate: f64 = 44_100.0;
    let samples = ((req.duration_ms as f64 / 1000.0) * sample_rate) as usize;

    Ok(Json(GenerateResponse {
        ok: true,
        waveform: req.waveform.clone(),
        frequency: req.frequency,
        duration_ms: req.duration_ms,
        amplitude: req.amplitude,
        samples,
        message: format!(
            "Generated {} waveform at {:.1} Hz for {} ms ({} samples)",
            req.waveform, req.frequency, req.duration_ms, samples
        ),
    }))
}

async fn handle_compress(
    State(_state): State<Arc<AppState>>,
    Json(req): Json<CompressRequest>,
) -> Result<Json<CompressResponse>, StatusCode> {
    info!(
        preset_id = %req.preset_id,
        format = %req.format,
        "compress request"
    );

    // Placeholder: simulate compression ratio based on format
    let ratio: f64 = match req.format.to_lowercase().as_str() {
        "flac" => 0.60,
        "opus" => 0.12,
        "mp3" => 0.10,
        "ogg" => 0.11,
        _ => 0.50,
    };
    let original_bytes: usize = 4_410_000; // ~10 s stereo 44.1 kHz 16-bit
    let compressed_bytes = (original_bytes as f64 * ratio) as usize;

    Ok(Json(CompressResponse {
        ok: true,
        preset_id: req.preset_id,
        format: req.format,
        original_bytes,
        compressed_bytes,
        ratio,
    }))
}

async fn handle_presets(
    State(_state): State<Arc<AppState>>,
) -> Json<PresetsResponse> {
    let presets = vec![
        Preset {
            id: "sine".into(),
            name: "Sine".into(),
            category: "Basic".into(),
            description: "Pure sinusoidal waveform — fundamental tone.".into(),
        },
        Preset {
            id: "square".into(),
            name: "Square".into(),
            category: "Basic".into(),
            description: "Square waveform — rich odd harmonics.".into(),
        },
        Preset {
            id: "sawtooth".into(),
            name: "Sawtooth".into(),
            category: "Basic".into(),
            description: "Sawtooth waveform — full harmonic series.".into(),
        },
        Preset {
            id: "triangle".into(),
            name: "Triangle".into(),
            category: "Basic".into(),
            description: "Triangle waveform — softer odd harmonics.".into(),
        },
        Preset {
            id: "noise".into(),
            name: "Noise".into(),
            category: "Basic".into(),
            description: "White noise — all frequencies equally.".into(),
        },
        Preset {
            id: "pad".into(),
            name: "Pad".into(),
            category: "Synth".into(),
            description: "Soft ambient pad — layered detuned oscillators.".into(),
        },
        Preset {
            id: "lead".into(),
            name: "Lead".into(),
            category: "Synth".into(),
            description: "Bright lead synth — sawtooth with filter sweep.".into(),
        },
        Preset {
            id: "bass".into(),
            name: "Bass".into(),
            category: "Synth".into(),
            description: "Deep sub bass — sine with slight drive.".into(),
        },
    ];

    Json(PresetsResponse { ok: true, presets })
}

async fn handle_analyze(
    State(_state): State<Arc<AppState>>,
    Json(req): Json<AnalyzeRequest>,
) -> Result<Json<AnalyzeResponse>, StatusCode> {
    info!(sample_count = req.data.len(), "analyze request");

    if req.data.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Naive DFT for small inputs; placeholder for large inputs
    let n = req.data.len().min(512);
    let sample_rate = 44_100.0_f64;
    let mut spectrum = Vec::with_capacity(n / 2);
    let mut peak_magnitude: f64 = 0.0;
    let mut dominant_bin = 0usize;

    for k in 0..(n / 2) {
        let mut re = 0.0_f64;
        let mut im = 0.0_f64;
        for (i, &x) in req.data[..n].iter().enumerate() {
            let angle = -2.0 * std::f64::consts::PI * (k as f64) * (i as f64) / (n as f64);
            re += x * angle.cos();
            im += x * angle.sin();
        }
        let magnitude = (re * re + im * im).sqrt() / (n as f64);
        let phase = im.atan2(re);
        let frequency_hz = (k as f64) * sample_rate / (n as f64);

        if magnitude > peak_magnitude {
            peak_magnitude = magnitude;
            dominant_bin = k;
        }

        spectrum.push(SpectrumBin {
            frequency_hz,
            magnitude,
            phase,
        });
    }

    let dominant_frequency_hz = (dominant_bin as f64) * sample_rate / (n as f64);

    Ok(Json(AnalyzeResponse {
        ok: true,
        sample_count: req.data.len(),
        dominant_frequency_hz,
        peak_magnitude,
        spectrum,
    }))
}

async fn handle_health(State(state): State<Arc<AppState>>) -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".into(),
        uptime_secs: state.start_time.elapsed().as_secs(),
    })
}

// ── Main ──────────────────────────────────────────────────────────────────────

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("synth_engine=info")),
        )
        .init();

    let state = Arc::new(AppState {
        start_time: Instant::now(),
    });

    let app = Router::new()
        .route("/health", get(handle_health))
        .route("/api/v1/synth/generate", post(handle_generate))
        .route("/api/v1/synth/compress", post(handle_compress))
        .route("/api/v1/synth/presets", get(handle_presets))
        .route("/api/v1/synth/analyze", post(handle_analyze))
        .with_state(state);

    let addr_str = std::env::var("SYNTH_ADDR").unwrap_or_else(|_| "0.0.0.0:8081".into());
    let addr: SocketAddr = addr_str.parse().expect("invalid SYNTH_ADDR");

    info!("ALICE Synth Engine listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.expect("bind failed");
    axum::serve(listener, app).await.expect("server error");
}
