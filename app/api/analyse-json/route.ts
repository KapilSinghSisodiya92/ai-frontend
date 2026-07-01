import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { JSONAnalysisSchema } from "@/lib/json-schema";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { json } = await req.json();

    if (!json?.trim()) {
      return Response.json({ error: "JSON is required" }, { status: 400 });
    }

    try {
      JSON.parse(json);
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: JSONAnalysisSchema,
      prompt: `Analyse this JSON API response and explain every field.
               Use dot-notation paths (e.g. user.address.zip).
               Infer semanticType from field names and example values.
               Generate a complete TypeScript interface with correct optional fields, nested types, and array types.
               JSON:
               ${json}`,
    });

    return Response.json(object);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
