import { Mic, MicOff, Trash2, X } from 'lucide-react';
import { useSpeechTranscription } from '@/hooks/useSpeechTranscription';

/**
 * Painel de "legenda ao vivo": transcreve o que o microfone captar
 * (ex.: um atendente falando em uma chamada, um vídeo tocando nas caixas
 * de som do ambiente) diretamente no navegador, sem enviar áudio a
 * nenhum servidor.
 */
export default function LiveTranscriptionPanel({ onClose }) {
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    start,
    stop,
    clear,
  } = useSpeechTranscription({ lang: 'pt-BR' });

  return (
    <aside className="transcription-panel" aria-label="Transcrição de áudio em tempo real" role="dialog">
      <div className="transcription-panel__header">
        <h3>Transcrição em tempo real</h3>
        <button type="button" className="close-btn" onClick={onClose} aria-label="Fechar transcrição">
          <X size={20} />
        </button>
      </div>

      {!isSupported ? (
        <p className="transcription-warning">
          Seu navegador não oferece suporte a reconhecimento de fala em tempo real.
          Use Google Chrome ou Microsoft Edge para este recurso.
        </p>
      ) : (
        <>
          <div className="transcription-controls">
            <button
              type="button"
              className={`btn transcription-toggle ${isListening ? 'active' : ''}`}
              onClick={isListening ? stop : start}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              {isListening ? 'Parar escuta' : 'Iniciar escuta'}
            </button>
            <button type="button" className="reset-btn" onClick={clear} aria-label="Limpar transcrição">
              <Trash2 size={16} />
            </button>
          </div>

          {error && <p className="transcription-warning">Erro no microfone: {error}</p>}

          <div className="transcription-live-region" role="log" aria-live="polite">
            {transcript || interimTranscript ? (
              <p>
                {transcript}
                <span className="transcription-interim">{interimTranscript}</span>
              </p>
            ) : (
              <p className="transcription-placeholder">
                {isListening
                  ? 'Ouvindo... comece a falar perto do microfone.'
                  : 'Clique em "Iniciar escuta" e permita o uso do microfone.'}
              </p>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
