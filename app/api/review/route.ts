import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { ReviewSchema } from "@/lib/review-schema";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code?.trim()) {
      return Response.json({ error: "Code is required" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: ReviewSchema,
      prompt: `Review this code for bugs, security issues, and best practice violations. For each issue, set line to the line number or null if unknown:\n\n${code}`,
    });

    return Response.json(object);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Review failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
