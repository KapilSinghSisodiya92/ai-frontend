import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { PaletteSchema } from "@/lib/palette-schema";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description?.trim()) {
      return Response.json({ error: "Description is required" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: PaletteSchema,
      prompt: `Generate a complete Tailwind colour palette for: ${description}.
               Make each colour scale perceptually consistent from light to dark.
               Ensure sufficient contrast between 50/100 and 700/800/900 shades.
               Include a ready-to-paste tailwind.config extend.colors block in tailwindConfig.`,
    });

    return Response.json(object);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
