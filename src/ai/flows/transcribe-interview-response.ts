'use server';

/**
 * @fileOverview A flow to transcribe video responses using AI.
 *
 * - transcribeInterviewResponse - A function that handles the video transcription process.
 * - TranscribeInterviewResponseInput - The input type for the transcribeInterviewResponse function.
 * - TranscribeInterviewResponseOutput - The return type for the transcribeInterviewResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeInterviewResponseInputSchema = z.object({
  videoUrl: z
    .string()
    .describe(
      'The URL of the video to transcribe. Should be a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep in line with Genkit documentation standards
    ),
});
export type TranscribeInterviewResponseInput = z.infer<
  typeof TranscribeInterviewResponseInputSchema
>;

const TranscribeInterviewResponseOutputSchema = z.object({
  transcript: z.string().describe('The transcript of the video.'),
  transcriptJson: z.any().describe('The raw JSON transcript with timestamps.'),
});
export type TranscribeInterviewResponseOutput = z.infer<
  typeof TranscribeInterviewResponseOutputSchema
>;

export async function transcribeInterviewResponse(
  input: TranscribeInterviewResponseInput
): Promise<TranscribeInterviewResponseOutput> {
  return transcribeInterviewResponseFlow(input);
}

const transcribeVideoPrompt = ai.definePrompt({
  name: 'transcribeVideoPrompt',
  input: {schema: TranscribeInterviewResponseInputSchema},
  output: {schema: TranscribeInterviewResponseOutputSchema},
  prompt: `Transcribe the video at the following URL:\n\n{{media url=videoUrl}}`,
});

const transcribeInterviewResponseFlow = ai.defineFlow(
  {
    name: 'transcribeInterviewResponseFlow',
    inputSchema: TranscribeInterviewResponseInputSchema,
    outputSchema: TranscribeInterviewResponseOutputSchema,
  },
  async input => {
    const {output} = await transcribeVideoPrompt(input);
    return output!;
  }
);
