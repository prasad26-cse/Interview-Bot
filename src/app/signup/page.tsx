
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const router = useRouter();

    const handleSignup = (e: FormEvent) => {
        e.preventDefault();
        // In a real app, you would:
        // 1. Call a server action to create the user in the database.
        // 2. Handle potential errors (e.g., email already exists).
        // 3. Log the user in and redirect.
        console.log('New user created (simulation):', { name, email });
        // For this demo, we'll just redirect to the dashboard to simulate auto-login.
        router.push('/dashboard');
    };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900/50">
      <Card className="w-full max-w-sm mx-4 shadow-2xl">
        <form onSubmit={handleSignup}>
            <CardHeader className="space-y-1 text-center">
                <div className="inline-block mx-auto bg-primary/10 p-3 rounded-full">
                    <UserPlus className="w-8 h-8 text-primary" />
                </div>
              <CardTitle className="text-2xl">Create Recruiter Account</CardTitle>
              <CardDescription>
                Sign up to start managing your interviews
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                    id="name" 
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="recruiter@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">Create Account</Button>
               <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                    Login
                </Link>
                </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
