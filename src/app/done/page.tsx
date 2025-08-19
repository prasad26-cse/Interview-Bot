import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DonePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900/50">
      <Card className="w-full max-w-lg mx-4 text-center shadow-2xl">
        <CardHeader className="items-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl">Interview Submitted!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Thank you for completing the interview.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We appreciate you taking the time to share your experience with us. Our team will review your responses carefully.
          </p>
          <p className="font-semibold">
            We will be in touch with the next steps shortly.
          </p>
          <div className="pt-4">
            <Button asChild>
              <Link href="/start">Start New Interview</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
