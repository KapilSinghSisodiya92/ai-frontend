import "pdf-parse/worker";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { PDFParse } from "pdf-parse";
import { CandidateSchema } from "@/lib/candidate-schema";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");
    const jobDesc = formData.get("jobDescription");

    if (!(file instanceof File)) {
      return Response.json({ error: "Resume PDF is required" }, { status: 400 });
    }

    if (!jobDesc || typeof jobDesc !== "string" || !jobDesc.trim()) {
      return Response.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const { text } = await parser.getText();

    if (!text?.trim()) {
      return Response.json(
        { error: "Could not extract text from PDF" },
        { status: 400 }
      );
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: CandidateSchema,
      prompt: `Extract structured candidate data from this resume and evaluate fit for the job.
               Include a fitScore from 1-10 based on how well the candidate matches the job description.
               Embed brief fit reasoning in the summary (max 200 chars).
               Use null for salary if not mentioned.

               Resume text:
               ${text}

               Job description:
               ${jobDesc}`,
    });

    return Response.json(object);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Screening failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
