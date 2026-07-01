import { DemoShell } from "@/components/DemoShell";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <DemoShell href="/chat" maxWidth="lg">
      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 text-center space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <MessageCircle className="w-8 h-8 text-rose-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            The widget is already live
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            This demo is mounted in{" "}
            <code className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-xs">
              app/layout.tsx
            </code>{" "}
            — so it appears on every page, not just this one. Look for the blue
            chat button in the bottom-right corner.
          </p>
        </div>

        <div className="text-left space-y-3 text-xs text-gray-500 bg-gray-950 rounded-xl p-4 border border-gray-800">
          <p className="font-medium text-gray-400">Try asking:</p>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>What demos are available?</li>
            <li>How does the semantic search work?</li>
            <li>What stack does this project use?</li>
          </ul>
        </div>
      </div>
    </DemoShell>
  );
}
