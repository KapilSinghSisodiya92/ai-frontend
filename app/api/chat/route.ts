import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

export const maxDuration = 30;

const PRODUCT_CONTEXT = `
AI Frontend Playground is a free, open-source tutorial project for learning AI features in Next.js.

Available demos:
- Semantic Search (/search) — AI-powered search by meaning using embeddings
- Streaming Autocomplete (/complete) — ghost-text suggestions with Tab to accept
- AI Form Validation (/validate) — Zod syntax checks plus AI semantic validation
- AI Alt-Text Generator (/alt-text) — WCAG-compliant alt text from image uploads via vision
- AI Text Rewriter (/rewrite) — Cmd+Shift+R to rewrite selected text with AI
- AI Code Reviewer (/review) — structured code review with severity, issues, and refactored code
- Ask This Page (/ask) — RAG over any URL: ingest, embed chunks, ask questions
- AI Landing Page Generator (/generate-page) — describe a product, stream JSX landing page with live preview
- AI Canvas Architect (/canvas) — describe a UI in plain English and see it render live

Stack: Next.js 15, TypeScript, Tailwind CSS, Vercel AI SDK v6, OpenAI.
Requires OPENAI_API_KEY in .env.local. There is no paid pricing — it is a learning repo.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: modelMessages,
      system: `You are a helpful assistant for AI Frontend Playground.
Answer questions about our product features and how to use the demos.
If you don't know something, say so clearly.
Keep answers concise — 2-3 sentences maximum.
Do NOT make up features that don't exist.

${PRODUCT_CONTEXT}`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error in chat API route:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
