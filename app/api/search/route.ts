import { OpenAI } from "openai";
import { articles } from "@/lib/search-data";
import { cosineSimilarity } from "@/lib/cosine-similarity";

const openai = new OpenAI();

export async function POST(req: Request) {
  const { query } = await req.json();

  const { data } = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryVec = data[0].embedding;

  const scored = articles
    .filter((a) => a.embedding.length > 0)
    .map((a) => ({ ...a, score: cosineSimilarity(queryVec, a.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ embedding: _embedding, ...rest }) => rest);

  return Response.json(scored);
}
