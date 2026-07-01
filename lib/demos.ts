import {
  Layout,
  Search,
  Wand2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type Demo = {
  href: string;
  title: string;
  episode?: string;
  description: string;
  hint: string;
  icon: LucideIcon;
  accent: "amber" | "blue" | "violet" | "emerald";
  tags: string[];
};

export const demos: Demo[] = [
  {
    href: "/search",
    title: "AI Semantic Search",
    episode: "Series A · Ep 1",
    description:
      "Search by meaning, not keywords. Embeds your query with OpenAI, scores against pre-embedded articles with cosine similarity.",
    hint: 'Try: "how components remember things"',
    icon: Search,
    accent: "blue",
    tags: ["Embeddings", "API Route", "Debounce"],
  },
  {
    href: "/complete",
    title: "Streaming Autocomplete",
    episode: "Series A · Ep 2",
    description:
      "Ghost-text suggestions as you type. Tab to request, Tab again to accept — powered by useCompletion and streamText.",
    hint: 'Try: "React hooks let you"',
    icon: Wand2,
    accent: "violet",
    tags: ["useCompletion", "Ghost Text", "Streaming"],
  },
  {
    href: "/validate",
    title: "AI Form Validation",
    episode: "Series A · Ep 3",
    description:
      "Two-pass validation: Zod for instant syntax checks, AI for semantic meaning on blur — company names and job titles.",
    hint: 'Try: "pizza for lunch" as company name',
    icon: ShieldCheck,
    accent: "emerald",
    tags: ["Zod", "generateObject", "onBlur"],
  },
  {
    href: "/canvas",
    title: "AI Canvas Architect",
    description:
      "Describe a UI in plain English and watch it render live. The original generative UI demo with streaming JSON layouts.",
    hint: "Try: a signup card with email, password, and an indigo button",
    icon: Layout,
    accent: "amber",
    tags: ["useChat", "Generative UI", "Streaming"],
  },
];

export const accentStyles: Record<
  Demo["accent"],
  { border: string; bg: string; text: string; glow: string; iconBg: string }
> = {
  blue: {
    border: "border-blue-500/20 hover:border-blue-500/40",
    bg: "bg-blue-500/5",
    text: "text-blue-400",
    glow: "group-hover:shadow-blue-500/10",
    iconBg: "bg-blue-500/10",
  },
  violet: {
    border: "border-violet-500/20 hover:border-violet-500/40",
    bg: "bg-violet-500/5",
    text: "text-violet-400",
    glow: "group-hover:shadow-violet-500/10",
    iconBg: "bg-violet-500/10",
  },
  emerald: {
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    bg: "bg-emerald-500/5",
    text: "text-emerald-400",
    glow: "group-hover:shadow-emerald-500/10",
    iconBg: "bg-emerald-500/10",
  },
  amber: {
    border: "border-amber-500/20 hover:border-amber-500/40",
    bg: "bg-amber-500/5",
    text: "text-amber-400",
    glow: "group-hover:shadow-amber-500/10",
    iconBg: "bg-amber-500/10",
  },
};

export function getDemoByHref(href: string): Demo | undefined {
  return demos.find((d) => d.href === href);
}
