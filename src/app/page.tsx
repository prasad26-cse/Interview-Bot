
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import LoginForm from "@/components/login-form";
import ClientOnly from "@/components/client-only";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-gray-50 dark:bg-gray-900/50 p-4">
      <Card className="w-full max-w-sm mx-auto shadow-2xl">
          <CardHeader className="space-y-1 text-center">
              <div className="inline-block mx-auto bg-primary/10 p-3 rounded-full">
                  <User className="w-8 h-8 text-primary" />
              </div>
            <CardTitle className="text-2xl">Candidate Login</CardTitle>
            <CardDescription>
              Enter your credentials to start your interview
            </CardDescription>
          </CardHeader>
          <ClientOnly>
            <LoginForm />
          </ClientOnly>
      </Card>
    </div>
  );
}
