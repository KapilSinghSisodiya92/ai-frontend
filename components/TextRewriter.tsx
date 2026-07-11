"use client";

import { Loader2, X } from "lucide-react";
import {
  REWRITE_MODE_LABELS,
  type RewriteMode,
  useTextRewriter,
} from "@/hooks/useTextRewriter";

export function TextRewriter() {
  const {
    selection,
    showPopover,
    position,
    completion,
    isLoading,
    rewrite,
    closePopover,
  } = useTextRewriter();

  if (!showPopover || !position) return null;

  return (
    <div
      className="fixed z-50 w-72 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl shadow-black/40 overflow-hidden"
      style={{
        top: position.top,
        left: Math.min(position.left, window.innerWidth - 300),
      }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-950">
        <p className="text-[10px] uppercase tracking-widest text-gray-500">
          Rewrite selection
        </p>
        <button
          type="button"
          onClick={closePopover}
          className="p-1 rounded text-gray-500 hover:text-gray-300 transition"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {selection && (
        <p className="px-3 py-2 text-xs text-gray-500 border-b border-gray-800 line-clamp-2 italic">
          &ldquo;{selection.text}&rdquo;
        </p>
      )}

      {isLoading ? (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-blue-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Rewriting…
          </div>
          {completion && (
            <p className="text-sm text-gray-300 leading-relaxed">{completion}</p>
          )}
        </div>
      ) : (
        <div className="p-2 grid grid-cols-2 gap-1.5">
          {(Object.keys(REWRITE_MODE_LABELS) as RewriteMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => rewrite(mode)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white transition text-left"
            >
              {REWRITE_MODE_LABELS[mode]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
