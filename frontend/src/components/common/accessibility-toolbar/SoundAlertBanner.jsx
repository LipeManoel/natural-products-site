import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, Info } from 'lucide-react';
import { subscribeSoundEvents } from '@/utils/soundAlertBus';

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  alert: Bell,
  info: Info,
};

/**
 * Sempre que o app "tocaria um som" (sucesso, erro, alerta, notificação),
 * este componente traduz o evento em: (1) um flash colorido nas bordas da
 * tela e (2) um banner com ícone + texto — para que usuários surdos ou com
 * deficiência auditiva percebam eventos que ouvintes perceberiam pelo som.
 * Só fica ativo quando `enabled` é true (controlado no painel de
 * acessibilidade).
 */
export default function SoundAlertBanner({ enabled }) {
  const [queue, setQueue] = useState([]);
  const [flash, setFlash] = useState(null);
  const flashTimeout = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = subscribeSoundEvents((event) => {
      setQueue((prev) => [...prev, event]);

      setFlash(event.type);
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
      flashTimeout.current = setTimeout(() => setFlash(null), 700);

      setTimeout(() => {
        setQueue((prev) => prev.filter((e) => e.id !== event.id));
      }, 4000);

      if (navigator.vibrate) {
        navigator.vibrate(event.type === 'error' ? [80, 60, 80] : 60);
      }
    });

    return unsubscribe;
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {flash && <div className={`sound-flash sound-flash--${flash}`} aria-hidden="true" />}

      {queue.length > 0 && (
        <div className="sound-alert-stack" aria-hidden="true">
          {queue.map((event) => {
            const Icon = ICONS[event.type] || Info;
            return (
              <div key={event.id} className={`sound-alert-banner sound-alert-banner--${event.type}`}>
                <Icon size={20} />
                <span>{event.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
