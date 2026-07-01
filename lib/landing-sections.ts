export const SECTION_PROMPTS = {
  hero: "A full-width hero with h1, subtitle, and two CTA buttons.",
  features:
    "Three feature cards in a grid with icon, title, description.",
  pricing:
    "Two pricing tiers side by side — Free and Pro — with feature lists.",
  testimonials:
    "Three testimonial cards with avatar initials, quote, and name.",
  cta: "A full-width CTA section with headline and email signup input.",
} as const;

export type SectionKey = keyof typeof SECTION_PROMPTS;

export const SECTION_KEYS = Object.keys(
  SECTION_PROMPTS
) as SectionKey[];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero",
  features: "Features",
  pricing: "Pricing",
  testimonials: "Testimonials",
  cta: "CTA",
};

export function stripCodeFences(code: string) {
  return code
    .replace(/^```(?:jsx|tsx|html)?\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();
}

/** Convert React JSX fragment to HTML the iframe can render with Tailwind CDN. */
export function jsxToHtmlForPreview(jsx: string) {
  return jsx
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/className=/g, "class=")
    .replace(/htmlFor=/g, "for=")
    .replace(/<>|<\/>/g, "")
    .trim();
}

export function buildPreviewHtml(jsx: string) {
  const html = jsxToHtmlForPreview(jsx);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  ${html}
  <script src="https://cdn.tailwindcss.com"><\/script>
</body>
</html>`;
}
