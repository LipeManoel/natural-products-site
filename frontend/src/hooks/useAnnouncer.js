import { useCallback, useEffect, useRef } from 'react';

/**
 * Cria (uma única vez) uma região aria-live invisível no <body> e devolve
 * uma função `announce(msg)` que qualquer componente pode chamar para que
 * leitores de tela (NVDA, VoiceOver, TalkBack, JAWS...) leiam a mensagem em
 * voz alta. Isso é o que de fato "integra" o site a esses leitores: eles já
 * rodam no sistema operacional do usuário e escutam automaticamente
 * qualquer região marcada com aria-live.
 */
let sharedRegion = null;

function getRegion() {
  if (sharedRegion && document.body.contains(sharedRegion)) return sharedRegion;

  const el = document.createElement('div');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');
  el.setAttribute('role', 'status');
  el.className = 'sr-only-announcer';
  document.body.appendChild(el);
  sharedRegion = el;
  return el;
}

export function useAnnouncer() {
  const timeoutRef = useRef(null);

  useEffect(() => {
    getRegion();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const announce = useCallback((message, priority = 'polite') => {
    if (!message) return;
    const region = getRegion();
    region.setAttribute('aria-live', priority);

    // Limpa e reescreve para garantir que leitores repitam mesmo mensagens iguais
    region.textContent = '';
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      region.textContent = message;
    }, 50);
  }, []);

  return { announce };
}
