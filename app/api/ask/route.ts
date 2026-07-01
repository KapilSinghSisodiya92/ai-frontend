import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { OpenAI } from "openai";
import { cosineSimilarity } from "@/lib/cosine-similarity";

export const maxDuration = 30;

const embeddingClient = new OpenAI();

export async function POST(req: Request) {
  try {
    const { messages, chunks, embeddings } = await req.json();

    if (!chunks?.length || !embeddings?.length) {
      return Response.json({ error: "Page not ingested yet" }, { status: 400 });
    }

    const lastMessage = messages?.[messages.length - 1];
    const question =
      lastMessage?.parts
        ?.filter((p: { type: string }) => p.type === "text")
        .map((p: { text: string }) => p.text)
        .join("") ?? "";

    if (!question.trim()) {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    const { data } = await embeddingClient.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const queryEmb = data[0].embedding;

    const scored = embeddings
      .map((emb: number[], i: number) => ({
        i,
        score: cosineSimilarity(queryEmb, emb),
      }))
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 2);

    const context = scored
      .map((s: { i: number }) => chunks[s.i])
      .join("\n\n");

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system:
        "Answer using ONLY the context below. Quote the relevant passage when possible. If the context does not contain the answer, say you cannot find it.",
      prompt: `Context:\n${context}\n\nQuestion: ${question}`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Ask failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
