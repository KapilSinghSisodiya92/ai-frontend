"use client";

import { useState } from "react";
import { Check, Code2, Copy, Loader2 } from "lucide-react";
import {
  severityStyles,
  type Review,
} from "@/lib/review-schema";

const SAMPLE_CODE = `function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  const res = fetch('/api/user?q=' + query);
  return res.json();
}

function renderItems(items) {
  items.forEach(item => {
    document.innerHTML += '<div>' + item.name + '</div>';
  });
}`;

export function CodeReviewer() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Review failed");
      setReview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!review) return;
    await navigator.clipboard.writeText(review.refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor =
    review && review.overallScore >= 7
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : review && review.overallScore >= 4
        ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
        : "text-red-400 border-red-500/30 bg-red-500/10";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReview}
          disabled={loading || !code.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Reviewing…
            </>
          ) : (
            <>
              <Code2 className="w-4 h-4" />
              Review code
            </>
          )}
        </button>
      </div>

      {error && <p className="text-sm text-rose-400 text-center">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-500">
            Your code
          </p>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-[420px] font-mono text-xs leading-relaxed bg-gray-900 border border-gray-800 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-blue-500 transition resize-none"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-500">
            Review
          </p>
          <div className="h-[420px] overflow-y-auto rounded-xl border border-gray-800 bg-gray-900/50 p-4 space-y-4">
            {!review && !loading && (
              <p className="text-sm text-gray-600 text-center py-16">
                Submit code to see structured feedback
              </p>
            )}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-xs text-gray-500">Analyzing…</p>
              </div>
            )}
            {review && (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border text-lg font-bold ${scoreColor}`}
                  >
                    {review.overallScore}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {review.language}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {review.summary}
                </p>
                <ul className="space-y-2">
                  {review.issues.map((issue, i) => (
                    <li
                      key={i}
                      className={`rounded-lg border px-3 py-2.5 text-xs space-y-1 ${severityStyles[issue.severity]}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold uppercase tracking-wide">
                          {issue.severity}
                        </span>
                        {issue.line != null && (
                          <span className="font-mono opacity-70">
                            L{issue.line}
                          </span>
                        )}
                      </div>
                      <p>{issue.message}</p>
                      <p className="opacity-80 italic">Fix: {issue.fix}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Refactored
            </p>
            {review && (
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
          <pre className="h-[420px] overflow-y-auto font-mono text-xs leading-relaxed bg-gray-900 border border-gray-800 rounded-xl p-4 text-emerald-300/90 whitespace-pre-wrap">
            {review?.refactoredCode ?? (
              <span className="text-gray-600">
                Refactored code will appear here
              </span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
