import { useRef, useState } from 'react';
import { Captions, Sparkles, Volume2, X } from 'lucide-react';
import { useAudioEqualizer } from '@/hooks/useAudioEqualizer';

const PRESET_LABELS = {
  none: 'Nenhum',
  mild: 'Perda leve',
  moderate: 'Perda moderada',
  severe: 'Perda severa',
  custom: 'Personalizado',
};

/**
 * Central de vídeos acessíveis:
 *  - Legendas ocultas (CC) via <track kind="captions">, ligadas/desligadas.
 *  - Alternância de tradução em LIBRAS: exibe uma janela de intérprete no
 *    canto do vídeo. IMPORTANTE (limitação honesta): este projeto não gera
 *    tradução em LIBRAS automaticamente por IA — isso exigiria um serviço
 *    externo de avatar/intérprete 3D. O que este componente entrega é a
 *    estrutura pronta (janela sincronizada, posição, toggle) para receber
 *    um vídeo real de um intérprete humano ou de um serviço de tradução,
 *    bastando apontar `librasVideoSrc` para o arquivo correspondente.
 *  - Equalizador de frequências para usuários com perda auditiva parcial.
 */
export default function AccessibleVideoLibrary({ onClose }) {
  const videoRef = useRef(null);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [librasOn, setLibrasOn] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);

  const { gains, preset, attach, setGain, applyPreset, presets } = useAudioEqualizer();

  const toggleCaptions = () => {
    const video = videoRef.current;
    if (video && video.textTracks[0]) {
      video.textTracks[0].mode = captionsOn ? 'hidden' : 'showing';
    }
    setCaptionsOn((prev) => !prev);
  };

  const handlePlay = () => {
    if (videoRef.current) attach(videoRef.current);
  };

  return (
    <aside className="video-library-panel" aria-label="Central de vídeos acessíveis" role="dialog">
      <div className="transcription-panel__header">
        <h3>Central de vídeos acessíveis</h3>
        <button type="button" className="close-btn" onClick={onClose} aria-label="Fechar central de vídeos">
          <X size={20} />
        </button>
      </div>

      <div className="video-library-player">
        <video
          ref={videoRef}
          controls
          crossOrigin="anonymous"
          onPlay={handlePlay}
          poster="/images/logo.png"
        >
          <source
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            type="video/mp4"
          />
          <track
            kind="captions"
            src="/captions/demo-pt.vtt"
            srcLang="pt"
            label="Português"
            default
          />
          Seu navegador não suporta reprodução de vídeo.
        </video>

        {librasOn && (
          <div className="libras-window" aria-hidden="true">
            <span>Janela do intérprete de LIBRAS</span>
            <small>Substitua por um vídeo real do intérprete (librasVideoSrc)</small>
          </div>
        )}
      </div>

      <div className="video-library-controls">
        <button
          type="button"
          className={`btn ${captionsOn ? 'active' : ''}`}
          onClick={toggleCaptions}
        >
          <Captions size={18} /> Legendas (CC)
        </button>

        <button
          type="button"
          className={`btn ${librasOn ? 'active' : ''}`}
          onClick={() => setLibrasOn((prev) => !prev)}
        >
          <Sparkles size={18} /> Tradução LIBRAS
        </button>

        <button
          type="button"
          className={`btn ${showEqualizer ? 'active' : ''}`}
          onClick={() => setShowEqualizer((prev) => !prev)}
        >
          <Volume2 size={18} /> Frequências
        </button>
      </div>

      {showEqualizer && (
        <div className="tool-group">
          <span className="tool-title">Perfil de audição</span>
          <div className="button-row">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                className={preset === p ? 'active' : ''}
                onClick={() => applyPreset(p)}
              >
                {PRESET_LABELS[p]}
              </button>
            ))}
          </div>

          <label className="range-control">
            <span>Graves</span>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={gains.bass}
              onChange={(e) => setGain('bass', Number(e.target.value))}
            />
            <strong>{gains.bass} dB</strong>
          </label>

          <label className="range-control">
            <span>Médios</span>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={gains.mid}
              onChange={(e) => setGain('mid', Number(e.target.value))}
            />
            <strong>{gains.mid} dB</strong>
          </label>

          <label className="range-control">
            <span>Agudos</span>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={gains.treble}
              onChange={(e) => setGain('treble', Number(e.target.value))}
            />
            <strong>{gains.treble} dB</strong>
          </label>

          <p className="transcription-warning">
            Dê play no vídeo para ativar o equalizador (é preciso uma interação do usuário).
          </p>
        </div>
      )}
    </aside>
  );
}
