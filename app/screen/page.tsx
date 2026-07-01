import { ResumeScreener } from "@/components/ResumeScreener";
import { DemoShell } from "@/components/DemoShell";

export default function ScreenPage() {
  return (
    <DemoShell href="/screen" maxWidth="7xl">
      <ResumeScreener />
    </DemoShell>
  );
}
