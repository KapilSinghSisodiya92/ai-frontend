import Link from "next/link";
import { Sparkles } from "lucide-react";
import { DemoCard } from "@/components/DemoCard";
import { getDemosBySeries, seriesInfo } from "@/lib/demos";

function SeriesSection({ series }: { series: "A" | "B" }) {
  const info = seriesInfo[series];
  const demos = getDemosBySeries(series);
  const isSeriesB = series === "B";

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-800 pb-6">
        <div className="space-y-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${
              isSeriesB
                ? "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            }`}
          >
            {info.label}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {info.title}
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
            {info.description}
          </p>
        </div>
        <p className="text-xs text-gray-600 shrink-0">
          {demos.length} demo{demos.length === 1 ? "" : "s"}
        </p>
      </div>

      <div
        className={`grid gap-5 grid-cols-1 md:grid-cols-2 ${
          isSeriesB ? "xl:grid-cols-2" : "xl:grid-cols-3"
        }`}
      >
        {demos.map((demo) => (
          <DemoCard key={demo.href} demo={demo} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24 space-y-20">
        <header className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Next.js 15 · TypeScript · Vercel AI SDK v6
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            AI Frontend Playground
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Two tutorial series, one repo. Series A adds AI primitives to your
            app. Series B generates full UI from a prompt.
          </p>
        </header>

        <SeriesSection series="A" />
        <SeriesSection series="B" />

        <p className="text-center text-xs text-gray-600 pt-4">
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
