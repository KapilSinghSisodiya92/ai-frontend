import { AltTextGenerator } from "@/components/AltTextGenerator";
import { DemoShell } from "@/components/DemoShell";

export default function AltTextPage() {
  return (
    <DemoShell href="/alt-text" maxWidth="2xl">
      <AltTextGenerator />
    </DemoShell>
  );
}
