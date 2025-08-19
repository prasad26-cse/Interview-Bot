
'use server';

/**
 * @fileOverview AI flow to generate a role-specific greeting for candidates.
 *
 * - generateRoleSpecificGreeting - A function that generates a role-specific greeting.
 * - GenerateRoleSpecificGreetingInput - The input type for the generateRoleSpecificGreeting function.
 * - GenerateRoleSpecificGreetingOutput - The return type for the generateRoleSpecificGreeting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoleSpecificGreetingInputSchema = z.object({
  role: z.string().describe('The title of the role.'),
  description: z.string().describe('The description of the role.'),
});
export type GenerateRoleSpecificGreetingInput = z.infer<
  typeof GenerateRoleSpecificGreetingInputSchema
>;

const GenerateRoleSpecificGreetingOutputSchema = z.object({
  greeting: z.string().describe('The generated role-specific greeting.'),
});
export type GenerateRoleSpecificGreetingOutput = z.infer<
  typeof GenerateRoleSpecificGreetingOutputSchema
>;

export async function generateRoleSpecificGreeting(
  input: GenerateRoleSpecificGreetingInput
): Promise<GenerateRoleSpecificGreetingOutput> {
  return generateRoleSpecificGreetingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoleSpecificGreetingPrompt',
  input: {schema: GenerateRoleSpecificGreetingInputSchema},
  output: {schema: GenerateRoleSpecificGreetingOutputSchema},
  prompt: `You are a friendly recruiter. Write a 2–3 sentence, role‑specific greeting that sets expectations and encourages thoughtful answers. Tone: warm, clear, professional.\n\nROLE: {{{role}}}\nDESCRIPTION: {{{description}}}`,
});

const generateRoleSpecificGreetingFlow = ai.defineFlow(
  {
    name: 'generateRoleSpecificGreetingFlow',
    inputSchema: GenerateRoleSpecificGreetingInputSchema,
    outputSchema: GenerateRoleSpecificGreetingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
