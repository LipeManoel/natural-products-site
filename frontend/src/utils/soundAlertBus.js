// Pequeno "pub/sub" para permitir que qualquer parte do app dispare um
// alerta visual (flash de tela + banner) sempre que aconteceria um som
// (sucesso, erro, notificação). Usado pelo recurso de "Alertas visuais
// para eventos sonoros" (acessibilidade para surdos/deficientes auditivos).

const listeners = new Set();

export const SOUND_EVENT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  ALERT: 'alert',
};

export function emitSoundEvent(type, message) {
  listeners.forEach((listener) => {
    try {
      listener({ type, message, id: Date.now() + Math.random() });
    } catch {
      // ignora erros de listeners individuais
    }
  });
}

export function subscribeSoundEvents(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
