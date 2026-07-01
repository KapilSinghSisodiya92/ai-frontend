'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function CanvasPage() {
  const [input, setInput] = useState('');
  const [parsedLayout, setParsedLayout] = useState<{ layoutTitle: string; components: { type: string; label: string; color: string }[] } | null>(null);

  const { sendMessage, status } = useChat({
    onFinish: (message) => {
      try {
        const cleanText = message?.message?.parts
          .filter((p) => p.type === 'text')
          .map((p: { text: string }) => p.text)
          .join('');
          
        const data = JSON.parse(cleanText);
        setParsedLayout(data);
      } catch (e) {
        console.error("Failed parsing completed JSON block:", e);
      }
    }
  });

  const isGenerating = status === 'submitted' || status === 'streaming';

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    sendMessage({ text: input });
    setInput('');
  };

  const getColorClass = (color: string) => {
    const maps: Record<string, string> = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      green: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      red: 'bg-rose-600 hover:bg-rose-700 text-white',
      indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    };
    return maps[color] || 'bg-gray-600 text-white';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="shrink-0 border-b border-gray-800 px-6 py-3 flex items-center justify-between bg-gray-950/80 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All demos
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold tracking-tight">AI Canvas Architect</span>
        </div>
        <div className="w-20" />
      </header>

      <main className="flex flex-1 min-h-0">
        <section className="w-1/3 border-r border-gray-800 flex flex-col p-6 justify-between bg-gray-950">
          <div className="space-y-6">
            <p className="text-sm text-gray-400 leading-relaxed">
              Type out the interface components you want. The AI will directly output JSON configurations, and our frontend will map them instantly.
            </p>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 space-y-2">
              <span className="text-xs font-semibold uppercase text-amber-400 block tracking-wider">Try prompting:</span>
              <p className="text-xs text-gray-300 italic">A signup card with an email field, password field, and an indigo button</p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3">
            <textarea
              className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition shadow-inner resize-none h-28 text-white"
              value={input}
              placeholder="Describe your design layout..."
              onChange={(e) => setInput(e.target.value)}
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={isGenerating || !input.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition shadow-md"
            >
              {isGenerating ? 'Generating Schema...' : 'Architect Interface'}
            </button>
          </form>
        </section>

        <section className="w-2/3 flex flex-col bg-gray-900">
          <header className="border-b border-gray-800 px-8 py-4 flex items-center gap-2 bg-gray-950/40">
            <span className="text-sm font-medium text-gray-400">Live Component Preview Canvas</span>
          </header>

          <div className="flex-1 p-12 flex items-center justify-center">
            {parsedLayout ? (
              <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 transition-all duration-300">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-3 mb-5 flex items-center gap-2">
                  {parsedLayout.layoutTitle}
                </h2>
                
                <div className="space-y-4">
                  {parsedLayout.components?.map((comp: { type: string; label: string; color: string }, i: number) => {
                    if (comp.type === 'heading') {
                      return <h3 key={i} className="text-xl font-semibold text-gray-900 mt-2">{comp.label}</h3>;
                    }
                    if (comp.type === 'input') {
                      return (
                        <div key={i} className="space-y-1">
                          <label className="text-xs font-medium text-gray-500">{comp.label}</label>
                          <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 text-black" placeholder={`Enter your ${comp.label.toLowerCase()}...`} disabled />
                        </div>
                      );
                    }
                    if (comp.type === 'button') {
                      return (
                        <button key={i} className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors shadow-sm ${getColorClass(comp.color)}`}>
                          {comp.label}
                        </button>
                      );
                    }
                    if (comp.type === 'card') {
                      return <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600">{comp.label}</div>;
                    }
                    return null;
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 space-y-2">
                <p className="text-sm">Canvas is empty</p>
                <p className="text-xs text-gray-600">Submit a prompt on the left sidebar to generate real visual data structures</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
