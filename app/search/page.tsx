import { AISearch } from "@/components/AISearch";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 px-8 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-400" />
            <h1 className="text-xl font-bold tracking-tight">AI Semantic Search</h1>
          </div>
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 transition"
          >
            ← Canvas demo
          </Link>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        <div className="text-center mb-10 space-y-3 max-w-lg">
          <p className="text-sm text-gray-400 leading-relaxed">
            Type a question in plain English. Results are ranked by meaning, not
            keywords — powered by OpenAI embeddings and cosine similarity.
          </p>
          <p className="text-xs text-gray-600 italic">
            Try: &ldquo;how components remember things&rdquo; or &ldquo;avoid
            re-rendering on every change&rdquo;
          </p>
        </div>

        <AISearch />
      </section>
    </main>
  );
}
