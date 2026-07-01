import { OpenAI } from "openai";

export const maxDuration = 60;

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const html = await fetch(url).then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch: ${r.status}`);
      return r.text();
    });

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!text) {
      return Response.json({ error: "No text content found" }, { status: 400 });
    }

    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += 450) {
      chunks.push(text.slice(i, i + 500));
    }

    const embeddings = await Promise.all(
      chunks.map((chunk) =>
        openai.embeddings
          .create({ model: "text-embedding-3-small", input: chunk })
          .then((r) => r.data[0].embedding)
      )
    );

    return Response.json({ chunks, embeddings, chunkCount: chunks.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Ingest failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
