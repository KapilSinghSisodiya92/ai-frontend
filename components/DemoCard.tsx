import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { accentStyles, formatEpisode, type Demo } from "@/lib/demos";

export function DemoCard({ demo }: { demo: Demo }) {
  const styles = accentStyles[demo.accent];
  const Icon = demo.icon;

  return (
    <Link
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

        {formatEpisode(demo) && (
          <span
            className={`text-[10px] font-medium uppercase tracking-widest ${styles.text} mb-1.5`}
          >
            {formatEpisode(demo)}
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
}
