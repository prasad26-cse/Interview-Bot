"use client";

import type { FullInterview } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SkillRadar from "./skill-radar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Download, Copy } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface ReportViewProps {
  interview: FullInterview;
}

export default function ReportView({ interview }: ReportViewProps) {
  const { candidate, role, evaluation, responses } = interview;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{candidate.name}'s Report</h1>
          <p className="text-muted-foreground">Interview for {role.title}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><Copy className="mr-2 h-4 w-4"/> Copy Summary</Button>
            <Button><Download className="mr-2 h-4 w-4"/> Export PDF</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{candidate.name}</CardTitle>
                <CardDescription>{candidate.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center bg-primary/10 dark:bg-primary/20 rounded-lg p-4">
                <p className="text-sm text-primary font-semibold">Overall Score</p>
                <p className="text-5xl font-bold text-primary">{evaluation.overallScore}<span className="text-3xl text-primary/80">/5</span></p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Evaluation Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{evaluation.summary}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <SkillRadar skills={evaluation.skills} />
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Strengths</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {evaluation.strengths.map(s => <Badge key={s} variant="secondary" className="text-base">{s}</Badge>)}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Weaknesses</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {evaluation.weaknesses.map(w => <Badge key={w} variant="destructive" className="text-base">{w}</Badge>)}
            </CardContent>
          </Card>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Responses & Transcripts</CardTitle>
                    <CardDescription>Review each question, video response, and transcript.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue={responses[0].questionId}>
                        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
                            {responses.map((r, i) => (
                                <TabsTrigger key={r.questionId} value={r.questionId}>Q{i+1}</TabsTrigger>
                            ))}
                        </TabsList>
                        {responses.map((response, index) => (
                            <TabsContent key={response.questionId} value={response.questionId} className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Question {index + 1}</CardTitle>
                                        <CardDescription>{response.questionPrompt}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <div>
                                            <video
                                                src={response.videoUrl}
                                                controls
                                                className="w-full rounded-lg"
                                            ></video>
                                        </div>
                                        <ScrollArea className="h-72 p-4 border rounded-lg bg-background">
                                            <h3 className="font-semibold mb-2">Transcript</h3>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{response.transcript}</p>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
