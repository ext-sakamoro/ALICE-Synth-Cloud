-- Synth Cloud domain tables
create table if not exists public.synth_presets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    synth_type text not null check (synth_type in ('subtractive', 'fm', 'wavetable', 'granular', 'additive')),
    oscillators jsonb default '[]',
    filters jsonb default '[]',
    envelopes jsonb default '[]',
    effects jsonb default '[]',
    is_public boolean default false,
    created_at timestamptz default now()
);
create table if not exists public.render_audio_jobs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    preset_id uuid references public.synth_presets(id),
    midi_data jsonb,
    duration_ms bigint,
    sample_rate integer default 48000,
    output_format text default 'wav',
    status text default 'pending',
    output_url text,
    created_at timestamptz default now()
);
create index idx_synth_presets_user on public.synth_presets(user_id);
create index idx_synth_presets_type on public.synth_presets(synth_type);
