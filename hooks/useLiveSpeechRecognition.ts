import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string };
    };
  };
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: { error: string; message?: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
};

function getSpeechRecognition(): SpeechRecognitionInstance | null {
  if (typeof window === "undefined") return null;

  const win = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };

  const Ctor = win.SpeechRecognition ?? win.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed":
    "Microphone blocked for speech recognition — check browser permissions.",
  "service-not-allowed": "Speech recognition not allowed in this context.",
  network:
    "Speech recognition needs internet (Chrome sends audio to Google servers).",
  "audio-capture": "No microphone found for speech recognition.",
  aborted: "",
  "no-speech": "",
};

export function useLiveSpeechRecognition() {
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [hearingSpeech, setHearingSpeech] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalBufferRef = useRef("");
  const interimRef = useRef("");
  const shouldRestartRef = useRef(false);
  const stoppingRef = useRef(false);

  useEffect(() => {
    setSupported(getSpeechRecognition() !== null);
  }, []);

  const startListening = useCallback(() => {
    stoppingRef.current = false;
    setSpeechError(null);

    const recognition = getSpeechRecognition();
    if (!recognition) {
      setSupported(false);
      return;
    }

    setSupported(true);
    finalBufferRef.current = "";
    interimRef.current = "";
    setFinalText("");
    setInterimText("");
    setHearingSpeech(false);
    shouldRestartRef.current = true;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      setSpeechError(null);
    };

    recognition.onspeechstart = () => {
      setHearingSpeech(true);
    };

    recognition.onspeechend = () => {
      setHearingSpeech(false);
    };

    recognition.onresult = (event) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalBufferRef.current += transcript;
        }
      }

      for (let i = 0; i < event.results.length; i++) {
        if (!event.results[i].isFinal) {
          interim += event.results[i][0].transcript;
        }
      }

      setFinalText(finalBufferRef.current.trim());
      setInterimText(interim.trim());
      interimRef.current = interim.trim();
    };

    recognition.onerror = (event) => {
      const message = ERROR_MESSAGES[event.error];
      if (message) {
        setSpeechError(message);
      }

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture"
      ) {
        shouldRestartRef.current = false;
        setSupported(false);
      }
    };

    recognition.onend = () => {
      if (stoppingRef.current) {
        setListening(false);
        setHearingSpeech(false);
        return;
      }

      if (shouldRestartRef.current && recognitionRef.current) {
        window.setTimeout(() => {
          if (!shouldRestartRef.current || !recognitionRef.current) return;
          try {
            recognitionRef.current.start();
          } catch {
            setListening(false);
          }
        }, 150);
        return;
      }

      setListening(false);
      setHearingSpeech(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setSpeechError("Could not start speech recognition — try Chrome or Edge.");
      setListening(false);
    }
  }, []);

  const stopListening = useCallback((): string => {
    shouldRestartRef.current = false;
    stoppingRef.current = true;

    const captured = [finalBufferRef.current, interimRef.current]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" ");

    const recognition = recognitionRef.current;
    recognitionRef.current = null;

    if (recognition) {
      try {
        recognition.stop();
      } catch {
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
      }
    }

    setListening(false);
    setHearingSpeech(false);
    setInterimText("");
    interimRef.current = "";

    window.setTimeout(() => {
      stoppingRef.current = false;
    }, 200);

    return captured;
  }, []);

  const reset = useCallback(() => {
    finalBufferRef.current = "";
    interimRef.current = "";
    setFinalText("");
    setInterimText("");
    setHearingSpeech(false);
    setSpeechError(null);
  }, []);

  const displayText = [finalText, interimText].filter(Boolean).join(" ");

  return {
    supported,
    listening,
    hearingSpeech,
    speechError,
    finalText,
    interimText,
    displayText,
    startListening,
    stopListening,
    reset,
  };
};
