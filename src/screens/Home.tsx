import { useState } from 'react';
import { Power, Headphones, Speaker } from 'lucide-react';
import Toggle from '../components/Toggle';
import headphonesImg from '../assets/sala_audifono.png';
import speakersImg from '../assets/sala_audio.png';
import { applyProfile, buildProfile, MODE_CURVES } from '../lib/engine';

const MODES = [
  { id: 'game', name: 'Game', desc: 'Positional accuracy' },
  { id: 'movie', name: 'Movie', desc: 'Cinematic immersion' },
  { id: 'music', name: 'Music', desc: 'Detailed and balanced' },
  { id: 'voice', name: 'Voice', desc: 'Crystal clear dialogue' },
];

export default function Home() {
  const [output, setOutput] = useState<'hp' | 'sp'>('hp');
  const [active, setActive] = useState('movie');
  const [on, setOn] = useState(true);
  const [status, setStatus] = useState('');

  const apply = async (modeId: string, enabled: boolean, currentOutput: 'hp' | 'sp') => {
    const curve = MODE_CURVES[modeId];
    try {
      await applyProfile(
        buildProfile(
          curve.gains,
          curve.preamp,
          // Virtualización solo para auriculares
          currentOutput === 'hp' ? curve.virtualizer : false,
          curve.leveler,
          enabled
        )
      );
      setStatus(`Aplicado: ${modeId.toUpperCase()}`);
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
  };

  const pickMode = (id: string) => {
    setActive(id);
    apply(id, on, output);
  };

  const pickOutput = (o: 'hp' | 'sp') => {
    setOutput(o);
    apply(active, on, o);
  };

  const toggleOn = (v: boolean) => {
    setOn(v);
    apply(active, v, output);
  };

  return (
    <div className="body">
      <div className="hero">
        <div>
          <img
            key={output}
            src={output === 'hp' ? headphonesImg : speakersImg}
            alt=""
            className="hero-illustration"
          />
        </div>

        <div>
          <h1 className="hero-title">
            {on
              ? output === 'hp'
                ? 'Immersive audio is active'
                : 'Room-filling sound is active'
              : 'Audio processing is off'}
          </h1>

          <p className="hero-sub">
            {output === 'hp'
              ? 'Premium spatial sound through any set of headphones, powered by your own Equalizer APO + HeSuVi engine.'
              : 'Full 7.1 virtualized surround for your speakers, calibrated per channel by your local engine.'}
          </p>

          <div className="status-line">
            <span className={`status-dot ${on ? '' : 'off'}`}>{on ? '✓' : ''}</span>
            {on ? 'Ready to use' : 'Disabled'}
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
              {output === 'hp' ? (
                <>
                  <Headphones size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Headphones
                </>
              ) : (
                <>
                  <Speaker size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  7.1 Speakers
                </>
              )}
            </span>
          </div>

          <div style={{ marginBottom: 22 }}>
            <Toggle checked={on} onChange={toggleOn} label={on ? 'Enabled' : 'Disabled'} />
          </div>

          <p className="section-label">Output</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button
              className={`output-card ${output === 'hp' ? 'active-hp' : ''}`}
              onClick={() => pickOutput('hp')}
            >
              <Headphones size={20} />
              Headphones
            </button>
            <button
              className={`output-card ${output === 'sp' ? 'active-sp' : ''}`}
              onClick={() => pickOutput('sp')}
            >
              <Speaker size={20} />
              7.1 Speakers
            </button>
          </div>

          <p className="section-label">Sound mode</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {MODES.map((m) => (
              <button
                key={m.id}
                className={`eq-preset ${active === m.id ? 'active' : ''}`}
                style={{ height: 54, width: 132 }}
                onClick={() => pickMode(m.id)}
              >
                <span style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</span>
                <span style={{ fontSize: 11, opacity: 0.65 }}>{m.desc}</span>
              </button>
            ))}
          </div>

          <div className="btn-row">
            <Power size={18} style={{ opacity: 0.7 }} />
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              {status || 'Engine: Equalizer APO + HeSuVi'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}