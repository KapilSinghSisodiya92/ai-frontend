import { ComponentBuilder } from "@/components/ComponentBuilder";
import { DemoShell } from "@/components/DemoShell";

export default function BuilderPage() {
  return (
    <DemoShell href="/builder" maxWidth="7xl">
      <ComponentBuilder />
    </DemoShell>
  );
}
