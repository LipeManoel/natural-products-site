import { useEffect, useRef, useState } from 'react';
import './accessibility-toolbar.css';
import { IoAccessibility } from 'react-icons/io5';
import { Ear, Eye, ZoomIn } from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import LiveTranscriptionPanel from './LiveTranscriptionPanel';
import AccessibleVideoLibrary from './AccessibleVideoLibrary';

const TABS = [
  { id: 'visual', label: 'Visão', icon: Eye },
  { id: 'lowvision', label: 'Baixa visão', icon: ZoomIn },
  { id: 'hearing', label: 'Audição', icon: Ear },
];

export default function AccessibilityToolbar() {
  const { settings, updateSetting, toggleMagnifier, resetSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('visual');
  const [showTranscription, setShowTranscription] = useState(false);
  const [showVideoLibrary, setShowVideoLibrary] = useState(false);

  const lensRef = useRef(null);

  const {
    magnifierMode,
    fontMode,
    lineSpacing,
    paragraphSpacing,
    letterSpacing,
    showMask,
    textScale,
    contrastMode,
    soundAlertsEnabled,
    screenReaderVerbose,
  } = settings;

  // Lente de aumento segue o cursor do mouse
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
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Fechar ferramentas de acessibilidade' : 'Abrir ferramentas de acessibilidade'}
        aria-expanded={isOpen}
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
              onClick={() => setIsOpen(false)}
              type="button"
              aria-label="Fechar painel"
            >
              ×
            </button>
          </div>

          <div className="accessibility-tabs" role="tablist" aria-label="Categorias de acessibilidade">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                className={`accessibility-tab ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* ===================== VISÃO (deficientes visuais) ===================== */}
          {activeTab === 'visual' && (
            <div role="tabpanel" aria-label="Recursos para deficientes visuais">
              <div className="tool-group">
                <span className="tool-title">Navegação por teclado</span>
                <ul className="shortcuts-list">
                  <li><kbd>Alt</kbd> + <kbd>H</kbd> — próximo título</li>
                  <li><kbd>Alt</kbd> + <kbd>T</kbd> — próxima tabela</li>
                  <li><kbd>Alt</kbd> + <kbd>M</kbd> — ir ao conteúdo principal</li>
                  <li><kbd>Tab</kbd> — próximo elemento interativo</li>
                </ul>
              </div>

              <div className="tool-group">
                <span className="tool-title">Leitor de tela (VoiceOver / NVDA)</span>
                <p className="tool-hint">
                  O site usa regiões <code>aria-live</code> e marcos semânticos (cabeçalho,
                  navegação, conteúdo principal, rodapé) lidos automaticamente pelo seu
                  leitor de tela.
                </p>
                <div className="button-row">
                  <button
                    type="button"
                    className={screenReaderVerbose ? 'active' : ''}
                    onClick={() => updateSetting('screenReaderVerbose', !screenReaderVerbose)}
                  >
                    {screenReaderVerbose ? 'Anúncios detalhados: ativados' : 'Anúncios detalhados: desativados'}
                  </button>
                </div>
              </div>

              <div className="tool-group">
                <span className="tool-title">Contraste dinâmico</span>
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
                <p className="tool-hint">Aumenta até 200% mantendo o layout organizado.</p>
              </div>
            </div>
          )}

          {/* ===================== BAIXA VISÃO ===================== */}
          {activeTab === 'lowvision' && (
            <div role="tabpanel" aria-label="Recursos para baixa visão">
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
                  <span>Parágrafo</span>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.1"
                    value={paragraphSpacing}
                    onChange={(e) => updateSetting('paragraphSpacing', Number(e.target.value))}
                  />
                  <strong>{paragraphSpacing.toFixed(1)}x</strong>
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
                <span className="tool-title">Guia de leitura</span>
                <div className="button-row">
                  <button
                    onClick={() => updateSetting('showMask', !showMask)}
                    className={showMask ? 'active' : ''}
                    type="button"
                  >
                    {showMask ? 'Desativar guia' : 'Ativar guia'}
                  </button>
                </div>
                <p className="tool-hint">Escurece a tela, deixando uma faixa central de leitura.</p>
              </div>
            </div>
          )}

          {/* ===================== AUDIÇÃO (surdos / def. auditivos) ===================== */}
          {activeTab === 'hearing' && (
            <div role="tabpanel" aria-label="Recursos para surdos e deficientes auditivos">
              <div className="tool-group">
                <span className="tool-title">Transcrição de áudio</span>
                <p className="tool-hint">Transcreve em tempo real o que o microfone captar.</p>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowTranscription(true)}
                >
                  Abrir transcrição ao vivo
                </button>
              </div>

              <div className="tool-group">
                <span className="tool-title">Vídeos com CC e LIBRAS</span>
                <p className="tool-hint">
                  Legendas ocultas, tradução em LIBRAS e equalizador de frequências.
                </p>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowVideoLibrary(true)}
                >
                  Abrir central de vídeos acessíveis
                </button>
              </div>

              <div className="tool-group">
                <span className="tool-title">Notificações visuais</span>
                <p className="tool-hint">
                  Substitui/complementa sons do sistema (sucesso, erro, avisos) por
                  flashes na tela e banners visuais.
                </p>
                <div className="button-row">
                  <button
                    type="button"
                    className={soundAlertsEnabled ? 'active' : ''}
                    onClick={() => updateSetting('soundAlertsEnabled', !soundAlertsEnabled)}
                  >
                    {soundAlertsEnabled ? 'Alertas visuais: ativados' : 'Alertas visuais: desativados'}
                  </button>
                </div>
              </div>
            </div>
          )}

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

      {showTranscription && (
        <LiveTranscriptionPanel onClose={() => setShowTranscription(false)} />
      )}

      {showVideoLibrary && (
        <AccessibleVideoLibrary onClose={() => setShowVideoLibrary(false)} />
      )}
    </>
  );
}
