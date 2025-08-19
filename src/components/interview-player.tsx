
"use client";

import type { InterviewData, Question } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import LlmIntro from "./llm-intro";
import { Button } from "./ui/button";
import QuestionCard from "./question-card";
import VideoRec from "./video-rec";

interface InterviewPlayerProps {
  interviewData: InterviewData;
}

export default function InterviewPlayer({ interviewData }: InterviewPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 is greeting, 1+ are questions
  const [responses, setResponses] = useState<any[]>([]);
  const router = useRouter();

  const totalSteps = interviewData.questions.length + 1; // +1 for greeting
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finished last question
      // In a real app, you'd trigger evaluation here.
      router.push('/done');
    }
  };

  const handleVideoSubmit = (blob: Blob) => {
    console.log("Submitting video:", blob);
    // Here you would upload the blob and call the transcription flow
    const newResponse = {
      questionId: interviewData.questions[currentStep - 1].index,
      videoBlob: blob,
    };
    setResponses([...responses, newResponse]);
    handleNext();
  };

  const currentQuestion: Question | null = currentStep > 0 ? interviewData.questions[currentStep - 1] : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
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
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="space-y-6 lg:w-1/2">
                <QuestionCard
                  question={currentQuestion}
                  currentNum={currentStep}
                  totalNum={interviewData.questions.length}
                />
                 <div className="p-4 bg-accent/50 dark:bg-accent/20 border border-dashed rounded-lg">
                    <h3 className="font-semibold mb-2 text-foreground/80">Tips for a Great Answer</h3>
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
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
