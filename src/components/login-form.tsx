
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        if (recruiterOnly && userRole !== 'recruiter') {
          setError("This login is for recruiters only.");
          await auth.signOut();
        } else if (!recruiterOnly && userRole === 'recruiter') {
          setError("This login is for candidates. Please use the recruiter login page.");
          await auth.signOut();
        } else {
          // Successful login
          if (userRole === 'recruiter') {
            router.push('/dashboard');
          } else {
            router.push('/start');
          }
        }
      } else {
        setError("User data not found. Please contact support.");
        await auth.signOut();
      }
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            setError("Invalid email or password. Please try again.");
        } else {
            setError(error.message);
        }
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
