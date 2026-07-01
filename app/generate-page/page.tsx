import { LandingPageGenerator } from "@/components/LandingPageGenerator";
import { DemoShell } from "@/components/DemoShell";

export default function GeneratePagePage() {
  return (
    <DemoShell href="/generate-page" maxWidth="7xl">
      <LandingPageGenerator />
    </DemoShell>
  );
}
