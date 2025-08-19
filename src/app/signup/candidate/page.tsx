
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import ClientOnly from "@/components/client-only";
import CandidateSignupForm from "@/components/candidate-signup-form";

export default function CandidateSignupPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900/50">
      <Card className="w-full max-w-sm mx-4 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
              <div className="inline-block mx-auto bg-primary/10 p-3 rounded-full">
                  <UserPlus className="w-8 h-8 text-primary" />
              </div>
            <CardTitle className="text-2xl">Create Candidate Account</CardTitle>
            <CardDescription>
              Sign up to start your interview
            </CardDescription>
          </CardHeader>
          <ClientOnly>
            <CandidateSignupForm />
          </ClientOnly>
      </Card>
    </div>
  );
}
