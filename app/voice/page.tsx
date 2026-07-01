import { VoiceToTailwind } from "@/components/VoiceToTailwind";
import { DemoShell } from "@/components/DemoShell";

export default function VoicePage() {
  return (
    <DemoShell href="/voice" maxWidth="7xl">
      <VoiceToTailwind />
    </DemoShell>
  );
}
