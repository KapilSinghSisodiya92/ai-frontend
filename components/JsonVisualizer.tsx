"use client";

import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css";
import {
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Loader2,
} from "lucide-react";
import {
  buildFieldTree,
  semanticTypeLabels,
  semanticTypeStyles,
  type FieldTreeNode,
  type JSONAnalysis,
  type SemanticType,
} from "@/lib/json-schema";

hljs.registerLanguage("typescript", typescript);

const SAMPLE_JSON = `{
  "id": "usr_8f3k2",
  "created_at_epoch_ms": 1719427200000,
  "email": "jane@example.com",
  "profile": {
    "display_name": "Jane Doe",
    "avatar_url": "https://cdn.example.com/avatars/jane.jpg"
  },
  "subscription": {
    "plan": "pro",
    "amount_cents": 2900,
    "active": true
  },
  "recent_orders": [
    {
      "order_id": "ord_991",
      "total_usd": 49.99,
      "placed_at": "2024-06-26T12:00:00Z"
    }
  ]
}`;

function FieldNode({ node, depth = 0 }: { node: FieldTreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const field = node.field;

  return (
    <div className="select-none">
      <div
        className="flex items-start gap-1.5 py-1 rounded-md hover:bg-gray-800/60 group"
        style={{ paddingLeft: `${depth * 14}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-0.5 p-0.5 text-gray-500 hover:text-gray-300 shrink-0"
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        ) : (
          <span className="w-4.5 shrink-0" />
        )}

        <div
          className="min-w-0 flex-1"
          title={
            field
              ? `${field.purpose}\nExample: ${field.example}${field.isRequired ? "" : " (optional)"}`
              : undefined
          }
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs text-gray-200">{node.name}</span>
            {field && (
              <>
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-700 text-gray-500 font-mono">
                  {field.type}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${semanticTypeStyles[field.semanticType as SemanticType]}`}
                >
                  {semanticTypeLabels[field.semanticType as SemanticType]}
                </span>
                {!field.isRequired && (
                  <span className="text-[10px] text-gray-600">optional</span>
                )}
              </>
            )}
          </div>
          {field && (
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2 group-hover:text-gray-400 transition">
              {field.purpose}
            </p>
          )}
        </div>
      </div>

      {hasChildren && open && (
        <div>
          {node.children.map((child) => (
            <FieldNode key={child.fullPath} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function JsonVisualizer() {
  const [json, setJson] = useState(SAMPLE_JSON);
  const [analysis, setAnalysis] = useState<JSONAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleAnalyse = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      JSON.parse(json);
    } catch {
      setError("Invalid JSON — fix syntax before analysing.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/analyse-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!analysis) return;
    await navigator.clipboard.writeText(analysis.typescriptInterface);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!codeRef.current || !analysis) return;
    codeRef.current.textContent = analysis.typescriptInterface;
    codeRef.current.className = "language-typescript";
    codeRef.current.removeAttribute("data-highlighted");
    hljs.highlightElement(codeRef.current);
  }, [analysis]);

  const tree = analysis ? buildFieldTree(analysis.fields) : [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-gray-500">
          Paste JSON
        </p>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          spellCheck={false}
          className="w-full h-48 font-mono text-xs leading-relaxed bg-gray-900 border border-gray-800 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-blue-500 transition resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAnalyse}
          disabled={loading || !json.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analysing…
            </>
          ) : (
            <>
              <Braces className="w-4 h-4" />
              Analyse JSON
            </>
          )}
        </button>
      </div>

      {error && <p className="text-sm text-rose-400 text-center">{error}</p>}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl border border-gray-800 bg-gray-900/40">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-sm text-gray-500">Mapping structure and explaining fields…</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 space-y-2">
            <p className="text-sm text-gray-300 leading-relaxed">{analysis.summary}</p>
            <p className="text-xs text-gray-500">
              <span className="text-gray-400 font-medium">API purpose: </span>
              {analysis.apiPurpose}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 min-h-[480px]">
            <div className="flex flex-col rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-800 bg-gray-900">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">
                  Field tree
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {tree.map((node) => (
                  <FieldNode key={node.fullPath} node={node} />
                ))}
              </div>
            </div>

            <div className="flex flex-col rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">
                  TypeScript interface
                </span>
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
              </div>
              <pre className="flex-1 overflow-auto p-4 m-0 text-xs leading-relaxed bg-gray-950">
                <code ref={codeRef} />
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
