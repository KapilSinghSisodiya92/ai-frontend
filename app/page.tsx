import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { accentStyles, demos } from "@/lib/demos";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        <header className="text-center mb-16 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Next.js 15 · TypeScript · Vercel AI SDK v6
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            AI Frontend Playground
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Interactive demos from the tutorial series. Each page is a
            self-contained example you can explore, break, and learn from.
          </p>
        </header>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {demos.map((demo) => {
            const styles = accentStyles[demo.accent];
            const Icon = demo.icon;

            return (
              <Link
                key={demo.href}
                href={demo.href}
                className={`group relative flex flex-col rounded-2xl border bg-gray-900/50 p-6 transition-all duration-300 hover:bg-gray-900 hover:shadow-2xl ${styles.border} ${styles.glow}`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className={`p-2.5 rounded-xl ${styles.iconBg} border border-gray-800`}
                  >
                    <Icon className={`w-5 h-5 ${styles.text}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>

                {demo.episode && (
                  <span
                    className={`text-[10px] font-medium uppercase tracking-widest ${styles.text} mb-1.5`}
                  >
                    {demo.episode}
                  </span>
                )}

                <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90">
                  {demo.title}
                </h2>

                <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-4">
                  {demo.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {demo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-gray-800/80 text-[10px] font-medium text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-600 mt-12">
          Set{" "}
          <code className="px-1.5 py-0.5 rounded bg-gray-900 text-gray-500 font-mono">
            OPENAI_API_KEY
          </code>{" "}
          in <code className="text-gray-500">.env.local</code> to run the live
          demos.
        </p>
      </div>
    </main>
  );
}
