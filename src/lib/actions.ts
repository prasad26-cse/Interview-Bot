
"use server";
import { generateInterviewQuestions } from "@/ai/flows/generate-interview-questions";
import type { InterviewData, Role } from "@/lib/types";
import { createClient } from "./supabase/server";

export async function createInterview(
  roleSlug: string
): Promise<InterviewData | null> {
    
  const supabase = createClient();
  const { data: roleData, error: roleError } = await supabase
    .from('roles')
    .select('*')
    .eq('slug', roleSlug)
    .single();

  if (roleError || !roleData) {
    console.error("Error fetching role:", roleError);
    return null;
  }
  const role: Role = roleData;


  try {
    const interviewContent = await generateInterviewQuestions({
      role: role.title,
      description: role.description,
    });

    return {
      id: `interview_${role.id}_${Date.now()}`,
      role: role,
      greeting: interviewContent.greeting,
      questions: interviewContent.questions.sort((a, b) => a.index - b.index),
    };
  } catch (error) {
    console.error("Failed to generate interview questions:", error);
    // Return a fallback for demonstration purposes
    return {
      id: `interview_${role.id}_${Date.now()}`,
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
