"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  summary: string;
  score: number;
}

export function AISearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        setResults(await res.json());
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const displayResults = query.trim() ? results : [];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by meaning — try 'how components remember things'..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 animate-spin" />
        )}
      </div>

      {displayResults.length > 0 && (
        <ul className="space-y-3">
          {displayResults.map((result) => (
            <li
              key={result.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">{result.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{result.summary}</p>
                </div>
                <span className="text-xs font-mono text-blue-400 shrink-0">
                  {(result.score * 100).toFixed(1)}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {query.trim() && !loading && displayResults.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          No results — run{" "}
          <code className="text-gray-400">npx tsx scripts/embed-dataset.ts</code>{" "}
          to generate embeddings.
        </p>
      )}
    </div>
  );
}
