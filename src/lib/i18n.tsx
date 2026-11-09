import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'es' | 'en';

const DICT: Record<Lang, Record<string, string>> = {
  es: {
    'nav.home': 'INICIO',
    'nav.products': 'PRODUCTOS',
    'nav.settings': 'AJUSTES',
    'header.engine': 'Motor local',
    'home.title.hp.on': 'Audio inmersivo activo',
    'home.title.sp.on': 'Sonido envolvente activo',
    'home.title.off': 'Procesamiento de audio apagado',
    'home.sub.hp': 'Sonido espacial premium en cualquier auricular, impulsado por tu motor Equalizer APO + HeSuVi.',
    'home.sub.sp': 'Surround 7.1 virtualizado para tus altavoces, calibrado por canal con tu motor local.',
    'home.ready': 'Listo para usar',
    'home.enabled': 'Activado',
    'home.disabled': 'Desactivado',
    'home.headphones': 'Auriculares',
    'home.speakers': 'Altavoces 7.1',
    'home.output': 'Salida',
    'home.soundmode': 'Modo de sonido',
    'home.engine': 'Motor: Equalizer APO + HeSuVi',
    'mode.game': 'Juego',
    'mode.game.desc': 'Precisión posicional',
    'mode.movie': 'Película',
    'mode.movie.desc': 'Inmersión cinematográfica',
    'mode.music': 'Música',
    'mode.music.desc': 'Detallado y equilibrado',
    'mode.voice': 'Voz',
    'mode.voice.desc': 'Diálogos nítidos',
    'products.title.hp': 'Audio espacial para auriculares',
    'products.title.ht': 'Audio espacial para altavoces',
    'products.desc.hp': 'Experiencia de audio premium e inmersiva en cualquier auricular, procesada localmente por Equalizer APO + HeSuVi.',
    'products.desc.ht': 'Audio espacial envolvente para tu sistema de altavoces, con calibración por canal.',
    'settings.builtin.game': 'La ubicación clara del sonido facilita localizarlo desde cualquier ángulo',
    'settings.builtin.movie': 'Presencia cinematográfica con graves profundos y diálogos claros',
    'settings.builtin.music': 'Sonido equilibrado y detallado para todos los géneros',
    'settings.builtin.voice': 'Claridad mejorada para podcasts, llamadas y streaming',
    'settings.yourpreset': 'Tu preset personalizado',
    'settings.performance': 'Modo rendimiento',
    'settings.performance.hint': 'El modo rendimiento prioriza la precisión posicional para juegos competitivos',
    'settings.intelligent': 'Ecualizador inteligente',
    'settings.virtualizer': 'Virtualizador surround',
    'settings.leveler': 'Nivelador de volumen',
    'settings.on': 'Activado',
    'settings.off': 'Desactivado',
    'settings.apply': 'Aplicar',
    'settings.default': 'Predeterminado',
    'settings.newpreset': 'Nuevo preset',
    'settings.newpreset.sub': 'Categoría: {cat} — empezará con la curva plana para que la ajustes a tu gusto.',
    'settings.newpreset.ph': 'Nombre (ej. Cine de terror)',
    'settings.cancel': 'Cancelar',
    'settings.create': 'Crear',
    'settings.rename': 'Renombrar',
    'settings.delete': 'Eliminar',
    'settings.deleteConfirm': '¿Eliminar el preset "{name}"?',
    'cat.game': 'Juegos',
    'cat.movie': 'Películas',
    'cat.music': 'Música',
    'cat.voice': 'Voces',
    'settings.enabled': 'Activado',
    'settings.disabled': 'Desactivado',
  },
  en: {
    'nav.home': 'HOME',
    'nav.products': 'PRODUCTS',
    'nav.settings': 'SETTINGS',
    'header.engine': 'Local engine',
    'home.title.hp.on': 'Immersive audio is active',
    'home.title.sp.on': 'Room-filling sound is active',
    'home.title.off': 'Audio processing is off',
    'home.sub.hp': 'Premium spatial sound through any set of headphones, powered by your own Equalizer APO + HeSuVi engine.',
    'home.sub.sp': 'Full 7.1 virtualized surround for your speakers, calibrated per channel by your local engine.',
    'home.ready': 'Ready to use',
    'home.enabled': 'Enabled',
    'home.disabled': 'Disabled',
    'home.headphones': 'Headphones',
    'home.speakers': '7.1 Speakers',
    'home.output': 'Output',
    'home.soundmode': 'Sound mode',
    'home.engine': 'Engine: Equalizer APO + HeSuVi',
    'mode.game': 'Game',
    'mode.game.desc': 'Positional accuracy',
    'mode.movie': 'Movie',
    'mode.movie.desc': 'Cinematic immersion',
    'mode.music': 'Music',
    'mode.music.desc': 'Detailed and balanced',
    'mode.voice': 'Voice',
    'mode.voice.desc': 'Crystal clear dialogue',
    'products.title.hp': 'Spatial Audio for Headphones',
    'products.title.ht': 'Spatial Audio for Speakers',
    'products.desc.hp': 'Delivers a premium, immersive audio experience through any set of headphones, processed locally by Equalizer APO + HeSuVi.',
    'products.desc.ht': 'Room-filling 7.1 spatial audio for your speaker setup, with per-channel distance and level calibration.',
    'settings.builtin.game': 'Distinct sound placement makes it easier to locate sounds at any angle',
    'settings.builtin.movie': 'Cinematic presence with deep bass and clear dialogue',
    'settings.builtin.music': 'Balanced, detailed sound for all genres',
    'settings.builtin.voice': 'Enhanced clarity for podcasts, calls and streaming',
    'settings.yourpreset': 'Your custom preset',
    'settings.performance': 'Performance Mode',
    'settings.performance.hint': 'Performance mode prioritizes positional accuracy for competitive gaming',
    'settings.intelligent': 'Intelligent Equalizer',
    'settings.virtualizer': 'Surround virtualizer',
    'settings.leveler': 'Volume leveler',
    'settings.on': 'On',
    'settings.off': 'Off',
    'settings.apply': 'Apply',
    'settings.default': 'Default',
    'settings.newpreset': 'New preset',
    'settings.newpreset.sub': 'Category: {cat} — starts with a flat curve so you can shape it your way.',
    'settings.newpreset.ph': 'Name (e.g. Horror movie)',
    'settings.cancel': 'Cancel',
    'settings.create': 'Create',
    'settings.rename': 'Rename',
    'settings.delete': 'Delete',
    'settings.deleteConfirm': 'Delete preset "{name}"?',
    'cat.game': 'Games',
    'cat.movie': 'Movies',
    'cat.music': 'Music',
    'cat.voice': 'Voices',
    'settings.enabled': 'Enabled',
    'settings.disabled': 'Disabled',
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string>) => string;
};

const I18nContext = createContext<Ctx>({ lang: 'es', setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('auralis.lang');
      return saved === 'en' ? 'en' : 'es';
    } catch {
      return 'es';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('auralis.lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t = (key: string, vars?: Record<string, string>) => {
    let s = DICT[lang][key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
    return s;
  };

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);