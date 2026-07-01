import { useEffect } from 'react';
import { useAnnouncer } from './useAnnouncer';

/**
 * Navegação completa via teclado para usuários cegos/baixa visão que usam
 * leitor de tela ou apenas o teclado:
 *   Alt + H  -> pula para o próximo heading (h1..h6)
 *   Alt + T  -> pula para a próxima tabela
 *   Alt + M  -> pula direto para o conteúdo principal (equivalente ao "skip link")
 *
 * A cada salto, o elemento recebe foco e sua posição/texto é anunciado via
 * região aria-live, para que leitores de tela confirmem a navegação.
 */
export function useKeyboardNavigation() {
  const { announce } = useAnnouncer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) {
        return;
      }

      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const key = e.key.toUpperCase();

        if (key === 'H') {
          e.preventDefault();
          navigateToNext('h1, h2, h3, h4, h5, h6', 'título');
        }

        if (key === 'T') {
          e.preventDefault();
          navigateToNext('table', 'tabela');
        }

        if (key === 'M') {
          e.preventDefault();
          const main = document.getElementById('conteudo-principal') || document.querySelector('main');
          if (main) {
            main.tabIndex = -1;
            main.focus();
            main.scrollIntoView({ behavior: 'smooth', block: 'start' });
            announce('Conteúdo principal');
          }
        }
      }
    };

    const navigateToNext = (selector, label) => {
      const elements = [...document.querySelectorAll(selector)];
      if (elements.length === 0) {
        announce(`Nenhum(a) ${label} encontrado(a) na página`);
        return;
      }

      let index = elements.findIndex((el) => el === document.activeElement);
      if (index === -1) index = -1;

      const nextIndex = (index + 1) % elements.length;
      const target = elements[nextIndex];

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.tabIndex = -1;
        target.focus();
        const text = target.textContent?.trim().slice(0, 80) || label;
        announce(`${label}: ${text} (${nextIndex + 1} de ${elements.length})`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [announce]);
}
