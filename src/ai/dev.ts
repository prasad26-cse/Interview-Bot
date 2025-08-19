import { config } from 'dotenv';
config();

import '@/ai/flows/generate-role-greeting.ts';
import '@/ai/flows/generate-interview-questions.ts';
import '@/ai/flows/evaluate-candidate-responses.ts';
import '@/ai/flows/transcribe-interview-response.ts';