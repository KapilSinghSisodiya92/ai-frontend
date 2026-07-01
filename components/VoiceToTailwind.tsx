"use client";

import { useCompletion } from "@ai-sdk/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useLiveSpeechRecognition } from "@/hooks/useLiveSpeechRecognition";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { buildPreviewHtml, stripCodeFences } from "@/lib/landing-sections";

type Phase = "idle" | "recording" | "transcribing" | "generating";

const EXAMPLE_PROMPT =
  "A dark card with a user avatar on the left, their name and role on the right, and a green active badge in the top corner.";

const STEPS = [
  { key: "record", label: "Hold Space", desc: "Start recording" },
  { key: "speak", label: "Speak", desc: "Describe your UI" },
  { key: "release", label: "Release Space", desc: "Stop & process" },
  { key: "result", label: "Preview", desc: "JSX renders live" },
] as const;

function Waveform({ level }: { level: number }) {
  const bars = 9;
  return (
    <div className="flex items-end justify-center gap-1.5 h-12" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const center = Math.abs(i - (bars - 1) / 2);
        const base = 0.2 + level * (1 - center / (bars / 2));
        const height = Math.max(8, Math.min(44, base * 48));
        return (
          <div
            key={i}
            className="w-1.5 rounded-full bg-red-400 transition-all duration-75"
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
}

function SpaceKey({ pressed }: { pressed: boolean }) {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center min-w-[140px] h-[72px] rounded-xl border-2 font-mono text-lg font-bold tracking-[0.2em] uppercase transition-all duration-100 select-none ${
        pressed
          ? "translate-y-1 border-red-500 bg-red-950/80 text-red-300 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)] scale-[0.98]"
          : "border-gray-600 bg-gray-800 text-gray-200 shadow-[0_6px_0_#374151,0_8px_24px_rgba(0,0,0,0.35)]"
      }`}
      aria-hidden
    >
      Space
      {pressed && (
        <span className="text-[9px] tracking-widest font-sans font-medium text-red-400 mt-1 normal-case">
          held
        </span>
      )}
    </div>
  );
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

function LiveCaption({
  finalText,
  interimText,
  listening,
  supported,
  speechError,
  hearingSpeech,
  audioLevel,
}: {
  finalText: string;
  interimText: string;
  listening: boolean;
  supported: boolean | null;
  speechError: string | null;
  hearingSpeech: boolean;
  audioLevel: number;
}) {
  const hasText = Boolean(finalText || interimText);
  const micActive = audioLevel > 0.04;

  return (
    <div
      className="w-full max-w-lg mx-auto rounded-xl border border-red-500/30 bg-gray-950/80 px-4 py-3 text-left min-h-[88px]"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                micActive ? "animate-ping bg-emerald-400" : "bg-gray-600"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                micActive ? "bg-emerald-500" : listening ? "bg-amber-500" : "bg-gray-600"
              }`}
            />
          </span>
          <span
            className={`text-[10px] uppercase tracking-widest font-medium ${
              micActive
                ? "text-emerald-400"
                : hearingSpeech
                  ? "text-blue-400"
                  : listening
                    ? "text-amber-400"
                    : "text-gray-500"
            }`}
          >
            {micActive
              ? "Mic picking up audio"
              : hearingSpeech
                ? "Processing speech…"
                : listening
                  ? "Listening — speak now"
                  : "Mic idle"}
          </span>
        </div>
        {listening && (
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-16 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-75"
                style={{ width: `${Math.min(100, audioLevel * 220)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {speechError ? (
        <p className="text-sm text-amber-400">{speechError}</p>
      ) : supported === false ? (
        <p className="text-sm text-gray-500">
          Live captions need Chrome or Edge. Audio level above shows if your mic
          is working — Whisper will still transcribe on release.
        </p>
      ) : hasText ? (
        <p className="text-sm sm:text-base leading-relaxed">
          {finalText && <span className="text-white">{finalText}</span>}
          {finalText && interimText && " "}
          {interimText && (
            <span className="text-gray-400 italic">{interimText}</span>
          )}
        </p>
      ) : micActive && !hasText ? (
        <p className="text-sm text-emerald-400/90 italic">
          Mic is hearing you — waiting for speech recognition…
        </p>
      ) : listening ? (
        <p className="text-sm text-gray-500 italic">
          Start speaking — your words will appear here as you talk…
        </p>
      ) : (
        <p className="text-sm text-gray-500 italic">Waiting for speech…</p>
      )}
    </div>
  );
}

export function VoiceToTailwind() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcription, setTranscription] = useState("");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoneFocused, setZoneFocused] = useState(false);
  const holdActive = useRef(false);
  const pointerHold = useRef(false);
  const codeRef = useRef<HTMLElement>(null);
  const zoneRef = useRef<HTMLButtonElement>(null);

  const { isRecording, audioLevel, startRecording, stopRecording } = useVoiceRecorder();
  const isRecordingRef = useRef(false);

  const {
    supported: liveSupported,
    listening: liveListening,
    hearingSpeech,
    speechError,
    finalText: liveFinalText,
    interimText: liveInterimText,
    startListening,
    stopListening,
    reset: resetLiveSpeech,
  } = useLiveSpeechRecognition();

  const [livePreview, setLivePreview] = useState("");

  const { complete, completion, isLoading, setCompletion } = useCompletion({
    api: "/api/voice-generate",
  });

  const busy = phase === "transcribing" || phase === "generating" || isLoading;

  const runPipeline = useCallback(
    async (audioBlob: Blob, fallbackText = "") => {
      setError(null);
      setPhase("transcribing");
      setTranscription("");
      setCompletion("");
      setPreviewHtml(null);

      try {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const transcribeRes = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });
        const transcribeData = await transcribeRes.json();

        let text = "";
        if (transcribeRes.ok) {
          text = (transcribeData.text as string)?.trim() ?? "";
        }
        if (!text) {
          text = fallbackText.trim();
        }
        if (!text) {
          throw new Error(
            transcribeData.error ??
              "No speech detected — speak louder or move closer to the mic."
          );
        }

        setTranscription(text);
        setPhase("generating");
        complete(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setPhase("idle");
      }
    },
    [complete, setCompletion]
  );

  const beginHold = useCallback(async () => {
    if (holdActive.current || busy) return;
    holdActive.current = true;

    try {
      setError(null);
      setTranscription("");
      setLivePreview("");
      setCompletion("");
      setPreviewHtml(null);
      resetLiveSpeech();
      setPhase("recording");
      // Speech API must start synchronously on the user gesture (before any await)
      startListening();
      // Brief pause so Chrome speech recognition can claim the mic before MediaRecorder
      await new Promise((resolve) => setTimeout(resolve, 200));
      await startRecording();
      isRecordingRef.current = true;
    } catch {
      holdActive.current = false;
      isRecordingRef.current = false;
      stopListening();
      setPhase("idle");
      setError("Microphone access denied — allow mic in your browser settings.");
    }
  }, [busy, startRecording, setCompletion, resetLiveSpeech, startListening, stopListening]);

  const endHold = useCallback(async () => {
    if (!holdActive.current) return;
    holdActive.current = false;

    if (!isRecordingRef.current) {
      const captured = stopListening();
      if (captured) {
        setLivePreview(captured);
        setTranscription(captured);
        setPhase("generating");
        complete(captured);
      } else {
        setPhase("idle");
      }
      return;
    }

    try {
      const capturedLive = stopListening();
      if (capturedLive) setLivePreview(capturedLive);

      const audioBlob = await stopRecording();
      isRecordingRef.current = false;
      await runPipeline(audioBlob, capturedLive);
    } catch {
      isRecordingRef.current = false;
      stopListening();
      setPhase("idle");
      setError("Recording failed — try holding Space a little longer.");
    }
  }, [stopRecording, runPipeline, stopListening, complete]);

  const handleSpaceDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat || isEditableTarget(e.target)) return;
      e.preventDefault();
      void beginHold();
    },
    [beginHold]
  );

  const handleSpaceUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code !== "Space" || isEditableTarget(e.target)) return;
      e.preventDefault();
      void endHold();
    },
    [endHold]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleSpaceDown);
    window.addEventListener("keyup", handleSpaceUp);
    return () => {
      window.removeEventListener("keydown", handleSpaceDown);
      window.removeEventListener("keyup", handleSpaceUp);
    };
  }, [handleSpaceDown, handleSpaceUp]);

  useEffect(() => {
    if (!isLoading && phase === "generating" && completion) {
      setPhase("idle");
    }
  }, [isLoading, phase, completion]);

  useEffect(() => {
    if (!codeRef.current) return;

    if (!completion) {
      codeRef.current.textContent =
        phase === "generating"
          ? "Streaming JSX…"
          : "Generated JSX will appear here";
      return;
    }

    const jsx = stripCodeFences(completion);
    codeRef.current.textContent = jsx;

    if (!isLoading && jsx) {
      setPreviewHtml(buildPreviewHtml(jsx));
    }
  }, [completion, isLoading, phase]);

  const activePhase =
    phase === "recording"
      ? "recording"
      : phase === "transcribing"
        ? "transcribing"
        : phase === "generating" || isLoading
          ? "generating"
          : "idle";

  const currentStepIndex =
    activePhase === "recording"
      ? 1
      : activePhase === "transcribing"
        ? 2
        : activePhase === "generating"
          ? 3
          : completion
            ? 3
            : 0;

  return (
    <div className="space-y-5">
      {/* How it works — always visible */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 sm:p-5">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 text-center sm:text-left">
          How it works
        </p>
        <ol className="grid gap-3 sm:grid-cols-4">
          {STEPS.map((step, i) => {
            const done = i < currentStepIndex;
            const active = i === currentStepIndex;
            return (
              <li
                key={step.key}
                className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 transition ${
                  active
                    ? "bg-blue-500/10 border border-blue-500/30"
                    : done
                      ? "bg-emerald-500/5 border border-emerald-500/20"
                      : "border border-transparent"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    active
                      ? "bg-blue-600 text-white"
                      : done
                        ? "bg-emerald-600/30 text-emerald-400"
                        : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <div className="text-left min-w-0">
                  <p
                    className={`text-xs font-semibold ${
                      active ? "text-blue-300" : done ? "text-emerald-400" : "text-gray-300"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-gray-600 leading-snug">{step.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Main record zone */}
      <button
        ref={zoneRef}
        type="button"
        disabled={busy}
        onFocus={() => setZoneFocused(true)}
        onBlur={() => setZoneFocused(false)}
        onPointerDown={(e) => {
          if (busy || e.button !== 0) return;
          e.preventDefault();
          zoneRef.current?.focus();
          pointerHold.current = true;
          void beginHold();
        }}
        onPointerUp={() => {
          if (!pointerHold.current) return;
          pointerHold.current = false;
          void endHold();
        }}
        onPointerLeave={() => {
          if (!pointerHold.current || !isRecording) return;
          pointerHold.current = false;
          void endHold();
        }}
        onPointerCancel={() => {
          if (!pointerHold.current) return;
          pointerHold.current = false;
          void endHold();
        }}
        className={`w-full rounded-2xl border-2 p-8 sm:p-12 text-center transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:opacity-60 disabled:cursor-not-allowed ${
          activePhase === "recording"
            ? "border-red-500 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.15)]"
            : zoneFocused
              ? "border-blue-500/40 bg-gray-900/60"
              : "border-dashed border-gray-700 bg-gray-900/40 hover:border-gray-600 hover:bg-gray-900/50"
        }`}
        aria-label={
          activePhase === "recording"
            ? "Recording — release Space or mouse to stop"
            : "Press and hold Space, or click and hold here, to record"
        }
      >
        {activePhase === "recording" ? (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-sm font-semibold text-red-300">
                Recording — release to stop
              </span>
            </div>

            <SpaceKey pressed />

            <Waveform level={audioLevel} />

            <LiveCaption
              finalText={liveFinalText}
              interimText={liveInterimText}
              listening={liveListening}
              supported={liveSupported}
              speechError={speechError}
              hearingSpeech={hearingSpeech}
              audioLevel={audioLevel}
            />

            <p className="text-sm text-red-300/90 font-medium">
              ↑ Release{" "}
              <kbd className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-xs font-mono">
                Space
              </kbd>{" "}
              when you&apos;re done speaking
            </p>
          </div>
        ) : activePhase === "transcribing" ? (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto" />
            <p className="text-base font-medium text-white">Transcribing your voice…</p>
            <p className="text-sm text-gray-500">Whisper is refining what you said</p>
            {(livePreview || transcription) && (
              <div className="max-w-lg mx-auto rounded-xl border border-blue-500/20 bg-gray-950/60 px-4 py-3 text-left">
                <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">
                  {transcription ? "Final transcript" : "Heard so far"}
                </p>
                <p className="text-sm text-gray-300 italic">
                  &ldquo;{transcription || livePreview}&rdquo;
                </p>
              </div>
            )}
          </div>
        ) : activePhase === "generating" ? (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-violet-400 animate-spin mx-auto" />
            <p className="text-base font-medium text-white">Generating your component…</p>
            {transcription && (
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                &ldquo;{transcription}&rdquo;
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 border border-gray-700">
              <Mic className="w-7 h-7 text-gray-400" />
            </div>

            <div className="space-y-4">
              <p className="text-base sm:text-lg font-semibold text-white">
                Press &amp; hold{" "}
                <kbd className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-800 border-2 border-gray-600 text-sm font-mono shadow-[0_4px_0_#374151] mx-1">
                  Space
                </kbd>{" "}
                to start
              </p>
              <p className="text-sm text-gray-400">
                Release{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-xs font-mono">
                  Space
                </kbd>{" "}
                to stop — then we transcribe and generate JSX
              </p>
            </div>

            <SpaceKey pressed={false} />

            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <MicOff className="w-3.5 h-3.5" />
              <span>Or click &amp; hold this area (same as Space)</span>
            </div>
          </div>
        )}
      </button>

      {/* Example prompt */}
      <div className="rounded-lg border border-gray-800 bg-gray-950/50 px-4 py-3 text-center">
        <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">
          Example to say while holding Space
        </p>
        <p className="text-xs sm:text-sm text-gray-400 italic leading-relaxed">
          &ldquo;{EXAMPLE_PROMPT}&rdquo;
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 text-center"
        >
          {error}
        </div>
      )}

      {(transcription || completion) && (
        <div className="grid gap-4 lg:grid-cols-2 min-h-[420px]">
          <div className="flex flex-col rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-800 bg-gray-900">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                JSX output
              </span>
            </div>
            <pre className="flex-1 overflow-auto p-4 m-0 text-xs leading-relaxed bg-gray-950 text-gray-300">
              <code ref={codeRef} />
            </pre>
          </div>

          <div className="flex flex-col rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-800 bg-gray-900">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                Live preview
              </span>
            </div>
            <div className="flex-1 bg-white min-h-[380px]">
              {previewHtml ? (
                <iframe
                  title="Component preview"
                  srcDoc={previewHtml}
                  className="w-full h-full min-h-[380px] border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[380px] text-sm text-gray-400 bg-gray-900">
                  {activePhase === "generating"
                    ? "Preview updates when generation completes"
                    : "Preview appears after generation"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
