import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'accessibility-settings';

export const defaultSettings = {
  // Baixa visão / geral
  magnifierMode: 'none', // none | full | section | lens
  fontMode: 'default', // default | opendyslexic | arial | verdana
  lineSpacing: 1.5,
  paragraphSpacing: 1, // multiplicador
  letterSpacing: 0,
  showMask: false,
  textScale: 1, // até 2 = 200%
  contrastMode: 'default', // default | dark | light | yellow-black | blue-yellow

  // Auditiva
  soundAlertsEnabled: false,
  screenReaderVerbose: true,
};

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleMagnifier = useCallback((mode) => {
    setSettings((prev) => ({
      ...prev,
      magnifierMode: prev.magnifierMode === mode ? 'none' : mode,
    }));
  }, []);

  const resetSettings = useCallback(() => setSettings(defaultSettings), []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Aplica classes/variáveis globais no <html>/<body> sempre, independente
  // de o painel de acessibilidade estar aberto ou fechado.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.remove(
      'font-default',
      'font-opendyslexic',
      'font-arial',
      'font-verdana',
      'contrast-dark',
      'contrast-light',
      'contrast-yellow-black',
      'contrast-blue-yellow'
    );

    body.classList.remove(
      'reading-mask-active',
      'magnifier-full',
      'magnifier-section',
      'magnifier-lens-active'
    );

    html.classList.add(`font-${settings.fontMode}`);

    if (settings.contrastMode !== 'default') {
      html.classList.add(`contrast-${settings.contrastMode}`);
    }

    html.style.setProperty('--text-scale', String(settings.textScale));
    html.style.setProperty('--line-spacing', String(settings.lineSpacing));
    html.style.setProperty('--paragraph-spacing', String(settings.paragraphSpacing));
    html.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);

    body.classList.toggle('reading-mask-active', settings.showMask);

    if (settings.magnifierMode === 'full') body.classList.add('magnifier-full');
    if (settings.magnifierMode === 'section') body.classList.add('magnifier-section');
    if (settings.magnifierMode === 'lens') body.classList.add('magnifier-lens-active');

    return () => {
      body.classList.remove(
        'reading-mask-active',
        'magnifier-full',
        'magnifier-section',
        'magnifier-lens-active'
      );
    };
  }, [
    settings.fontMode,
    settings.contrastMode,
    settings.textScale,
    settings.lineSpacing,
    settings.paragraphSpacing,
    settings.letterSpacing,
    settings.showMask,
    settings.magnifierMode,
  ]);

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSetting, toggleMagnifier, resetSettings }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility precisa ser usado dentro de <AccessibilityProvider>');
  }
  return ctx;
}
