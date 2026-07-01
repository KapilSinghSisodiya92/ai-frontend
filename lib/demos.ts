import {
  Layout,
  Search,
  Wand2,
  ShieldCheck,
  MessageCircle,
  ImageIcon,
  Keyboard,
  Globe,
  Code2,
  LayoutTemplate,
  Boxes,
  Palette,
  type LucideIcon,
} from "lucide-react";

export type DemoSeries = "A" | "B";

export type DemoAccent =
  | "amber"
  | "blue"
  | "violet"
  | "emerald"
  | "rose"
  | "cyan"
  | "indigo"
  | "teal"
  | "orange"
  | "fuchsia";

export type Demo = {
  series: DemoSeries;
  href: string;
  title: string;
  episode?: string;
  description: string;
  hint: string;
  icon: LucideIcon;
  accent: DemoAccent;
  tags: string[];
};

export const seriesInfo: Record<
  DemoSeries,
  { label: string; title: string; description: string }
> = {
  A: {
    label: "Series A",
    title: "AI primitives in React",
    description:
      "Drop-in AI features — search, autocomplete, validation, chat, and more. One hook, one route, one component.",
  },
  B: {
    label: "Series B",
    title: "Generative UI & builders",
    description:
      "AI that builds interfaces — landing pages, components, and full layouts streamed as real JSX you can ship.",
  },
};

export const demos: Demo[] = [
  {
    series: "A",
    href: "/search",
    title: "AI Semantic Search",
    episode: "Ep 1",
    description:
      "Search by meaning, not keywords. Embeds your query with OpenAI, scores against pre-embedded articles with cosine similarity.",
    hint: 'Try: "how components remember things"',
    icon: Search,
    accent: "blue",
    tags: ["Embeddings", "API Route", "Debounce"],
  },
  {
    series: "A",
    href: "/complete",
    title: "Streaming Autocomplete",
    episode: "Ep 2",
    description:
      "Ghost-text suggestions as you type. Tab to request, Tab again to accept — powered by useCompletion and streamText.",
    hint: 'Try: "React hooks let you"',
    icon: Wand2,
    accent: "violet",
    tags: ["useCompletion", "Ghost Text", "Streaming"],
  },
  {
    series: "A",
    href: "/validate",
    title: "AI Form Validation",
    episode: "Ep 3",
    description:
      "Two-pass validation: Zod for instant syntax checks, AI for semantic meaning on blur — company names and job titles.",
    hint: 'Try: "pizza for lunch" as company name',
    icon: ShieldCheck,
    accent: "emerald",
    tags: ["Zod", "generateObject", "onBlur"],
  },
  {
    series: "A",
    href: "/chat",
    title: "Chat Widget",
    episode: "Ep 4",
    description:
      "A floating assistant on every page. One hook, one API route, one component — dropped into your root layout.",
    hint: "Click the blue button in the bottom-right corner",
    icon: MessageCircle,
    accent: "rose",
    tags: ["useChat", "Widget", "Layout"],
  },
  {
    series: "A",
    href: "/alt-text",
    title: "AI Alt-Text Generator",
    episode: "Ep 5",
    description:
      "Drop an image and get WCAG-compliant alt text instantly. Vision model returns alt text, description, detected objects, and decorative flag.",
    hint: "Drop any photo — product shot, screenshot, or illustration",
    icon: ImageIcon,
    accent: "cyan",
    tags: ["Vision", "generateObject", "a11y"],
  },
  {
    series: "A",
    href: "/rewrite",
    title: "AI Text Rewriter",
    episode: "Ep 6",
    description:
      "Select text anywhere and hit Cmd+Shift+R. A popover offers four rewrite modes — the selection updates in place as the stream completes.",
    hint: "Select a sentence in the draft below, then press ⌘⇧R",
    icon: Keyboard,
    accent: "indigo",
    tags: ["useCompletion", "Range API", "Shortcut"],
  },
  {
    series: "A",
    href: "/review",
    title: "AI Code Reviewer",
    episode: "Ep 7",
    description:
      "Paste a function and get a structured review — severity score, line-referenced issues, and refactored code via generateObject.",
    hint: "Hit Review on the sample code — SQL injection and XSS included",
    icon: Code2,
    accent: "orange",
    tags: ["generateObject", "Zod", "Structured"],
  },
  {
    series: "A",
    href: "/ask",
    title: "Ask This Page",
    episode: "Ep 8",
    description:
      "Paste a URL, ingest the page server-side, embed chunks, and ask questions with cited answers — RAG without a database.",
    hint: "Try https://nextjs.org/docs then ask about App Router",
    icon: Globe,
    accent: "teal",
    tags: ["RAG", "Embeddings", "streamText"],
  },
  {
    series: "A",
    href: "/canvas",
    title: "AI Canvas Architect",
    description:
      "Describe a UI in plain English and watch it render live. The original generative UI demo with streaming JSON layouts.",
    hint: "Try: a signup card with email, password, and an indigo button",
    icon: Layout,
    accent: "amber",
    tags: ["useChat", "Generative UI", "Streaming"],
  },
  {
    series: "B",
    href: "/generate-page",
    title: "AI Landing Page Generator",
    episode: "Ep 1",
    description:
      "Describe a product and generate a full landing page scaffold — hero, features, pricing, and more as streaming JSX with live preview.",
    hint: 'Try: "A SaaS tool for freelance designers to manage client feedback"',
    icon: LayoutTemplate,
    accent: "fuchsia",
    tags: ["streamText", "iframe srcdoc", "highlight.js"],
  },
  {
    series: "B",
    href: "/builder",
    title: "AI Component Builder",
    episode: "Ep 2",
    description:
      "Drag button, input, and card slots onto a canvas. Double-click to describe each one — AI generates typed JSX with props and accessibility notes.",
    hint: 'Add a Button, double-click, try "blue submit with loading spinner"',
    icon: Boxes,
    accent: "fuchsia",
    tags: ["generateObject", "Drag", "Export"],
  },
  {
    series: "B",
    href: "/palette",
    title: "AI Colour Palette",
    episode: "Ep 3",
    description:
      "Describe your brand in one sentence. Get a full Tailwind colour system with 9-shade scales and a live preview on buttons, badges, and forms.",
    hint: 'Try: "A fintech startup — trustworthy, modern, approachable"',
    icon: Palette,
    accent: "fuchsia",
    tags: ["generateObject", "CSS Variables", "Zod"],
  },
];

export const accentStyles: Record<
  DemoAccent,
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
  rose: {
    border: "border-rose-500/20 hover:border-rose-500/40",
    bg: "bg-rose-500/5",
    text: "text-rose-400",
    glow: "group-hover:shadow-rose-500/10",
    iconBg: "bg-rose-500/10",
  },
  cyan: {
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    bg: "bg-cyan-500/5",
    text: "text-cyan-400",
    glow: "group-hover:shadow-cyan-500/10",
    iconBg: "bg-cyan-500/10",
  },
  indigo: {
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    bg: "bg-indigo-500/5",
    text: "text-indigo-400",
    glow: "group-hover:shadow-indigo-500/10",
    iconBg: "bg-indigo-500/10",
  },
  teal: {
    border: "border-teal-500/20 hover:border-teal-500/40",
    bg: "bg-teal-500/5",
    text: "text-teal-400",
    glow: "group-hover:shadow-teal-500/10",
    iconBg: "bg-teal-500/10",
  },
  orange: {
    border: "border-orange-500/20 hover:border-orange-500/40",
    bg: "bg-orange-500/5",
    text: "text-orange-400",
    glow: "group-hover:shadow-orange-500/10",
    iconBg: "bg-orange-500/10",
  },
  fuchsia: {
    border: "border-fuchsia-500/20 hover:border-fuchsia-500/40",
    bg: "bg-fuchsia-500/5",
    text: "text-fuchsia-400",
    glow: "group-hover:shadow-fuchsia-500/10",
    iconBg: "bg-fuchsia-500/10",
  },
};

export function getDemoByHref(href: string): Demo | undefined {
  return demos.find((d) => d.href === href);
}

export function getDemosBySeries(series: DemoSeries): Demo[] {
  return demos.filter((d) => d.series === series);
}

export function formatEpisode(demo: Demo): string | undefined {
  if (!demo.episode) return undefined;
  return `Series ${demo.series} · ${demo.episode}`;
}
