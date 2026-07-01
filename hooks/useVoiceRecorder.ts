import { useCallback, useRef, useState } from "react";

function getSupportedMimeType() {
  const types = ["audio/webm", "audio/webm;codecs=opus", "audio/mp4"];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopLevelMonitor = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startLevelMonitor = useCallback((stream: MediaStream) => {
    stopLevelMonitor();

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    audioContextRef.current = audioContext;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((sum, v) => sum + v, 0) / data.length;
      setAudioLevel(avg / 255);
      rafRef.current = requestAnimationFrame(tick);
    };

    void audioContext.resume();
    rafRef.current = requestAnimationFrame(tick);
  }, [stopLevelMonitor]);

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    streamRef.current = stream;
    startLevelMonitor(stream);

    const mimeType = getSupportedMimeType();
    mediaRecorder.current = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined
    );
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.start(250);
    setIsRecording(true);
  }, [startLevelMonitor]);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorder.current;
      if (!recorder || recorder.state === "inactive") {
        reject(new Error("Not recording"));
        return;
      }

      recorder.onstop = () => {
        stopLevelMonitor();
        const mimeType = recorder.mimeType || "audio/webm";
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        void audioContextRef.current?.close();
        audioContextRef.current = null;
        resolve(new Blob(chunks.current, { type: mimeType }));
      };

      recorder.stop();
      setIsRecording(false);
    });
  }, [stopLevelMonitor]);

  return { isRecording, audioLevel, startRecording, stopRecording };
};
