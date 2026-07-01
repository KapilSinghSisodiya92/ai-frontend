import { PaletteGenerator } from "@/components/PaletteGenerator";
import { DemoShell } from "@/components/DemoShell";

export default function PalettePage() {
  return (
    <DemoShell href="/palette" maxWidth="7xl">
      <PaletteGenerator />
    </DemoShell>
  );
}
