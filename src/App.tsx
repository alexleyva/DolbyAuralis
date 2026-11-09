import { useState } from 'react';
import { Info } from 'lucide-react';
import Logo from './components/Logo';
import Home from './screens/Home';
import Products from './screens/Products';
import Settings from './screens/Settings';
import { I18nProvider, useI18n } from './lib/i18n';

type Screen = 'home' | 'products' | 'settings';

function Shell() {
  const [screen, setScreen] = useState<Screen>('home');
  const { t, lang, setLang } = useI18n();

  return (
    <div className="app-shell">
      <header className="header">
        <Logo />
        <nav className="nav">
          {(['home', 'products', 'settings'] as Screen[]).map((s) => (
            <button
              key={s}
              className={`nav-item ${screen === s ? 'active' : ''}`}
              onClick={() => setScreen(s)}
            >
              {t(`nav.${s}`)}
            </button>
          ))}
        </nav>
        <div className="header-status">
          <span style={{ marginRight: 14 }}>{t('header.engine')}</span>
          <div style={{ display: 'flex', gap: 4, marginRight: 14 }}>
            <button
              onClick={() => setLang('es')}
              style={{
                background: lang === 'es' ? '#fff' : 'transparent',
                color: lang === 'es' ? '#0d3446' : 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 4,
                padding: '3px 9px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ES
            </button>
            <button
              onClick={() => setLang('en')}
              style={{
                background: lang === 'en' ? '#fff' : 'transparent',
                color: lang === 'en' ? '#0d3446' : 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 4,
                padding: '3px 9px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              EN
            </button>
          </div>
          <Info size={16} />
        </div>
      </header>

      {screen === 'home' && <Home />}
      {screen === 'products' && <Products />}
      {screen === 'settings' && <Settings />}
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  );
}