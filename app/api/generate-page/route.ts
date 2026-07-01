import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import {
  SECTION_PROMPTS,
  type SectionKey,
} from "@/lib/landing-sections";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { prompt: description, sections } = await req.json();

  if (!description?.trim()) {
    return Response.json({ error: "Description is required" }, { status: 400 });
  }

  if (!sections?.length) {
    return Response.json(
      { error: "Select at least one section" },
      { status: 400 }
    );
  }

  const sectionInstructions = (sections as SectionKey[])
    .filter((s) => s in SECTION_PROMPTS)
    .map((s) => `- ${s}: ${SECTION_PROMPTS[s]}`)
    .join("\n");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are an expert React and Tailwind CSS developer.
             Output ONLY valid JSX using Tailwind utility classes.
             No imports, no exports — just the JSX fragment.
             No markdown code fences. No explanation.
             Use placeholder text and realistic copy for the product described.`,
    prompt: `Product: ${description}\n\nGenerate these sections:\n${sectionInstructions}`,
    maxOutputTokens: 2000,
  });

  return result.toUIMessageStreamResponse();
}
