# ALICE Synth Cloud

Cloud audio synthesis powered by Project A.L.I.C.E.

License: AGPL-3.0

## Architecture

| Service | Port | Description |
|---------|------|-------------|
| Frontend (Next.js) | 3000 | UI console and landing page |
| API Gateway | 8080 | Reverse proxy / auth layer |
| Synth Engine (Rust/Axum) | 8081 | Core synthesis computation |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/synth/generate` | Generate a waveform |
| POST | `/api/v1/synth/compress` | Compress audio with a preset |
| GET | `/api/v1/synth/presets` | List available presets |
| POST | `/api/v1/synth/analyze` | Spectrum analysis of audio data |
| GET | `/health` | Engine health check |

## Presets

`sine`, `square`, `sawtooth`, `triangle`, `noise`, `pad`, `lead`, `bass`

## Quick Start

```bash
# Run the Synth Engine
cd services/core-engine
cargo run --release

# Run the Frontend
cd frontend
npm install
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SYNTH_ADDR` | `0.0.0.0:8081` | Synth engine bind address |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | API gateway URL for the frontend |

## License

AGPL-3.0 — Project A.L.I.C.E.
