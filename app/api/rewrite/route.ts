import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, mode } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a text rewriting assistant.
             Output ONLY the rewritten text — no preamble, no explanation.`,
    prompt: `${mode}\n\nOriginal text: "${prompt}"`,
    maxOutputTokens: 400,
  });

  return result.toUIMessageStreamResponse();
}
