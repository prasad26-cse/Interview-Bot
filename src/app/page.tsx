
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Cpu, FileText, Bot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'Role-Aware Greeting',
    description: 'AI generates a warm, role-specific greeting from the role title and description.',
  },
  {
    icon: <Cpu className="h-10 w-10 text-primary" />,
    title: 'Dynamic Questions',
    description: 'Generates 5-7 questions tailored to the role, covering behavioral and technical aspects.',
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: 'AI Evaluation',
    description: 'AI evaluates responses, summarizes strengths/weaknesses, and rates skills.',
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Recruiter Console',
    description: 'A dedicated area to view candidate profiles, watch videos, and read transcripts.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48 bg-gray-50 dark:bg-gray-900/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    <span className="bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">
                      VidHire
                    </span>
                    : Your AI-Powered Video Interviewer
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Streamline your hiring process with our intelligent video interview bot. Save time, reduce bias, and identify top candidates faster.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/start">Start Interview</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/login">Recruiter Login</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="AI Interviewer Bot"
                data-ai-hint="interview robot"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                priority
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How VidHire Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform leverages cutting-edge AI to provide a seamless and effective interview experience for both candidates and recruiters.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pt-12">
              {features.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <footer className="flex items-center justify-center w-full h-24 border-t">
          <p className="text-muted-foreground">© 2024 VidHire. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
