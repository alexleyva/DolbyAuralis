import { useState } from 'react';
import { Info } from 'lucide-react';
import Logo from './components/Logo';
import Home from './screens/Home';
import Products from './screens/Products';
import Settings from './screens/Settings';

type Screen = 'home' | 'products' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

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
              {s}
            </button>
          ))}
        </nav>
        <div className="header-status">
          Local engine
          <Info size={16} />
        </div>
      </header>

      {screen === 'home' && <Home />}
      {screen === 'products' && <Products />}
      {screen === 'settings' && <Settings />}
    </div>
  );
}