import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { prompt: description } = await req.json();

  if (!description?.trim()) {
    return Response.json({ error: "Description is required" }, { status: 400 });
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are an expert React and Tailwind CSS developer.
Output ONLY valid JSX using Tailwind utility classes.
No imports, no exports — just the JSX fragment.
No markdown code fences. No explanation.
Use realistic placeholder content matching the description.`,
    prompt: description,
    maxOutputTokens: 1500,
  });

  return result.toUIMessageStreamResponse();
}
