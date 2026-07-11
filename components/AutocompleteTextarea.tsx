"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

const textareaClass =
  "w-full h-48 p-4 text-sm leading-relaxed resize-none bg-transparent relative z-10 focus:outline-none text-white";

const overlayClass =
  "pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words p-4 text-sm leading-relaxed z-0";

export function AutocompleteTextarea() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");

  const { complete, completion, isLoading, setCompletion } = useCompletion({
    api: "/api/complete",
  });

  useEffect(() => {
    setCompletion("");
  }, [text, setCompletion]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && !isLoading) {
      e.preventDefault();
      if (completion) {
        setText((prev) => prev + completion);
        setCompletion("");
      } else {
        const pos = ref.current?.selectionStart ?? text.length;
        complete("", { body: { text, cursorPosition: pos } });
      }
    }

    if (e.key === "Escape" && completion) {
      e.preventDefault();
      setCompletion("");
    }
  };

  return (
    <div className="relative rounded-xl border border-gray-700 bg-gray-900 font-mono">
      <div aria-hidden className={overlayClass}>
        <span className="invisible">{text}</span>
        <span className="text-gray-500">{completion}</span>
      </div>

      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Start typing… press Tab for a suggestion"
        className={textareaClass}
        spellCheck={false}
      />

      {isLoading && (
        <span className="absolute bottom-3 right-3 text-xs text-blue-400 animate-pulse">
          Completing…
        </span>
      )}
    </div>
  );
}
