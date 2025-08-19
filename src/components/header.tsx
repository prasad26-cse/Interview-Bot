
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Bot, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage on the client side
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href={isLoggedIn ? "/home" : "/login"} className="mr-6 flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            VidHire
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isLoggedIn ? (
            <>
              <Button asChild>
                <Link href="/start">Start Interview</Link>
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button disabled>
                Start Interview
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
