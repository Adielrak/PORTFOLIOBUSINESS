import { AuthGuard } from "@/components/AuthGuard";
import { MultiStepForm } from "@/components/MultiStepForm";

export const metadata = { title: "Generate Portfolio — folio.ai" };

export default function GeneratePage() {
  return (
    <AuthGuard>
      <MultiStepForm />
    </AuthGuard>
  );
}
