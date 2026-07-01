import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { text, cursorPosition } = await req.json();
  const before = text.slice(0, cursorPosition);
  const after = text.slice(cursorPosition);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are an autocomplete engine. Complete the text after the cursor.
             Output ONLY the completion — no explanation, no punctuation changes.
             Keep it to one sentence maximum.`,
    prompt: `Before cursor: "${before}"\nAfter cursor: "${after}"\nComplete:`,
    maxOutputTokens: 60,
  });

  return result.toUIMessageStreamResponse();
}
