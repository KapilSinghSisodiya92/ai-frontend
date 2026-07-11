/**
 * One-time script: embed all articles and write vectors into lib/search-data.ts.
 * Usage: npx tsx scripts/embed-dataset.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { OpenAI } from "openai";
import { articles } from "../lib/search-data";

// Load .env.local without extra dependencies
const envPath = join(__dirname, "../.env.local");
try {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
} catch {
  // .env.local optional if OPENAI_API_KEY is already in the environment
}

const openai = new OpenAI();

async function main() {
  const embedded = await Promise.all(
    articles.map(async (article) => {
      const text = `${article.title}. ${article.summary}`;
      const { data } = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      return { ...article, embedding: data[0].embedding };
    })
  );

  const source = readFileSync(
    join(__dirname, "../lib/search-data.ts"),
    "utf-8"
  );
  const header = source.slice(0, source.indexOf("export const articles"));
  const body = `export const articles: Article[] = ${JSON.stringify(embedded, null, 2)};\n`;

  writeFileSync(join(__dirname, "../lib/search-data.ts"), header + body);
  console.log(`Embedded ${embedded.length} articles into lib/search-data.ts`);
}

main().catch(console.error);
