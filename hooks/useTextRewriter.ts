import { useCompletion } from "@ai-sdk/react";
import { useCallback, useEffect, useRef, useState } from "react";

export const REWRITE_MODES = {
  simplify:
    "Rewrite this text to be simpler and clearer.",
  professional:
    "Rewrite this text to sound more professional.",
  shorter:
    "Rewrite this text to be 50% shorter without losing meaning.",
  grammar:
    "Fix all grammar and punctuation errors. Keep the same style.",
} as const;

export type RewriteMode = keyof typeof REWRITE_MODES;

export const REWRITE_MODE_LABELS: Record<RewriteMode, string> = {
  simplify: "Simplify",
  professional: "Make professional",
  shorter: "Make shorter",
  grammar: "Fix grammar",
};

type SelectionState = {
  text: string;
  range: Range;
};

type PopoverPosition = {
  top: number;
  left: number;
};

export function useTextRewriter() {
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const pendingApply = useRef(false);
  const selectionRef = useRef<SelectionState | null>(null);

  const { complete, completion, isLoading, setCompletion } = useCompletion({
    api: "/api/rewrite",
  });

  const closePopover = useCallback(() => {
    setShowPopover(false);
    setSelection(null);
    selectionRef.current = null;
    setPosition(null);
    setCompletion("");
    pendingApply.current = false;
  }, [setCompletion]);

  const applyRewrite = useCallback(() => {
    const current = selectionRef.current;
    if (!current || !completion) return;

    current.range.deleteContents();
    current.range.insertNode(document.createTextNode(completion));
    window.getSelection()?.removeAllRanges();
    closePopover();
  }, [completion, closePopover]);

  const rewrite = useCallback(
    (mode: RewriteMode) => {
      if (!selection) return;
      pendingApply.current = true;
      setCompletion("");
      complete(selection.text, { body: { mode: REWRITE_MODES[mode] } });
    },
    [selection, complete, setCompletion]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        const sel = window.getSelection();
        if (sel && sel.toString().trim()) {
          const range = sel.getRangeAt(0).cloneRange();
          const rect = range.getBoundingClientRect();
          const state = { text: sel.toString(), range };
          setSelection(state);
          selectionRef.current = state;
          setPosition({
            top: rect.bottom + 8,
            left: rect.left,
          });
          setShowPopover(true);
          setCompletion("");
        }
      }

      if (e.key === "Escape") {
        closePopover();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closePopover, setCompletion]);

  useEffect(() => {
    if (pendingApply.current && !isLoading && completion) {
      applyRewrite();
      pendingApply.current = false;
    }
  }, [isLoading, completion, applyRewrite]);

  return {
    selection,
    showPopover,
    position,
    completion,
    isLoading,
    rewrite,
    closePopover,
  };
}
