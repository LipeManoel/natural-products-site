import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Equalizador simples de 3 bandas (graves / médios / agudos) construído
 * com a Web Audio API. Permite realçar frequências específicas para
 * usuários com perda auditiva parcial (ex.: perdas em altas frequências,
 * comuns em presbiacusia, costumam se beneficiar de reforço nos agudos).
 *
 * Uso: chamar `attach(videoOrAudioElement)` uma vez que o elemento exista
 * no DOM. A partir daí, `setGain(band, dB)` e os presets ajustam o som em
 * tempo real.
 */
const PRESETS = {
  none: { bass: 0, mid: 0, treble: 0 },
  mild: { bass: 0, mid: 2, treble: 4 },
  moderate: { bass: -2, mid: 4, treble: 8 },
  severe: { bass: -4, mid: 6, treble: 12 },
};

export function useAudioEqualizer() {
  const [gains, setGains] = useState({ bass: 0, mid: 0, treble: 0 });
  const [preset, setPreset] = useState('none');
  const [isAttached, setIsAttached] = useState(false);

  const ctxRef = useRef(null);
  const sourceRef = useRef(null);
  const bassRef = useRef(null);
  const midRef = useRef(null);
  const trebleRef = useRef(null);
  const elementRef = useRef(null);

  const attach = useCallback((mediaElement) => {
    if (!mediaElement || elementRef.current === mediaElement) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
      const ctx = ctxRef.current || new AudioContext();
      ctxRef.current = ctx;

      const source = ctx.createMediaElementSource(mediaElement);

      const bass = ctx.createBiquadFilter();
      bass.type = 'lowshelf';
      bass.frequency.value = 200;

      const mid = ctx.createBiquadFilter();
      mid.type = 'peaking';
      mid.frequency.value = 1000;
      mid.Q.value = 0.9;

      const treble = ctx.createBiquadFilter();
      treble.type = 'highshelf';
      treble.frequency.value = 3000;

      source.connect(bass).connect(mid).connect(treble).connect(ctx.destination);

      sourceRef.current = source;
      bassRef.current = bass;
      midRef.current = mid;
      trebleRef.current = treble;
      elementRef.current = mediaElement;

      setIsAttached(true);
    } catch {
      // createMediaElementSource lança se o elemento já estiver conectado
      // a outro contexto/grafo; nesse caso apenas ignoramos silenciosamente.
    }
  }, []);

  useEffect(() => {
    if (!bassRef.current) return;
    bassRef.current.gain.value = gains.bass;
    midRef.current.gain.value = gains.mid;
    trebleRef.current.gain.value = gains.treble;
  }, [gains]);

  const setGain = useCallback((band, value) => {
    setPreset('custom');
    setGains((prev) => ({ ...prev, [band]: value }));
  }, []);

  const applyPreset = useCallback((name) => {
    if (!PRESETS[name]) return;
    setPreset(name);
    setGains(PRESETS[name]);
  }, []);

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    gains,
    preset,
    isAttached,
    attach,
    setGain,
    applyPreset,
    presets: Object.keys(PRESETS),
  };
}
