"use client";

import { useState } from "react";
import { Check, Copy, Loader2, Palette as PaletteIcon } from "lucide-react";
import {
  paletteToCssVars,
  SCALE_STEPS,
  type Palette,
} from "@/lib/palette-schema";

const DEFAULT_DESCRIPTION =
  "A fintech startup — trustworthy, modern, slightly serious but approachable";

const SCALE_NAMES = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "success",
  "warning",
  "danger",
] as const;

export function PaletteGenerator() {
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setPalette(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyConfig = async () => {
    if (!palette) return;
    await navigator.clipboard.writeText(palette.tailwindConfig);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const styleVars = palette ? paletteToCssVars(palette) : undefined;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition resize-none"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !description.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating palette…
            </>
          ) : (
            <>
              <PaletteIcon className="w-4 h-4" />
              Generate palette
            </>
          )}
        </button>
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </div>

      {palette && (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {palette.brandName}
              </h3>
              <button
                type="button"
                onClick={handleCopyConfig}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition"
              >
                {copiedConfig ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied config
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy tailwind.config
                  </>
                )}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SCALE_NAMES.map((name) => (
                <div key={name} className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">
                    {name}
                  </p>
                  <div className="flex rounded-lg overflow-hidden border border-gray-800">
                    {SCALE_STEPS.map((step) => (
                      <div
                        key={step}
                        className="flex-1 h-8"
                        style={{
                          backgroundColor: palette[name][step],
                        }}
                        title={`${name}-${step}: ${palette[name][step]}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Live component preview
            </p>
            <div
              style={styleVars}
              className="rounded-2xl border border-gray-800 p-8 space-y-6"
            >
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ backgroundColor: "var(--color-neutral-bg)" }}
              >
                <h4
                  className="text-lg font-bold"
                  style={{ color: "var(--color-primary-dark)" }}
                >
                  {palette.brandName}
                </h4>
                <p style={{ color: "var(--color-neutral-muted)" }}>
                  Preview how your palette looks on real UI components.
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white transition"
                    style={{ backgroundColor: "var(--color-primary)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-primary-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-primary)";
                    }}
                  >
                    Primary
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    Secondary
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  >
                    Accent
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--color-success-light)",
                      color: "var(--color-success)",
                    }}
                  >
                    Success
                  </span>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--color-warning-light)",
                      color: "var(--color-warning)",
                    }}
                  >
                    Warning
                  </span>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--color-danger-light)",
                      color: "var(--color-danger)",
                    }}
                  >
                    Danger
                  </span>
                </div>

                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full max-w-xs px-3 py-2 rounded-lg text-sm outline-none border"
                  style={{
                    borderColor: "var(--color-neutral-border)",
                    color: "var(--color-neutral-text)",
                    backgroundColor: "#fff",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px var(--color-secondary-light)";
                    e.currentTarget.style.borderColor = "var(--color-secondary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor =
                      "var(--color-neutral-border)";
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
              tailwind.config extend.colors
            </div>
            <pre className="p-4 text-xs text-gray-400 overflow-x-auto font-mono leading-relaxed">
              {palette.tailwindConfig}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
