"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Bot, ArrowRight } from "lucide-react";

interface LlmIntroProps {
  greeting: string;
  roleTitle: string;
  onFinished: () => void;
}

export default function LlmIntro({ greeting, roleTitle, onFinished }: LlmIntroProps) {
  const [displayedGreeting, setDisplayedGreeting] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (displayedGreeting.length < greeting.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedGreeting(greeting.slice(0, displayedGreeting.length + 1));
      }, 50);
      return () => clearTimeout(timeoutId);
    } else {
      setIsTyping(false);
    }
  }, [greeting, displayedGreeting]);

  return (
    <Card className="max-w-3xl mx-auto text-center shadow-xl animate-in fade-in duration-500">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <Bot className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-3xl">Welcome to your interview for the</CardTitle>
        <CardDescription className="text-2xl font-semibold text-primary pt-1">
            {roleTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-muted-foreground min-h-[100px]">
          {displayedGreeting}
          <span className="inline-block w-1 h-6 bg-primary ml-1 animate-caret-blink" />
        </p>
        <Button onClick={onFinished} disabled={isTyping} className="mt-8" size="lg">
          Start First Question <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
