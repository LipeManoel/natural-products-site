import { useEffect, useRef, useState } from 'react';
import './accessibility-toolbar.css';
import { IoAccessibility } from "react-icons/io5";

const STORAGE_KEY = 'accessibility-settings';

const defaultSettings = {
  isOpen: false,
  magnifierMode: 'none', // none | full | section | lens
  fontMode: 'default', // default | opendyslexic | arial | verdana
  lineSpacing: 1.5,
  letterSpacing: 0,
  showMask: false,
  textScale: 1,
  contrastMode: 'default', // default | dark | light | yellow-black | blue-yellow
};

export default function AccessibilityToolbar() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const lensRef = useRef(null);

  const {
    isOpen,
    magnifierMode,
    fontMode,
    lineSpacing,
    letterSpacing,
    showMask,
    textScale,
    contrastMode,
  } = settings;

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleMagnifier = (mode) => {
    setSettings((prev) => ({
      ...prev,
      magnifierMode: prev.magnifierMode === mode ? 'none' : mode,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

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

    // Fonte
    html.classList.add(`font-${fontMode}`);

    // Contraste
    if (contrastMode !== 'default') {
      html.classList.add(`contrast-${contrastMode}`);
    }

    // Variáveis globais
    html.style.setProperty('--text-scale', String(textScale));
    html.style.setProperty('--line-spacing', String(lineSpacing));
    html.style.setProperty('--letter-spacing', `${letterSpacing}px`);

    // Máscara
    body.classList.toggle('reading-mask-active', showMask);

    // Lupa
    if (magnifierMode === 'full') {
      body.classList.add('magnifier-full');
    } else if (magnifierMode === 'section') {
      body.classList.add('magnifier-section');
    } else if (magnifierMode === 'lens') {
      body.classList.add('magnifier-lens-active');
    }

    return () => {
      body.classList.remove(
        'reading-mask-active',
        'magnifier-full',
        'magnifier-section',
        'magnifier-lens-active'
      );
    };
  }, [
    fontMode,
    lineSpacing,
    letterSpacing,
    showMask,
    textScale,
    contrastMode,
    magnifierMode,
  ]);

  useEffect(() => {
    if (magnifierMode !== 'lens') return;

    const lens = lensRef.current;
    if (!lens) return;

    const handleMouseMove = (e) => {
      const lensSize = 180;
      lens.style.left = `${e.clientX - lensSize / 2}px`;
      lens.style.top = `${e.clientY - lensSize / 2}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [magnifierMode]);

  return (
    <>
      <button
        className="accessibility-fab"
        onClick={() => updateSetting('isOpen', !isOpen)}
        aria-label={isOpen ? 'Fechar ferramentas de acessibilidade' : 'Abrir ferramentas de acessibilidade'}
        type="button"
      >
        <IoAccessibility />
      </button>

      {isOpen && (
        <aside className="accessibility-panel" aria-label="Ferramentas de acessibilidade">
          <div className="accessibility-panel__header">
            <h3>Acessibilidade</h3>
            <button
              className="close-btn"
              onClick={() => updateSetting('isOpen', false)}
              type="button"
              aria-label="Fechar painel"
            >
              ×
            </button>
          </div>

          <div className="tool-group">
            <span className="tool-title">Lupa virtual</span>
            <div className="button-row">
              <button
                onClick={() => toggleMagnifier('full')}
                className={magnifierMode === 'full' ? 'active' : ''}
                type="button"
              >
                Tela toda
              </button>
              <button
                onClick={() => toggleMagnifier('section')}
                className={magnifierMode === 'section' ? 'active' : ''}
                type="button"
              >
                Seção
              </button>
              <button
                onClick={() => toggleMagnifier('lens')}
                className={magnifierMode === 'lens' ? 'active' : ''}
                type="button"
              >
                Lente
              </button>
            </div>
          </div>

          <div className="tool-group">
            <span className="tool-title">Fonte</span>
            <div className="button-row">
              <button
                onClick={() => updateSetting('fontMode', 'default')}
                className={fontMode === 'default' ? 'active' : ''}
                type="button"
              >
                Padrão
              </button>
              <button
                onClick={() => updateSetting('fontMode', 'opendyslexic')}
                className={fontMode === 'opendyslexic' ? 'active' : ''}
                type="button"
              >
                OpenDyslexic
              </button>
              <button
                onClick={() => updateSetting('fontMode', 'arial')}
                className={fontMode === 'arial' ? 'active' : ''}
                type="button"
              >
                Arial
              </button>
              <button
                onClick={() => updateSetting('fontMode', 'verdana')}
                className={fontMode === 'verdana' ? 'active' : ''}
                type="button"
              >
                Verdana
              </button>
            </div>
          </div>

          <div className="tool-group">
            <span className="tool-title">Tamanho do texto</span>
            <label className="range-control">
              <span>Escala</span>
              <input
                type="range"
                min="1"
                max="2"
                step="0.1"
                value={textScale}
                onChange={(e) => updateSetting('textScale', Number(e.target.value))}
              />
              <strong>{Math.round(textScale * 100)}%</strong>
            </label>
          </div>

          <div className="tool-group">
            <span className="tool-title">Espaçamento</span>

            <label className="range-control">
              <span>Linha</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={lineSpacing}
                onChange={(e) => updateSetting('lineSpacing', Number(e.target.value))}
              />
              <strong>{lineSpacing.toFixed(1)}</strong>
            </label>

            <label className="range-control">
              <span>Letra</span>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={letterSpacing}
                onChange={(e) => updateSetting('letterSpacing', Number(e.target.value))}
              />
              <strong>{letterSpacing.toFixed(1)}px</strong>
            </label>
          </div>

          <div className="tool-group">
            <span className="tool-title">Contraste</span>
            <div className="button-row contrast-grid">
              <button
                onClick={() => updateSetting('contrastMode', 'default')}
                className={contrastMode === 'default' ? 'active' : ''}
                type="button"
              >
                Padrão
              </button>
              <button
                onClick={() => updateSetting('contrastMode', 'dark')}
                className={contrastMode === 'dark' ? 'active' : ''}
                type="button"
              >
                Escuro
              </button>
              <button
                onClick={() => updateSetting('contrastMode', 'light')}
                className={contrastMode === 'light' ? 'active' : ''}
                type="button"
              >
                Claro
              </button>
              <button
                onClick={() => updateSetting('contrastMode', 'yellow-black')}
                className={contrastMode === 'yellow-black' ? 'active' : ''}
                type="button"
              >
                Amarelo/Preto
              </button>
              <button
                onClick={() => updateSetting('contrastMode', 'blue-yellow')}
                className={contrastMode === 'blue-yellow' ? 'active' : ''}
                type="button"
              >
                Azul/Amarelo
              </button>
            </div>
          </div>

          <div className="tool-group">
            <span className="tool-title">Leitura</span>
            <div className="button-row">
              <button
                onClick={() => updateSetting('showMask', !showMask)}
                className={showMask ? 'active' : ''}
                type="button"
              >
                {showMask ? 'Desativar guia' : 'Ativar guia'}
              </button>
            </div>
          </div>

          <div className="tool-group">
            <div className="button-row">
              <button className="reset-btn" onClick={resetSettings} type="button">
                Restaurar padrão
              </button>
            </div>
          </div>
        </aside>
      )}

      {magnifierMode === 'lens' && (
        <div ref={lensRef} className="magnifier-lens" aria-hidden="true" />
      )}

      {magnifierMode === 'section' && (
        <div className="reading-focus-bar" aria-hidden="true" />
      )}
    </>
  );
}