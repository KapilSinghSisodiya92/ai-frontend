import { CodeReviewer } from "@/components/CodeReviewer";
import { DemoShell } from "@/components/DemoShell";

export default function ReviewPage() {
  return (
    <DemoShell href="/review" maxWidth="7xl">
      <CodeReviewer />
    </DemoShell>
  );
}
