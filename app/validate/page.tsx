import { ValidationForm } from "@/components/ValidationForm";
import { DemoShell } from "@/components/DemoShell";

export default function ValidatePage() {
  return (
    <DemoShell href="/validate" maxWidth="xl">
      <ValidationForm />
    </DemoShell>
  );
}
