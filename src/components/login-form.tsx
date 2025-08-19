
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
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface LoginFormProps {
  recruiterOnly?: boolean;
}

export default function LoginForm({ recruiterOnly = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Use the shared Supabase client
  const supabase = getSupabaseBrowserClient();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
             setError("Invalid email or password. Please try again.");
        } else {
            setError(signInError.message);
        }
        setLoading(false);
        return;
      }
      
      const user = data.user;
      if (!user) throw new Error("Login failed, user not found.");

      // Get user role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profileData) {
          setError("User data not found. Please contact support.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
      }
      
      const userRole = profileData.role;

      if (recruiterOnly && userRole !== 'recruiter') {
        setError("This login is for recruiters only.");
        await supabase.auth.signOut();
      } else if (!recruiterOnly && userRole === 'recruiter') {
        setError("This login is for candidates. Please use the recruiter login page.");
        await supabase.auth.signOut();
      } else {
        // Successful login
        if (userRole === 'recruiter') {
          router.push('/dashboard');
        } else {
          router.push('/start');
        }
        router.refresh();
      }
    } catch (error: any) {
        setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signupLink = recruiterOnly ? "/signup/recruiter" : "/signup/candidate";

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
            placeholder={recruiterOnly ? "recruiter@example.com" : "user@example.com"}
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
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href={signupLink} className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}
