import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { AIValidationResult } from "@/lib/validation-schemas";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { field, value } = await req.json();

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: AIValidationResult,
    prompt: `Validate this ${field}: "${value}".
             Is it a plausible, real-world value for a B2B SaaS signup form?`,
  });

  return Response.json(object);
}
