import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { AltTextSchema } from "@/lib/alt-text-schema";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { imageBase64, mimeType } = await req.json();

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: AltTextSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: imageBase64,
            mediaType: mimeType,
          },
          {
            type: "text",
            text: "Generate WCAG 2.1 compliant alt text for this image. If the image is purely decorative, set isDecorative to true and altText to an empty string.",
          },
        ],
      },
    ],
  });

  return Response.json(object);
}
