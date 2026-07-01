"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github-dark.css";
import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import {
  buildPreviewHtml,
  SECTION_KEYS,
  SECTION_LABELS,
  stripCodeFences,
  type SectionKey,
} from "@/lib/landing-sections";

hljs.registerLanguage("xml", xml);

const DEFAULT_DESCRIPTION =
  "A SaaS tool for freelance designers to manage client feedback";

export function LandingPageGenerator() {
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [sections, setSections] = useState<SectionKey[]>([...SECTION_KEYS]);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const { complete, completion, isLoading, setCompletion } = useCompletion({
    api: "/api/generate-page",
  });

  const toggleSection = (key: SectionKey) => {
    setSections((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleGenerate = () => {
    if (!description.trim() || sections.length === 0 || isLoading) return;
    setPreviewHtml(null);
    setCompletion("");
    complete(description, { body: { sections } });
  };

  useEffect(() => {
    if (!codeRef.current) return;

    if (!completion) {
      codeRef.current.textContent = isLoading
        ? "Generating JSX…"
        : "Generated JSX will stream here";
      codeRef.current.className = "text-gray-600";
      return;
    }

    const jsx = stripCodeFences(completion);
    codeRef.current.textContent = jsx;
    codeRef.current.className = "language-xml";

    if (!isLoading) {
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current);
      setPreviewHtml(buildPreviewHtml(jsx));
    }
  }, [completion, isLoading]);

  const handleCopy = async () => {
    if (!completion) return;
    await navigator.clipboard.writeText(stripCodeFences(completion));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe your product…"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition resize-none"
        />

        <div className="flex flex-wrap gap-2">
          {SECTION_KEYS.map((key) => {
            const selected = sections.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleSection(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selected
                    ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                    : "bg-gray-900 border-gray-700 text-gray-500 hover:text-gray-300"
                }`}
              >
                {SECTION_LABELS[key]}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || !description.trim() || sections.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate landing page
            </>
          )}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 min-h-[520px]">
        <div className="flex flex-col rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">
              JSX output
            </span>
            {completion && !isLoading && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
          <pre className="flex-1 overflow-auto p-4 m-0 text-xs leading-relaxed bg-gray-950">
            <code ref={codeRef} />
          </pre>
        </div>

        <div className="flex flex-col rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-800 bg-gray-900">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">
              Live preview
            </span>
          </div>
          <div className="flex-1 bg-white min-h-[480px]">
            {previewHtml ? (
              <iframe
                title="Landing page preview"
                srcDoc={previewHtml}
                className="w-full h-full min-h-[480px] border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[480px] text-sm text-gray-400 bg-gray-900">
                {isLoading
                  ? "Preview updates when generation completes"
                  : "Preview appears after generation"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
