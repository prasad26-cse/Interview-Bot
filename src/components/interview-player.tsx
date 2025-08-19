
"use client";

import type { InterviewData, Question, User } from "@/lib/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import LlmIntro from "./llm-intro";
import { Button } from "./ui/button";
import QuestionCard from "./question-card";
import VideoRec from "./video-rec";
import { ArrowRight, Loader2 } from "lucide-react";
import { transcribeInterviewResponse } from "@/ai/flows/transcribe-interview-response";
import { useToast } from "@/hooks/use-toast";
import { submitAndEvaluateInterview } from "@/lib/actions";

interface InterviewPlayerProps {
  interviewData: InterviewData;
}

interface Response {
  questionId: string;
  videoBlob: Blob;
  transcript: string;
  videoUrl: string;
  duration_sec: number;
}

export default function InterviewPlayer({ interviewData }: InterviewPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 is greeting, 1+ are questions
  const [responses, setResponses] = useState<Response[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect if no user is logged in
      router.push('/login/candidate');
    }
  }, [router]);

  const totalSteps = interviewData.questions.length + 1; // +1 for greeting
  const progress = (currentStep / totalSteps) * 100;

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleNextStep = () => {
    if (currentStep < interviewData.questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinishInterview();
    }
  };

  const handleVideoSubmit = async (blob: Blob, duration: number) => {
    setIsProcessing(true);
    toast({ title: "Processing Video...", description: "AI is transcribing your response. Please wait." });

    try {
      const dataUri = await blobToBase64(blob);
      const result = await transcribeInterviewResponse({ videoUrl: dataUri });

      const newResponse = {
        questionId: interviewData.questions[currentStep - 1].index.toString(),
        videoBlob: blob,
        transcript: result.transcript,
        videoUrl: URL.createObjectURL(blob), // Using blob URL for local display
        duration_sec: duration,
      };

      setResponses([...responses, newResponse]);
      toast({ title: "Success!", description: "Your response has been transcribed." });
      handleNextStep();

    } catch (error) {
      console.error("Transcription failed", error);
      toast({ variant: "destructive", title: "Transcription Failed", description: "Could not process your video. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleFinishInterview = async () => {
      if (!user) {
          toast({ variant: 'destructive', title: "Error", description: "You must be logged in to submit an interview."});
          return;
      }

      setIsProcessing(true);
      toast({ title: "Finalizing Interview...", description: "AI is now evaluating all your responses. This may take a moment." });
      
      try {
        await submitAndEvaluateInterview({
            interviewId: interviewData.id,
            role: interviewData.role,
            questions: interviewData.questions,
            responses: responses,
            candidate: user,
        });

        toast({ title: "Evaluation Complete!", description: "Redirecting you to the confirmation page." });
        router.push('/done');

      } catch (error) {
          console.error("Failed to submit and evaluate interview", error);
          toast({ variant: "destructive", title: "Submission Failed", description: "There was an error submitting your interview." });
      } finally {
          setIsProcessing(false);
      }
  };


  const currentQuestion: Question | null = currentStep > 0 ? interviewData.questions[currentStep - 1] : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
       {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <p className="text-lg font-semibold">AI is processing, please wait...</p>
          </div>
        </div>
      )}
      <div className="w-full max-w-4xl">
        <Progress value={progress} className="mb-8" />

        <div className="transition-all duration-500">
          {currentStep === 0 && (
            <LlmIntro
              greeting={interviewData.greeting}
              roleTitle={interviewData.role.title}
              onFinished={() => setCurrentStep(1)}
            />
          )}

          {currentQuestion && (
            <div>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="space-y-6 lg:w-1/2">
                  <QuestionCard
                    question={currentQuestion}
                    currentNum={currentStep}
                    totalNum={interviewData.questions.length}
                  />
                   <div className="p-4 bg-primary/10 dark:bg-primary/20 border border-dashed rounded-lg">
                      <h3 className="font-semibold mb-2 text-primary/80">Tips for a Great Answer</h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          <li>Take a moment to think before you speak.</li>
                          <li>Structure your answer (e.g., STAR method for behavioral questions).</li>
                          <li>Be concise and to the point.</li>
                          <li>Speak clearly into your microphone.</li>
                      </ul>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <VideoRec 
                    key={currentStep}
                    onSubmit={handleVideoSubmit} 
                    isProcessing={isProcessing}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
