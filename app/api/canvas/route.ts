import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: modelMessages,
      system: `You are a specialized UI component generator. You must ONLY output a valid JSON object matching the schema below. Do not wrap your response in markdown code blocks (\`\`\`). Do not say anything else.

      JSON Schema Format:
      {
        "layoutTitle": "String name of the form or layout",
        "components": [
          {
            "type": "heading" | "input" | "button" | "card",
            "label": "Text to display inside the component",
            "color": "blue" | "green" | "red" | "indigo"
          }
        ]
      }`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error in canvas API route:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
