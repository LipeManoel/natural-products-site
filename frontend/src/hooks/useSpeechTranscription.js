import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Transcrição de áudio em tempo real usando a Web Speech API
 * (SpeechRecognition / webkitSpeechRecognition), disponível nativamente
 * no navegador — sem custo de servidor.
 *
 * Limitação importante e honesta: essa API tem suporte apenas em
 * navegadores baseados em Chromium (Chrome, Edge, Opera...). Firefox e
 * Safari ainda não suportam de forma confiável. Por isso o hook expõe
 * `isSupported` para que a interface avise o usuário quando o recurso
 * não estiver disponível, em vez de falhar silenciosamente.
 */
export function useSpeechTranscription({ lang = 'pt-BR' } = {}) {
  const [isSupported] = useState(
    () =>
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalChunk += result[0].transcript + ' ';
        } else {
          interimChunk += result[0].transcript;
        }
      }

      if (finalChunk) {
        setTranscript((prev) => `${prev}${finalChunk}`);
      }
      setInterimTranscript(interimChunk);
    };

    recognition.onerror = (event) => {
      setError(event.error || 'Erro desconhecido no reconhecimento de fala');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening((wasListening) => {
        // Reinicia automaticamente se o usuário não pediu para parar
        if (wasListening) {
          try {
            recognition.start();
            return true;
          } catch {
            return false;
          }
        }
        return false;
      });
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        // já parado
      }
    };
  }, [isSupported, lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // start() pode lançar se já estiver rodando
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    setIsListening(false);
    try {
      recognitionRef.current.stop();
    } catch {
      // já parado
    }
  }, []);

  const clear = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    start,
    stop,
    clear,
  };
}
