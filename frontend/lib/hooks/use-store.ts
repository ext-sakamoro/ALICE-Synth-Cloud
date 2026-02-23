"use client";

import { useState, useCallback } from "react";

export interface SynthState {
  waveform: string;
  frequency: number;
  duration: number;
  amplitude: number;
  result: Record<string, unknown> | null;
  loading: boolean;
}

export interface SynthActions {
  setWaveform: (waveform: string) => void;
  setFrequency: (frequency: number) => void;
  setDuration: (duration: number) => void;
  setAmplitude: (amplitude: number) => void;
  setResult: (result: Record<string, unknown> | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export type UseSynthStore = SynthState & SynthActions;

const DEFAULT_STATE: SynthState = {
  waveform: "sine",
  frequency: 440,
  duration: 1000,
  amplitude: 0.8,
  result: null,
  loading: false,
};

export function useSynthStore(): UseSynthStore {
  const [state, setState] = useState<SynthState>(DEFAULT_STATE);

  const setWaveform = useCallback((waveform: string) => {
    setState((s) => ({ ...s, waveform }));
  }, []);

  const setFrequency = useCallback((frequency: number) => {
    setState((s) => ({ ...s, frequency }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setState((s) => ({ ...s, duration }));
  }, []);

  const setAmplitude = useCallback((amplitude: number) => {
    setState((s) => ({ ...s, amplitude }));
  }, []);

  const setResult = useCallback((result: Record<string, unknown> | null) => {
    setState((s) => ({ ...s, result }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((s) => ({ ...s, loading }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    ...state,
    setWaveform,
    setFrequency,
    setDuration,
    setAmplitude,
    setResult,
    setLoading,
    reset,
  };
}
