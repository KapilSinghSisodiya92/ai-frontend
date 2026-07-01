import { JsonVisualizer } from "@/components/JsonVisualizer";
import { DemoShell } from "@/components/DemoShell";

export default function JsonPage() {
  return (
    <DemoShell href="/json" maxWidth="7xl">
      <JsonVisualizer />
    </DemoShell>
  );
}
