export const PLATFORMS = ["twitter", "linkedin", "instagram"] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  instagram: "Instagram",
};

export const PLATFORM_CHAR_LIMITS: Partial<Record<Platform, number>> = {
  twitter: 280,
};

export const PLATFORM_STYLES: Record<
  Platform,
  { border: string; bg: string; accent: string; iconBg: string }
> = {
  twitter: {
    border: "border-sky-500/20",
    bg: "bg-sky-500/5",
    accent: "text-sky-400",
    iconBg: "bg-sky-500/10",
  },
  linkedin: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    accent: "text-blue-400",
    iconBg: "bg-blue-500/10",
  },
  instagram: {
    border: "border-fuchsia-500/20",
    bg: "bg-fuchsia-500/5",
    accent: "text-fuchsia-400",
    iconBg: "bg-fuchsia-500/10",
  },
};

export const DEFAULT_POST = `We just launched our new product after 6 months of building in public.

It's a tool that helps developers add AI features to their React apps without wrestling with API keys, streaming, or prompt engineering.

Would love your feedback — link in bio.`;
