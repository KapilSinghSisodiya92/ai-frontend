import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { formatEpisode, getDemoByHref } from "@/lib/demos";

interface DemoShellProps {
  href: string;
  children: React.ReactNode;
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "7xl";
}

const maxWidthClass = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "7xl": "max-w-7xl",
};

export function DemoShell({
  href,
  children,
  maxWidth = "2xl",
}: DemoShellProps) {
  const demo = getDemoByHref(href);
  if (!demo) return null;

  const Icon = demo.icon;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="sticky top-0 z-10 border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All demos
          </Link>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 shrink-0">
              <Icon className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              {formatEpisode(demo) && (
                <p className="text-[10px] uppercase tracking-widest text-gray-600 truncate">
                  {formatEpisode(demo)}
                </p>
              )}
              <h1 className="text-sm font-semibold tracking-tight truncate">
                {demo.title}
              </h1>
            </div>
          </div>

          <div className="w-16 shrink-0" />
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center px-6 py-12 sm:py-16">
        <div
          className={`${maxWidthClass[maxWidth]} w-full text-center mb-10 space-y-3`}
        >
          <p className="text-sm text-gray-400 leading-relaxed">
            {demo.description}
          </p>
          <p className="text-xs text-gray-600 italic">{demo.hint}</p>
        </div>

        <div className={`${maxWidthClass[maxWidth]} w-full`}>{children}</div>
      </section>

      <footer className="border-t border-gray-800/60 py-6">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition"
          >
            <ArrowUpRight className="w-3.5 h-3.5 rotate-180" />
            Explore more demos
          </Link>
        </div>
      </footer>
    </main>
  );
}
