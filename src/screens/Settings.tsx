import { useState } from 'react';
import { Gamepad2, Film, Music2, Mic2, User } from 'lucide-react';
import ProfileItem from '../components/ProfileItem';
import Toggle from '../components/Toggle';
import Button from '../components/Button';
import EQSlider from '../components/EQSlider';
import { applyProfile, buildProfile, FREQ_LABELS, MODE_CURVES } from '../lib/engine';

const PROFILES = [
  { id: 'game', name: 'Game', icon: <Gamepad2 size={19} />, desc: 'Distinct sound placement makes it easier to locate sounds at any angle' },
  { id: 'movie', name: 'Movie', icon: <Film size={19} />, desc: 'Cinematic presence with deep bass and clear dialogue' },
  { id: 'music', name: 'Music', icon: <Music2 size={19} />, desc: 'Balanced, detailed sound for all genres' },
  { id: 'voice', name: 'Voice', icon: <Mic2 size={19} />, desc: 'Enhanced clarity for podcasts, calls and streaming' },
  { id: 'custom1', name: 'Custom 1', icon: <User size={19} />, desc: 'Your own equalizer curve' },
  { id: 'custom2', name: 'Custom 2', icon: <User size={19} />, desc: 'Your own equalizer curve' },
  { id: 'custom3', name: 'Custom 3', icon: <User size={19} />, desc: 'Your own equalizer curve' },
];

const PRESETS = ['Detailed', 'Balanced', 'Warm', 'Off'];

const PRESET_SHIFT: Record<string, number[]> = {
  Detailed: [0, 0, -1, -1, 0, 1, 2, 2, 1, 0],
  Balanced: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Warm: [2, 2, 1, 0, 0, -1, -1, -1, -1, -1],
  Off: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

export default function Settings() {
  const [profile, setProfile] = useState('game');
  const [enabled] = useState(true);
  const [performance, setPerformance] = useState(true);
  const [virtualizer, setVirtualizer] = useState(true);
  const [leveler, setLeveler] = useState(false);
  const [preset, setPreset] = useState('Balanced');
  const [bands, setBands] = useState<number[]>(Array(10).fill(0));
  const [status, setStatus] = useState('');

  const current = PROFILES.find((p) => p.id === profile)!;

  const push = async (opts?: {
    gains?: number[];
    virt?: boolean;
    lev?: boolean;
    en?: boolean;
    prof?: string;
  }) => {
    const profId = opts?.prof ?? profile;
    const curve = MODE_CURVES[profId] ?? MODE_CURVES.music;
    const gains =
      opts?.gains ??
      (profId.startsWith('custom')
        ? bands
        : curve.gains.map((g, i) => g + (PRESET_SHIFT[preset]?.[i] ?? 0)));

    try {
      await applyProfile(
        buildProfile(
          gains,
          curve.preamp,
          opts?.virt ?? virtualizer,
          opts?.lev ?? leveler,
          opts?.en ?? enabled
        )
      );
      setStatus('Aplicado ✓');
      setTimeout(() => setStatus(''), 1500);
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
  };

  const selectProfile = (id: string) => {
    setProfile(id);
    const curve = MODE_CURVES[id];
    if (curve) {
      setBands(curve.gains);
      setVirtualizer(curve.virtualizer);
      setLeveler(curve.leveler);
    }
    push({ prof: id, gains: curve ? curve.gains : bands });
  };

  return (
    <div className="body">
      <aside className="sidebar">
        {PROFILES.slice(0, 4).map((p) => (
          <ProfileItem
            key={p.id}
            icon={p.icon}
            name={p.name}
            active={profile === p.id}
            enabled={profile === p.id && enabled}
            onClick={() => selectProfile(p.id)}
          />
        ))}
        <div className="profile-divider" />
        {PROFILES.slice(4).map((p) => (
          <ProfileItem
            key={p.id}
            icon={p.icon}
            name={p.name}
            active={profile === p.id}
            enabled={profile === p.id && enabled}
            onClick={() => selectProfile(p.id)}
          />
        ))}
      </aside>

      <main className="content">
        <h1 className="page-title">{current.name}</h1>
        <p className="page-desc">{current.desc}</p>

        {profile === 'game' && (
          <div style={{ marginBottom: 34 }}>
            <p className="section-label">Performance Mode</p>
            <Toggle
              checked={performance}
              onChange={(v) => {
                setPerformance(v);
                push({ gains: v ? MODE_CURVES.game.gains : bands });
              }}
              label={performance ? 'On' : 'Off'}
              hint="Performance mode prioritizes positional accuracy for competitive gaming"
            />
          </div>
        )}

        {(profile === 'game' || profile === 'movie') && (
          <div style={{ marginBottom: 34 }}>
            <p className="section-label">Intelligent Equalizer</p>
            <div className="eq-presets">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  className={`eq-preset ${preset === p ? 'active' : ''}`}
                  onClick={() => {
                    setPreset(p);
                    const curve = MODE_CURVES[profile] ?? MODE_CURVES.music;
                    push({ gains: curve.gains.map((g, i) => g + (PRESET_SHIFT[p]?.[i] ?? 0)) });
                  }}
                >
                  <PresetCurve kind={p} />
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {(profile.startsWith('custom') || profile === 'game' || profile === 'movie') && (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div className="eq-scale">
                <span>12dB</span>
                <span>0dB</span>
                <span>-12dB</span>
              </div>
              <div className="eq-band-row" style={{ flex: 1 }}>
                {FREQ_LABELS.map((f, i) => (
                  <EQSlider
                    key={f}
                    freq={f}
                    value={bands[i]}
                    onChange={(v) => {
                      const next = bands.map((x, j) => (j === i ? v : x));
                      setBands(next);
                      push({ gains: next });
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="grid-2">
              <div>
                <p className="section-label" style={{ marginBottom: 10 }}>
                  Surround virtualizer
                </p>
                <Toggle
                  checked={virtualizer}
                  onChange={(v) => {
                    setVirtualizer(v);
                    push({ virt: v });
                  }}
                  label={virtualizer ? 'On' : 'Off'}
                />
              </div>
              <div>
                <p className="section-label" style={{ marginBottom: 10 }}>
                  Volume leveler
                </p>
                <Toggle
                  checked={leveler}
                  onChange={(v) => {
                    setLeveler(v);
                    push({ lev: v });
                  }}
                  label={leveler ? 'On' : 'Off'}
                />
              </div>
            </div>
          </>
        )}

        <div className="btn-row">
          <span className="badge-ready" style={{ marginBottom: 0 }}>
            <span className="dot">{enabled ? '✓' : ''}</span>
            {status || (enabled ? 'Enabled' : 'Disabled')}
          </span>
          <Button onClick={() => push({ en: true })}>Apply</Button>
          <Button
            onClick={() => {
              const zero = Array(10).fill(0);
              setBands(zero);
              setPreset('Balanced');
              setPerformance(true);
              setVirtualizer(true);
              setLeveler(false);
              push({ gains: zero, virt: true, lev: false });
            }}
          >
            Default
          </Button>
        </div>
      </main>
    </div>
  );
}

function PresetCurve({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    Detailed: 'M2 26 C 12 10, 24 4, 38 8 S 60 24, 78 18 S 92 12, 100 14',
    Balanced: 'M2 22 C 18 22, 30 16, 44 16 S 66 20, 78 22 S 94 24, 100 24',
    Warm: 'M2 12 C 14 4, 28 8, 40 18 S 64 30, 80 28 S 96 26, 100 26',
    Off: 'M2 22 L 100 22',
  };
  return (
    <svg width="104" height="34" viewBox="0 0 102 34" fill="none">
      <path d={paths[kind]} stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}