"use client";

import { useCallback, useState } from "react";
import {
  Check,
  Copy,
  ImageIcon,
  Loader2,
  Upload,
} from "lucide-react";
import type { AltTextResult } from "@/lib/alt-text-schema";

async function processFile(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const base64 = dataUrl.split(",")[1];
  const res = await fetch("/api/alt-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
  });

  if (!res.ok) throw new Error("Failed to generate alt text");
  return {
    preview: dataUrl,
    result: (await res.json()) as AltTextResult,
  };
}

export function AltTextGenerator() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AltTextResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const { preview: url, result: altResult } = await processFile(file);
      setPreview(url);
      setResult(altResult);
    } catch {
      setError("Something went wrong. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = result.isDecorative ? "" : result.altText;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {!preview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-16 transition ${
            dragging
              ? "border-blue-500 bg-blue-500/5"
              : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          {loading ? (
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-4" />
          ) : (
            <Upload className="w-10 h-10 text-gray-600 mb-4" />
          )}
          <p className="text-sm font-medium text-gray-300">
            {loading ? "Analyzing image…" : "Drop an image here"}
          </p>
          <p className="text-xs text-gray-600 mt-1">or click to browse</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
              Preview
            </p>
            <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={result?.isDecorative ? "" : result?.altText ?? ""}
                className="w-full h-auto max-h-80 object-contain bg-gray-950"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setResult(null);
                setError(null);
              }}
              className="text-xs text-gray-500 hover:text-gray-300 transition"
            >
              Upload a different image
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
              Generated alt text
            </p>

            {loading ? (
              <div className="flex items-center justify-center rounded-2xl border border-gray-800 bg-gray-900 p-12">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : result ? (
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 space-y-5">
                {result.isDecorative ? (
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
                    <p className="text-sm text-amber-300 font-medium">
                      Decorative image
                    </p>
                    <p className="text-xs text-amber-400/80 mt-1">
                      Use{" "}
                      <code className="font-mono bg-gray-950 px-1 rounded">
                        alt=&quot;&quot;
                      </code>{" "}
                      — no description needed.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                          Alt text ({result.altText.length}/125)
                        </p>
                        <p className="text-sm text-white leading-relaxed">
                          {result.altText}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="shrink-0 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition"
                        aria-label="Copy alt text"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
                    Long description
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {result.description}
                  </p>
                </div>

                {result.objects.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                      Detected objects
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.objects.map((obj) => (
                        <span
                          key={obj}
                          className="px-2 py-0.5 rounded-md bg-gray-800 text-xs text-gray-400"
                        >
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-rose-400 text-center flex items-center justify-center gap-2">
          <ImageIcon className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
