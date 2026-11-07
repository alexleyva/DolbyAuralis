import { invoke } from '@tauri-apps/api/core';

export type Band = { freq: number; gain: number; q: number };

export type ProfileConfig = {
  bands: Band[];
  preamp: number;
  virtualizer: boolean;
  leveler: boolean;
  enabled: boolean;
};

export type EngineStatus = {
  apo_installed: boolean;
  config_path: string;
  hrir_count: number;
  leveler_available: boolean;
};

export const engineStatus = () => invoke<EngineStatus>('engine_status');
export const listHrirs = () => invoke<string[]>('list_hrirs');
export const applyProfile = (profile: ProfileConfig) =>
  invoke<string>('apply_profile', { profile });

// Frecuencias del EQ (10 bandas)
export const FREQS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
export const FREQ_LABELS = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'];

// Curvas por modo (gain en dB por banda)
export const MODE_CURVES: Record<string, { gains: number[]; preamp: number; virtualizer: boolean; leveler: boolean }> = {
  game: {
    gains: [2, 3, 1, -2, -1, 1, 4, 5, 3, 1],
    preamp: -5,
    virtualizer: true,
    leveler: false,
  },
  movie: {
    gains: [5, 4, 1, -1, 1, 2, 3, 2, 1, 0],
    preamp: -6,
    virtualizer: true,
    leveler: true,
  },
  music: {
    gains: [3, 2, 0, 0, 0, 0, 1, 2, 2, 1],
    preamp: -4,
    virtualizer: false,
    leveler: false,
  },
  voice: {
    gains: [-4, -5, -3, 0, 2, 4, 5, 3, 0, -2],
    preamp: -4,
    virtualizer: false,
    leveler: true,
  },
};

export function buildProfile(
  gains: number[],
  preamp: number,
  virtualizer: boolean,
  leveler: boolean,
  enabled = true
): ProfileConfig {
  return {
    bands: FREQS.map((freq, i) => ({ freq, gain: gains[i] ?? 0, q: 1.2 })),
    preamp,
    virtualizer,
    leveler,
    enabled,
  };
}