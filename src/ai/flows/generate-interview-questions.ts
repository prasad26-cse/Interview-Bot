
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating dynamic, role-relevant interview questions and a greeting.
 *
 * It includes:
 * - generateInterviewQuestions - A function to generate interview questions based on role information.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GeneratedInterviewQuestionsOutput - The output type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  role: z.string().describe('The job role for which questions are being generated.'),
  description: z.string().describe('A description of the role.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const GeneratedInterviewQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      index: z.number().describe('The index of the question.'),
      prompt: z.string().describe('The interview question prompt.'),
      category: z.enum(['tech', 'behavioral', 'system', 'culture']).describe('The category of the question.'),
      difficulty: z.number().min(1).max(5).describe('The difficulty level of the question (1-5).'),
    })
  ).describe('An array of generated interview questions.'),
  greeting: z.string().describe('A role-specific greeting for the candidate.'),
});
export type GeneratedInterviewQuestionsOutput = z.infer<typeof GeneratedInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GeneratedInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const interviewGeneratorPrompt = ai.definePrompt({
  name: 'interviewGeneratorPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GeneratedInterviewQuestionsOutputSchema},
  prompt: `You are a friendly but professional technical interviewer. Given a ROLE and DESCRIPTION, produce:
1. A warm, 2-3 sentence greeting that sets expectations and encourages thoughtful answers.
2. 5-7 interview questions mixing behavioral and technical, ordered easy to hard.

For each question, provide: {index, prompt, category, difficulty(1-5)}. Keep prompts concise and unambiguous.

ROLE: {{{role}}}
DESCRIPTION: {{{description}}}`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GeneratedInterviewQuestionsOutputSchema,
  },
  async input => {
    const { output } = await interviewGeneratorPrompt(input);
    return output!;
  }
);
