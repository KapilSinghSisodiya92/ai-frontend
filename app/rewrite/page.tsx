import { DemoShell } from "@/components/DemoShell";
import { RewriteDemoContent } from "@/components/RewriteDemoContent";
import { TextRewriter } from "@/components/TextRewriter";

export default function RewritePage() {
  return (
    <>
      <DemoShell href="/rewrite" maxWidth="2xl">
        <div className="mb-6 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-center">
          <p className="text-sm text-gray-400">
            Select any text below, then press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-xs">
              ⌘⇧R
            </kbd>{" "}
            <span className="text-gray-600">(Ctrl+Shift+R on Windows)</span>
          </p>
        </div>
        <RewriteDemoContent />
      </DemoShell>
      <TextRewriter />
    </>
  );
}
