import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { ComponentSchema } from "@/lib/component-schema";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { description, componentType } = await req.json();

    if (!description?.trim()) {
      return Response.json({ error: "Description is required" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: ComponentSchema,
      prompt: `Generate a React + Tailwind ${componentType} component.
               Output JSX only in the jsx field — no imports or exports.
               Use className for Tailwind classes.
               Description: ${description}`,
    });

    return Response.json(object);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
