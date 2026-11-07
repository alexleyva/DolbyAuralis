import { useState } from 'react';
import { Headphones, Speaker, Check } from 'lucide-react';
import headphonesImg from '../assets/sala_audifono.png';
import speakersImg from '../assets/sala_audio.png';

export default function Products() {
  const [selected, setSelected] = useState<'hp' | 'ht'>('hp');

  return (
    <div className="body">
      <div className="products-layout">
        <div>
          <img
            key={selected}
            src={selected === 'hp' ? headphonesImg : speakersImg}
            alt=""
            className="hero-illustration"
          />
        </div>

        <div>
          <div className="product-cards">
            <button
              className={`product-card ${selected === 'hp' ? 'active' : ''}`}
              onClick={() => setSelected('hp')}
              style={
                selected === 'hp'
                  ? {
                      borderColor: '#ff5c9d',
                      boxShadow:
                        '0 0 20px rgba(255,45,120,0.5), inset 0 0 22px rgba(255,45,120,0.14)',
                    }
                  : undefined
              }
            >
              <Headphones size={46} strokeWidth={1.1} />
            </button>
            <button
              className={`product-card ${selected === 'ht' ? 'active' : ''}`}
              onClick={() => setSelected('ht')}
            >
              <Speaker size={46} strokeWidth={1.1} />
            </button>
          </div>

          <h1 className="page-title" style={{ fontSize: 34, marginBottom: 12 }}>
            {selected === 'hp' ? 'Spatial Audio for Headphones' : 'Spatial Audio for Speakers'}
          </h1>

          <p className="badge-ready">
            <span className="dot">
              <Check size={12} strokeWidth={3.4} />
            </span>
            Ready to use
          </p>

          <div className="divider" />

          <p className="page-desc" style={{ marginBottom: 0 }}>
            {selected === 'hp'
              ? 'Delivers a premium, immersive audio experience through any set of headphones, processed locally by Equalizer APO + HeSuVi.'
              : 'Room-filling 7.1 spatial audio for your speaker setup, with per-channel distance and level calibration.'}
          </p>
        </div>
      </div>
    </div>
  );
}