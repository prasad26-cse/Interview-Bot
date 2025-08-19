
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import LoginForm from "@/components/login-form";
import ClientOnly from "@/components/client-only";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900/50">
      <Card className="w-full max-w-sm mx-4 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
              <div className="inline-block mx-auto bg-primary/10 p-3 rounded-full">
                  <Briefcase className="w-8 h-8 text-primary" />
              </div>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <ClientOnly>
            <LoginForm />
          </ClientOnly>
      </Card>
    </div>
  );
}

