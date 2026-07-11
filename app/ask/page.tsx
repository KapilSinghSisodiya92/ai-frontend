import { AskPageRAG } from "@/components/AskPageRAG";
import { DemoShell } from "@/components/DemoShell";

export default function AskPage() {
  return (
    <DemoShell href="/ask">
      <AskPageRAG />
    </DemoShell>
  );
}
