
"use server";
import { generateInterviewQuestions } from "@/ai/flows/generate-interview-questions";
import { evaluateCandidateResponses, type EvaluateCandidateResponsesInput } from "@/ai/flows/evaluate-candidate-responses";
import type { InterviewData, Role, FullInterview, User, Response, Question } from "@/lib/types";
import { roles, interviews } from "./data";

// DEV NOTE: To connect a real database, a developer would:
// 1. Set the DATABASE_URL in the .env file.
// 2. Run `npx prisma db push` to sync the schema with the database.
// 3. Replace the mock data imports and logic below with Prisma client queries.
// Example: import prisma from './db';

export async function createInterview(
  roleSlug: string
): Promise<InterviewData | null> {
    
  // DEV NOTE: Replace this mock data fetch with a Prisma query.
  // Example: const role = await prisma.role.findUnique({ where: { slug: roleSlug } });
  const role = roles.find(r => r.slug === roleSlug);

  if (!role) {
    console.error("Role not found:", roleSlug);
    return null;
  }
  
  try {
    const interviewContent = await generateInterviewQuestions({
      role: role.title,
      description: role.description,
    });

    // Added Math.random() to ensure unique IDs even if created at the same millisecond
    const uniqueId = `interview_${role.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return {
      id: uniqueId,
      role: role,
      greeting: interviewContent.greeting,
      questions: interviewContent.questions.sort((a, b) => a.index - b.index),
    };
  } catch (error) {
    console.error("Failed to generate interview questions:", error);
    // Return a fallback for demonstration purposes
    const uniqueId = `interview_${role.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      id: uniqueId,
      role: role,
      greeting: `Welcome to your interview for the ${role.title} position! We're excited to learn more about you. Please take your time to provide thoughtful answers to the following questions.`,
      questions: [
        { index: 1, prompt: "Tell us about yourself and why you're interested in this role.", category: 'behavioral', difficulty: 1},
        { index: 2, prompt: "What is a recent technical challenge you faced and how did you solve it?", category: 'tech', difficulty: 2},
        { index: 3, prompt: "Describe a time you had a disagreement with a team member. How did you handle it?", category: 'behavioral', difficulty: 3},
        { index: 4, prompt: "How would you design a system for a simple URL shortener service?", category: 'system', difficulty: 4},
        { index: 5, prompt: "What are your thoughts on our company culture and how do you see yourself fitting in?", category: 'culture', difficulty: 3},
      ],
    };
  }
}

interface SubmitInterviewInput {
  interviewId: string;
  role: Role;
  questions: Question[];
  responses: {
    questionId: string;
    transcript: string;
    videoUrl: string; // This would be a real URL after upload
    duration_sec: number;
  }[];
  candidate: User;
}

export async function submitAndEvaluateInterview(input: SubmitInterviewInput): Promise<string> {
    const { role, questions, responses, candidate } = input;

    const evaluationInput: EvaluateCandidateResponsesInput = {
        role: role.title,
        description: role.description,
        questions: questions,
        responses: responses.map(r => ({
            question_id: r.questionId,
            video_url: r.videoUrl, // Passing placeholder URL
            duration_sec: r.duration_sec,
            transcript: r.transcript,
        })),
    };

    try {
        const evaluationResult = await evaluateCandidateResponses(evaluationInput);

        const newInterview: FullInterview = {
            id: input.interviewId,
            roleId: role.id,
            role: role,
            candidate: candidate,
            status: 'scored',
            createdAt: new Date().toISOString(),
            submittedAt: new Date().toISOString(),
            evaluation: {
                overallScore: evaluationResult.evaluation.overall_score,
                summary: evaluationResult.evaluation.summary,
                strengths: evaluationResult.evaluation.strengths,
                weaknesses: evaluationResult.evaluation.weaknesses,
                skills: evaluationResult.evaluation.skills,
            },
            responses: responses.map((r) => ({
                questionId: r.questionId,
                questionPrompt: questions.find(q => q.index.toString() === r.questionId)?.prompt || "Unknown Question",
                videoUrl: r.videoUrl,
                transcript: r.transcript,
            })),
        };
        
        // DEV NOTE: Replace this mock data push with a Prisma query.
        // Example: const savedInterview = await prisma.interview.create({ data: ... });
        interviews.unshift(newInterview);
        
        return newInterview.id;

    } catch (error) {
        console.error("Error during interview evaluation:", error);
        // Fallback for demo: save without evaluation
        const newInterview: FullInterview = {
            id: input.interviewId,
            roleId: role.id,
            role: role,
            candidate: candidate,
            status: 'submitted', // Mark as submitted but not scored
            createdAt: new Date().toISOString(),
            submittedAt: new Date().toISOString(),
            evaluation: null,
            responses: responses.map((r) => ({
                questionId: r.questionId,
                questionPrompt: questions.find(q => q.index.toString() === r.questionId)?.prompt || "Unknown Question",
                videoUrl: r.videoUrl,
                transcript: r.transcript,
            })),
        };

        // DEV NOTE: Replace this mock data push with a Prisma query.
        interviews.unshift(newInterview);
        return newInterview.id;
    }
}
