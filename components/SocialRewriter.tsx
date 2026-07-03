"use client";

import { useState } from "react";
import { Check, Copy, Loader2, Share2 } from "lucide-react";
import {
  DEFAULT_POST,
  PLATFORM_CHAR_LIMITS,
  PLATFORM_LABELS,
  PLATFORM_STYLES,
  PLATFORMS,
  type Platform,
} from "@/lib/social-rewrite";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  twitter: <TwitterIcon className="w-4 h-4" />,
  linkedin: <LinkedinIcon className="w-4 h-4" />,
  instagram: <InstagramIcon className="w-4 h-4" />,
};

async function rewriteFor(content: string, platform: Platform): Promise<string> {
  const res = await fetch("/api/rewrite-for", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, platform }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Rewrite failed");
  return data.text as string;
}

function CardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-3 bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-800 rounded w-11/12" />
      <div className="h-3 bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-800 rounded w-4/5" />
      <div className="h-3 bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-800 rounded w-3/4" />
      <div className="h-3 bg-gray-800 rounded w-5/6 mt-4" />
      <div className="h-3 bg-gray-800 rounded w-2/3" />
    </div>
  );
}

function PlatformCard({
  platform,
  text,
  loading,
  copied,
  onCopy,
}: {
  platform: Platform;
  text?: string;
  loading: boolean;
  copied: boolean;
  onCopy: () => void;
}) {
  const styles = PLATFORM_STYLES[platform];
  const charLimit = PLATFORM_CHAR_LIMITS[platform];
  const charCount = text?.length ?? 0;
  const overLimit = charLimit != null && charCount > charLimit;

  return (
    <div
      className={`flex flex-col rounded-xl border ${styles.border} ${styles.bg} overflow-hidden min-h-[320px]`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/80">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-lg ${styles.iconBg} ${styles.accent}`}
          >
            {PLATFORM_ICONS[platform]}
          </div>
          <span className="text-sm font-semibold text-white">
            {PLATFORM_LABELS[platform]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {charLimit != null && text && (
            <span
              className={`text-xs font-mono tabular-nums ${
                overLimit ? "text-red-400" : "text-gray-500"
              }`}
            >
              {charCount}/{charLimit}
            </span>
          )}
          {text && !loading && (
            <button
              type="button"
              onClick={onCopy}
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
      </div>

      <div className="flex-1 p-4">
        {loading ? (
          <CardSkeleton />
        ) : text ? (
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        ) : (
          <p className="text-sm text-gray-600 italic">
            Rewritten {PLATFORM_LABELS[platform]} post will appear here
          </p>
        )}
      </div>
    </div>
  );
}

export function SocialRewriter() {
  const [content, setContent] = useState(DEFAULT_POST);
  const [results, setResults] = useState<Partial<Record<Platform, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedPlatform, setCopiedPlatform] = useState<Platform | null>(null);

  const rewriteForAll = async () => {
    if (!content.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResults({});

    try {
      const [twitter, linkedin, instagram] = await Promise.all(
        PLATFORMS.map((platform) => rewriteFor(content, platform))
      );

      setResults({ twitter, linkedin, instagram });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rewrite failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (platform: Platform) => {
    const text = results[platform];
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-gray-500">
          Your post
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-gray-200 leading-relaxed focus:outline-none focus:border-blue-500 transition resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={rewriteForAll}
          disabled={loading || !content.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Rewriting for all platforms…
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Rewrite for all platforms
            </>
          )}
        </button>
      </div>

      {error && <p className="text-sm text-rose-400 text-center">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-3">
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform}
            platform={platform}
            text={results[platform]}
            loading={loading}
            copied={copiedPlatform === platform}
            onCopy={() => handleCopy(platform)}
          />
        ))}
      </div>
    </div>
  );
}
