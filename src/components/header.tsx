import Link from "next/link";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/home" className="mr-6 flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            VidHire
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild>
            <Link href="/start">Start Interview</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Recruiter Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
