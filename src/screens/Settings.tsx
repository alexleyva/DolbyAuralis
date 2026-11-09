import { useEffect, useState } from 'react';
import { Gamepad2, Film, Music2, Mic2, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import ProfileItem from '../components/ProfileItem';
import Toggle from '../components/Toggle';
import Button from '../components/Button';
import EQSlider from '../components/EQSlider';
import {
  applyProfile,
  buildProfile,
  FREQ_LABELS,
  MODE_CURVES,
  listPresets,
  savePreset,
  deletePreset,
  Preset,
} from '../lib/engine';
import { useI18n } from '../lib/i18n';

const BUILTIN = [
  { id: 'game', name: 'Game', icon: <Gamepad2 size={19} />, descKey: 'settings.builtin.game' },
  { id: 'movie', name: 'Movie', icon: <Film size={19} />, descKey: 'settings.builtin.movie' },
  { id: 'music', name: 'Music', icon: <Music2 size={19} />, descKey: 'settings.builtin.music' },
  { id: 'voice', name: 'Voice', icon: <Mic2 size={19} />, descKey: 'settings.builtin.voice' },
];

const CATEGORIES = [
  { id: 'game', labelKey: 'cat.game', icon: <Gamepad2 size={13} /> },
  { id: 'movie', labelKey: 'cat.movie', icon: <Film size={13} /> },
  { id: 'music', labelKey: 'cat.music', icon: <Music2 size={13} /> },
  { id: 'voice', labelKey: 'cat.voice', icon: <Mic2 size={13} /> },
];

const PRESETS = ['Detailed', 'Balanced', 'Warm', 'Off'];

const PRESET_SHIFT: Record<string, number[]> = {
  Detailed: [0, 0, -1, -1, 0, 1, 2, 2, 1, 0],
  Balanced: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Warm: [2, 2, 1, 0, 0, -1, -1, -1, -1, -1],
  Off: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const ZERO = Array(10).fill(0);

export default function Settings() {
  const { t } = useI18n();
  const [active, setActive] = useState<string>('game');
  const [enabled] = useState(true);
  const [performance, setPerformance] = useState(true);
  const [virtualizer, setVirtualizer] = useState(true);
  const [leveler, setLeveler] = useState(false);
  const [preset, setPreset] = useState('Balanced');
  const [bands, setBands] = useState<number[]>(Array(10).fill(0));
  const [status, setStatus] = useState('');

  const [myPresets, setMyPresets] = useState<Preset[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [createCategory, setCreateCategory] = useState('movie');
  const [createName, setCreateName] = useState('');
  const [renaming, setRenaming] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState('');

  useEffect(() => {
    listPresets().then(setMyPresets).catch(() => {});
  }, []);

  const activeBuiltin = BUILTIN.find((b) => b.id === active);
  const activePreset = myPresets.find((p) => p.id === active);
  const isOwnPreset = !!activePreset;

  const currentName = activeBuiltin?.name ?? activePreset?.name ?? 'Settings';
  const currentDesc = activeBuiltin ? t(activeBuiltin.descKey) : t('settings.yourpreset');

  const push = async (opts?: {
    gains?: number[];
    virt?: boolean;
    lev?: boolean;
    en?: boolean;
  }) => {
    const base = MODE_CURVES[activeBuiltin?.id ?? 'music'];
    const gains = opts?.gains ?? bands;
    try {
      await applyProfile(
        buildProfile(
          gains,
          base.preamp,
          opts?.virt ?? virtualizer,
          opts?.lev ?? leveler,
          opts?.en ?? enabled
        )
      );
      setStatus('✓');
      setTimeout(() => setStatus(''), 1500);
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
  };

  const selectBuiltin = (id: string) => {
    setActive(id);
    const curve = MODE_CURVES[id];
    setBands(curve.gains);
    setVirtualizer(curve.virtualizer);
    setLeveler(curve.leveler);
    setPreset('Balanced');
    push({ gains: curve.gains, virt: curve.virtualizer, lev: curve.leveler });
  };

  const selectOwnPreset = (p: Preset) => {
    setActive(p.id);
    setBands(p.gains);
    setVirtualizer(p.virtualizer);
    setLeveler(p.leveler);
    push({ gains: p.gains, virt: p.virtualizer, lev: p.leveler });
  };

  const changeBand = (i: number, v: number) => {
    const next = bands.map((x, j) => (j === i ? v : x));
    setBands(next);
    if (isOwnPreset && activePreset) {
      const updated = { ...activePreset, gains: next };
      setMyPresets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      savePreset(updated).catch(() => {});
    }
    push({ gains: next });
  };

  const openCreate = (category: string) => {
    setCreateCategory(category);
    setCreateName('');
    setShowCreate(true);
  };

  const confirmCreate = async () => {
    const name = createName.trim();
    if (!name) return;
    const newPreset: Preset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      category: createCategory,
      gains: ZERO,
      preamp: MODE_CURVES[createCategory]?.preamp ?? -4,
      virtualizer: false,
      leveler: false,
    };
    try {
      await savePreset(newPreset);
      setMyPresets((prev) => [...prev, newPreset]);
      setShowCreate(false);
      selectOwnPreset(newPreset);
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
  };

  const confirmRename = async (p: Preset) => {
    const name = nameDraft.trim();
    if (!name) return;
    const updated = { ...p, name };
    try {
      await savePreset(updated);
      setMyPresets((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
    setRenaming(null);
  };

  const removePreset = async (p: Preset) => {
    if (!confirm(t('settings.deleteConfirm', { name: p.name }))) return;
    try {
      await deletePreset(p.id);
      setMyPresets((prev) => prev.filter((x) => x.id !== p.id));
      if (active === p.id) selectBuiltin('music');
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
  };

  const toggleVirt = (v: boolean) => {
    setVirtualizer(v);
    if (isOwnPreset && activePreset) {
      const updated = { ...activePreset, virtualizer: v };
      setMyPresets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      savePreset(updated).catch(() => {});
    }
    push({ virt: v });
  };

  const toggleLev = (v: boolean) => {
    setLeveler(v);
    if (isOwnPreset && activePreset) {
      const updated = { ...activePreset, leveler: v };
      setMyPresets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      savePreset(updated).catch(() => {});
    }
    push({ lev: v });
  };

  return (
    <div className="body">
      <aside className="sidebar">
        {BUILTIN.map((b) => (
          <ProfileItem
            key={b.id}
            icon={b.icon}
            name={b.name}
            active={active === b.id}
            enabled={active === b.id && enabled}
            onClick={() => selectBuiltin(b.id)}
          />
        ))}

        <div className="profile-divider" />

        {CATEGORIES.map((cat) => {
          const list = myPresets.filter((p) => p.category === cat.id);
          return (
            <div key={cat.id}>
              <div className="sidebar-cat">
                <span>{cat.icon} {t(cat.labelKey)}</span>
                <button
                  className="cat-add"
                  title={`${t('settings.newpreset')} (${t(cat.labelKey)})`}
                  onClick={() => openCreate(cat.id)}
                >
                  <Plus size={13} />
                </button>
              </div>
              {list.map((p) => (
                <div
                  key={p.id}
                  className={`profile-item ${active === p.id ? 'active' : ''}`}
                  onClick={() => selectOwnPreset(p)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  {renaming === p.id ? (
                    <span
                      style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && confirmRename(p)}
                        autoFocus
                        style={{
                          flex: 1,
                          minWidth: 0,
                          background: 'rgba(255,255,255,0.12)',
                          border: '1px solid rgba(255,255,255,0.4)',
                          color: '#fff',
                          borderRadius: 4,
                          padding: '4px 8px',
                          fontSize: 14,
                          fontFamily: 'inherit',
                        }}
                      />
                      <Check size={15} onClick={() => confirmRename(p)} style={{ cursor: 'pointer' }} />
                      <X size={15} onClick={() => setRenaming(null)} style={{ cursor: 'pointer' }} />
                    </span>
                  ) : (
                    <>
                      <span className="check">
                        {active === p.id && enabled && <Check size={17} strokeWidth={2.6} />}
                      </span>
                      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </span>
                      <span className="preset-row-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="preset-action"
                          title={t('settings.rename')}
                          onClick={() => {
                            setRenaming(p.id);
                            setNameDraft(p.name);
                          }}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          className="preset-action danger"
                          title={t('settings.delete')}
                          onClick={() => removePreset(p)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </aside>

      <main className="content">
        <h1 className="page-title">{currentName}</h1>
        <p className="page-desc">{currentDesc}</p>

        {active === 'game' && (
          <div style={{ marginBottom: 34 }}>
            <p className="section-label">{t('settings.performance')}</p>
            <Toggle
              checked={performance}
              onChange={(v) => {
                setPerformance(v);
                push({ gains: v ? MODE_CURVES.game.gains : bands });
              }}
              label={performance ? t('settings.on') : t('settings.off')}
              hint={t('settings.performance.hint')}
            />
          </div>
        )}

        {(active === 'game' || active === 'movie') && (
          <div style={{ marginBottom: 34 }}>
            <p className="section-label">{t('settings.intelligent')}</p>
            <div className="eq-presets">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  className={`eq-preset ${preset === p ? 'active' : ''}`}
                  onClick={() => {
                    setPreset(p);
                    const curve = MODE_CURVES[active] ?? MODE_CURVES.music;
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

        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div className="eq-scale">
            <span>12dB</span>
            <span>0dB</span>
            <span>-12dB</span>
          </div>
          <div className="eq-band-row" style={{ flex: 1 }}>
            {FREQ_LABELS.map((f, i) => (
              <EQSlider key={f} freq={f} value={bands[i]} onChange={(v) => changeBand(i, v)} />
            ))}
          </div>
        </div>

        <div className="grid-2">
          <div>
            <p className="section-label" style={{ marginBottom: 10 }}>
              {t('settings.virtualizer')}
            </p>
            <Toggle
              checked={virtualizer}
              onChange={toggleVirt}
              label={virtualizer ? t('settings.on') : t('settings.off')}
            />
          </div>
          <div>
            <p className="section-label" style={{ marginBottom: 10 }}>
              {t('settings.leveler')}
            </p>
            <Toggle
              checked={leveler}
              onChange={toggleLev}
              label={leveler ? t('settings.on') : t('settings.off')}
            />
          </div>
        </div>

        <div className="btn-row">
          <span className="badge-ready" style={{ marginBottom: 0 }}>
            <span className="dot">{enabled ? '✓' : ''}</span>
            {status || (enabled ? t('settings.enabled') : t('settings.disabled'))}
          </span>
          <Button onClick={() => push({ en: true })}>{t('settings.apply')}</Button>
          <Button
            onClick={() => {
              setBands(ZERO);
              setPreset('Balanced');
              setPerformance(true);
              setVirtualizer(true);
              setLeveler(false);
              push({ gains: ZERO, virt: true, lev: false });
            }}
          >
            {t('settings.default')}
          </Button>
        </div>
      </main>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>✨ {t('settings.newpreset')}</h3>
            <p className="modal-sub">
              {t('settings.newpreset.sub', {
                cat: t(CATEGORIES.find((c) => c.id === createCategory)?.labelKey ?? ''),
              })}
            </p>
            <input
              className="modal-input"
              placeholder={t('settings.newpreset.ph')}
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmCreate()}
              autoFocus
            />
            <div className="modal-actions">
              <Button onClick={() => setShowCreate(false)}>{t('settings.cancel')}</Button>
              <Button onClick={confirmCreate}>{t('settings.create')}</Button>
            </div>
          </div>
        </div>
      )}
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