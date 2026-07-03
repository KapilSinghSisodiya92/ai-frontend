import { SocialRewriter } from "@/components/SocialRewriter";
import { DemoShell } from "@/components/DemoShell";

export default function SocialPage() {
  return (
    <DemoShell href="/social" maxWidth="7xl">
      <SocialRewriter />
    </DemoShell>
  );
}
