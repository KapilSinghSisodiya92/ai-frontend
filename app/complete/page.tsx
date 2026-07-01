import { AutocompleteTextarea } from "@/components/AutocompleteTextarea";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function CompletePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 px-8 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-400" />
            <h1 className="text-xl font-bold tracking-tight">
              AI Autocomplete
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/search" className="hover:text-gray-300 transition">
              Search demo
            </Link>
            <Link href="/" className="hover:text-gray-300 transition">
              Canvas demo
            </Link>
          </div>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        <div className="text-center mb-10 space-y-3 max-w-lg">
          <p className="text-sm text-gray-400 leading-relaxed">
            Type a sentence and press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-xs">
              Tab
            </kbd>{" "}
            to get a ghost-text suggestion. Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-xs">
              Tab
            </kbd>{" "}
            again to accept it.
          </p>
          <p className="text-xs text-gray-600 italic">
            Try starting with: &ldquo;React hooks let you&rdquo; or &ldquo;The
            main benefit of server components is&rdquo;
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <AutocompleteTextarea />
        </div>
      </section>
    </main>
  );
}
