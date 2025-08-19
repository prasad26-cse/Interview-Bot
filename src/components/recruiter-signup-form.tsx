
"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle } from "lucide-react";
import { users, type User } from "@/lib/data";


export default function RecruiterSignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            setError("An account with this email already exists. Please login.");
            setLoading(false);
            return;
        }

        const newUser: User = {
            id: `user_${Date.now()}`,
            name,
            email,
            role: 'recruiter',
            avatarUrl: `https://i.pravatar.cc/150?u=${email}`
        };
        
        users.push(newUser);
        
        localStorage.setItem('user', JSON.stringify(newUser));

        router.push('/dashboard');
        router.refresh();
       
        setLoading(false);
    };

  return (
    <form onSubmit={handleSignup}>
        <CardContent className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Signup Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
           <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
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
                disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
                id="password" 
                type="password"
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
           <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
                Login
            </Link>
            </p>
        </CardFooter>
    </form>
  );
}
