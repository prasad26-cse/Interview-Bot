'use server';

/**
 * @fileOverview AI flow to evaluate candidate responses and provide summaries and skill ratings.
 *
 * - evaluateCandidateResponses - A function that handles the evaluation process.
 * - EvaluateCandidateResponsesInput - The input type for the evaluateCandidateResponses function.
 * - EvaluateCandidateResponsesOutput - The return type for the evaluateCandidateResponses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateCandidateResponsesInputSchema = z.object({
  role: z.string().describe('The role for which the candidate is being interviewed.'),
  description: z.string().describe('The description of the role.'),
  questions: z.array(z.object({
    index: z.number(),
    prompt: z.string(),
    category: z.enum(['tech', 'behavioral', 'system', 'culture']),
    difficulty: z.number(),
  })).describe('The questions asked during the interview.'),
  responses: z.array(z.object({
    question_id: z.string(),
    video_url: z.string(),
    duration_sec: z.number(),
    transcript: z.string(),
  })).describe('The candidate responses to the interview questions.'),
});
export type EvaluateCandidateResponsesInput = z.infer<typeof EvaluateCandidateResponsesInputSchema>;

const EvaluationOutputSchema = z.object({
  overall_score: z.number().min(1).max(5).describe('Overall score for the candidate (1-5).'),
  summary: z.string().describe('A summary of the candidate performance.'),
  strengths: z.array(z.string()).describe('List of strengths demonstrated by the candidate.'),
  weaknesses: z.array(z.string()).describe('List of weaknesses demonstrated by the candidate.'),
  skills: z.object({
    communication: z.number().min(1).max(5).describe('Communication skills rating (1-5).'),
    technical_depth: z.number().min(1).max(5).describe('Technical depth rating (1-5).'),
    problem_solving: z.number().min(1).max(5).describe('Problem-solving skills rating (1-5).'),
    role_alignment: z.number().min(1).max(5).describe('Role alignment rating (1-5).'),
    clarity: z.number().min(1).max(5).describe('Clarity of responses rating (1-5).'),
  }).describe('Skill ratings for the candidate.'),
});

const EvaluateCandidateResponsesOutputSchema = z.object({
  evaluation: EvaluationOutputSchema.describe('The evaluation of the candidate responses.'),
});
export type EvaluateCandidateResponsesOutput = z.infer<typeof EvaluateCandidateResponsesOutputSchema>;

export async function evaluateCandidateResponses(input: EvaluateCandidateResponsesInput): Promise<EvaluateCandidateResponsesOutput> {
  return evaluateCandidateResponsesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateCandidateResponsesPrompt',
  input: {schema: EvaluateCandidateResponsesInputSchema},
  output: {schema: EvaluateCandidateResponsesOutputSchema},
  prompt: `You are a fair, structured interviewer. Evaluate candidate responses using transcripts. Output strict JSON with keys:
{
  "overall_score": 1-5,
  "summary": "...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "skills": {
    "communication": 1-5,
    "technical_depth": 1-5,
    "problem_solving": 1-5,
    "role_alignment": 1-5,
    "clarity": 1-5
  }
}
Be concise, evidence-based, and avoid hallucination. If data is insufficient, return low confidence notes.

ROLE: {{{role}}}
DESCRIPTION: {{{description}}}

QUESTIONS:
{{#each questions}}
  {{@index}}. {{{prompt}}} (Category: {{{category}}}, Difficulty: {{{difficulty}}})
{{/each}}

RESPONSES:
{{#each responses}}
  Question ID: {{{question_id}}}
  Transcript: {{{transcript}}}
{{/each}}
`,
});

const evaluateCandidateResponsesFlow = ai.defineFlow(
  {
    name: 'evaluateCandidateResponsesFlow',
    inputSchema: EvaluateCandidateResponsesInputSchema,
    outputSchema: EvaluateCandidateResponsesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
