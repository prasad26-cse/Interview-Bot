
"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { users } from "@/lib/data";

interface LoginFormProps {
  recruiterOnly?: boolean;
}

export default function LoginForm({ recruiterOnly = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const user = users.find(u => u.email === email);

    if (!user) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
    }

    if (recruiterOnly && user.role !== 'recruiter') {
      setError("This login is for recruiters only. Please use the candidate login page.");
    } else if (!recruiterOnly && user.role === 'recruiter') {
      setError("This login is for candidates. Please use the recruiter login page.");
    } else {
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/home');
      router.refresh();
    }
    
    setLoading(false);
  };

  const signupLink = recruiterOnly ? "/signup/recruiter" : "/signup/candidate";
  const loginPageLink = recruiterOnly ? "/" : "/login";
  const otherLoginLabel = recruiterOnly ? "Candidate" : "Recruiter";

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="grid gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder={recruiterOnly ? "recruiter@example.com" : "candidate@example.com"}
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
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Don't have an account?{" "}
            <Link href={signupLink} className="text-primary hover:underline">
              Create one
            </Link>
          </p>
          <p>
             Are you a {otherLoginLabel}?{" "}
             <Link href={loginPageLink} className="text-primary hover:underline">
                Login here
            </Link>
          </p>
        </div>
      </CardFooter>
    </form>
  );
}
