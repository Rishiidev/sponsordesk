import { getCurrentUser } from "@/lib/auth/local";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding-flow";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return (
    <div className="mx-auto max-w-[640px] space-y-6 py-6">
      <OnboardingFlow />
    </div>
  );
}
