import { useState } from 'react';
import { Power, Headphones, Speaker } from 'lucide-react';
import Toggle from '../components/Toggle';
import headphonesImg from '../assets/sala_audifono.png';
import speakersImg from '../assets/sala_audio.png';
import { applyProfile, buildProfile, MODE_CURVES } from '../lib/engine';
import { useI18n } from '../lib/i18n';

const MODES = [
  { id: 'game', nameKey: 'mode.game', descKey: 'mode.game.desc' },
  { id: 'movie', nameKey: 'mode.movie', descKey: 'mode.movie.desc' },
  { id: 'music', nameKey: 'mode.music', descKey: 'mode.music.desc' },
  { id: 'voice', nameKey: 'mode.voice', descKey: 'mode.voice.desc' },
];

export default function Home() {
  const { t } = useI18n();
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
          currentOutput === 'hp' ? curve.virtualizer : false,
          curve.leveler,
          enabled
        )
      );
      setStatus(t('settings.apply'));
    } catch (e) {
      setStatus(`${t('home.error')}: ${e}`);
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
                ? t('home.title.hp.on')
                : t('home.title.sp.on')
              : t('home.title.off')}
          </h1>

          <p className="hero-sub">{output === 'hp' ? t('home.sub.hp') : t('home.sub.sp')}</p>

          <div className="status-line">
            <span className={`status-dot ${on ? '' : 'off'}`}>{on ? '✓' : ''}</span>
            {on ? t('home.ready') : t('home.disabled')}
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
              {output === 'hp' ? (
                <>
                  <Headphones size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  {t('home.headphones')}
                </>
              ) : (
                <>
                  <Speaker size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  {t('home.speakers')}
                </>
              )}
            </span>
          </div>

          <div style={{ marginBottom: 22 }}>
            <Toggle checked={on} onChange={toggleOn} label={on ? t('home.enabled') : t('home.disabled')} />
          </div>

          <p className="section-label">{t('home.output')}</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button
              className={`output-card ${output === 'hp' ? 'active-hp' : ''}`}
              onClick={() => pickOutput('hp')}
            >
              <Headphones size={20} />
              {t('home.headphones')}
            </button>
            <button
              className={`output-card ${output === 'sp' ? 'active-sp' : ''}`}
              onClick={() => pickOutput('sp')}
            >
              <Speaker size={20} />
              {t('home.speakers')}
            </button>
          </div>

          <p className="section-label">{t('home.soundmode')}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {MODES.map((m) => (
              <button
                key={m.id}
                className={`eq-preset ${active === m.id ? 'active' : ''}`}
                style={{ height: 54, width: 132 }}
                onClick={() => pickMode(m.id)}
              >
                <span style={{ fontSize: 14, fontWeight: 500 }}>{t(m.nameKey)}</span>
                <span style={{ fontSize: 11, opacity: 0.65 }}>{t(m.descKey)}</span>
              </button>
            ))}
          </div>

          <div className="btn-row">
            <Power size={18} style={{ opacity: 0.7 }} />
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              {status || t('home.engine')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}