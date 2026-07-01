"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useMemo, useState } from "react";
import { Globe, Loader2, Send } from "lucide-react";

type PageIndex = {
  chunks: string[];
  embeddings: number[][];
  chunkCount: number;
};

export function AskPageRAG() {
  const [url, setUrl] = useState("https://nextjs.org/docs");
  const [index, setIndex] = useState<PageIndex | null>(null);
  const [ingesting, setIngesting] = useState(false);
  const [ingestError, setIngestError] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/ask" }),
    []
  );

  const { messages, sendMessage, status, setMessages } = useChat<UIMessage>({
    transport,
  });

  const isAsking = status === "submitted" || status === "streaming";

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIngesting(true);
    setIngestError(null);
    setIndex(null);
    setMessages([]);

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ingest failed");
      setIndex(data);
    } catch (err) {
      setIngestError(err instanceof Error ? err.message : "Ingest failed");
    } finally {
      setIngesting(false);
    }
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !index || isAsking) return;
    sendMessage(
      { text: input },
      { body: { chunks: index.chunks, embeddings: index.embeddings } }
    );
    setInput("");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleIngest} className="flex gap-2">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition"
            required
          />
        </div>
        <button
          type="submit"
          disabled={ingesting}
          className="shrink-0 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
        >
          {ingesting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Ingest"
          )}
        </button>
      </form>

      {ingestError && (
        <p className="text-sm text-rose-400">{ingestError}</p>
      )}

      {index && (
        <p className="text-xs text-emerald-400">
          Indexed {index.chunkCount} chunks — ask a question below
        </p>
      )}

      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col min-h-[320px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
          {messages.length === 0 && (
            <p className="text-sm text-gray-600 text-center py-8">
              {index
                ? "Ask anything about the page content"
                : "Ingest a URL to get started"}
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-gray-800 text-gray-200 rounded-bl-md"
                }`}
              >
                {message.parts
                  .filter((part) => part.type === "text")
                  .map((part, i) => (
                    <span key={i}>{part.text}</span>
                  ))}
              </div>
            </div>
          ))}
          {isAsking && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleAsk}
          className="flex items-center gap-2 p-3 border-t border-gray-800"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              index ? "What does this page say about…?" : "Ingest a URL first"
            }
            disabled={!index || isAsking}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!index || isAsking || !input.trim()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
