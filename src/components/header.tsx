
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Bot, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error)
    } finally {
        setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };
  
  const isLoggedIn = !!user;

  if (loading) {
    return (
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href={isLoggedIn ? "/home" : "/"} className="mr-6 flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            VidHire
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isLoggedIn ? (
            <>
              {user.role === 'candidate' && (
                <Button asChild>
                  <Link href="/start">Start Interview</Link>
                </Button>
              )}
               {user.role === 'recruiter' && (
                <Button asChild variant="outline">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
               )}
              <Button onClick={handleLogout} variant="ghost" size="icon">
                <LogOut />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          ) : (
            <>
               <Button asChild disabled>
                <Link href="/start">Start Interview</Link>
               </Button>
               <Button asChild>
                <Link href="/login">Recruiter Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
