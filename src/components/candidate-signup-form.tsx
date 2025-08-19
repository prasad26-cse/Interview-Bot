
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
import { supabase } from "@/lib/supabase/client";

export default function CandidateSignupForm() {
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
        
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });
        
        if (signUpError) {
            if (signUpError.message.includes('User already registered')) {
                setError('This email is already in use. Please use a different email.');
            } else if (signUpError.message.includes('Password should be at least 6 characters')) {
                 setError('The password is too weak. Please use a stronger password (at least 6 characters).');
            } else {
                setError(signUpError.message);
            }
            setLoading(false);
            return;
        }

        if (data.user) {
             const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                full_name: name,
                email: email,
                role: 'candidate'
             });

            if (profileError) {
                setError(profileError.message);
                // Clean up user if profile creation fails
                await supabase.auth.signOut();
                // Potentially delete the user from auth as well for full cleanup
            } else {
                 router.push('/start');
                 router.refresh();
            }
        }
       
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
                placeholder="Jane Doe" 
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
                placeholder="candidate@example.com" 
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
            {loading ? "Creating Account..." : "Create Account & Login"}
          </Button>
           <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/" className="text-primary hover:underline">
                Login
            </Link>
            </p>
        </CardFooter>
    </form>
  );
}
