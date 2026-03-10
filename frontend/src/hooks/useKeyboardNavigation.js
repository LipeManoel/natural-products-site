import { useEffect } from 'react';

export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignora se o foco está em campos de entrada
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) {
        return;
      }

      // Atalho: Alt + H / Alt + T (evita conflito com leitores de tela)
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const key = e.key.toUpperCase();

        if (key === 'H') {
          e.preventDefault();
          navigateToNext('h1, h2, h3, h4, h5, h6');
        }

        if (key === 'T') {
          e.preventDefault();
          navigateToNext('table');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToNext = (selector) => {
    const elements = [...document.querySelectorAll(selector)];
    if (elements.length === 0) return;

    let index = elements.findIndex(el => el === document.activeElement);
    if (index === -1) index = -1;

    const nextIndex = (index + 1) % elements.length;
    const target = elements[nextIndex];

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.tabIndex = -1; // permite foco temporário
      target.focus();
    }
  };
}