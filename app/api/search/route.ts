import { OpenAI } from "openai";
import { articles } from "@/lib/search-data";

const openai = new OpenAI();

function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const normA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const normB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (normA * normB);
}

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
