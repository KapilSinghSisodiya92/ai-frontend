import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { PLATFORMS, type Platform } from "@/lib/social-rewrite";

export const maxDuration = 60;

const PLATFORM_PROMPTS: Record<Platform, string> = {
  twitter: `Rewrite for Twitter: punchy, under 240 characters, no generic hashtags,
            conversational, ends with a hook. No em-dashes.
            Output ONLY the rewritten post — no preamble.`,
  linkedin: `Rewrite for LinkedIn: professional but personal, 150-300 words,
             start with a strong first line, include a story arc, end with a question.
             Output ONLY the rewritten post — no preamble.`,
  instagram: `Rewrite for Instagram: casual, visual language, 2-3 short paragraphs,
              1-2 relevant emojis max, 3-5 relevant hashtags at the end.
              Output ONLY the rewritten post — no preamble.`,
};

export async function POST(req: Request) {
  try {
    const { content, platform } = await req.json();

    if (!content?.trim()) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    if (!PLATFORMS.includes(platform)) {
      return Response.json({ error: "Invalid platform" }, { status: 400 });
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: PLATFORM_PROMPTS[platform as Platform],
      prompt: content,
      maxOutputTokens: platform === "twitter" ? 120 : 500,
    });

    return Response.json({ text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Rewrite failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
