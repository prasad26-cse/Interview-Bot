# **App Name**: AI Video Interviewer

## Core Features:

- Role-Aware Greeting: AI generates a warm, role-specific greeting from the role title and description.
- Dynamic Questions: Generates 5-7 questions tailored to the role using an AI tool, displayed one at a time with a difficulty gradient and covering behavioral and technical aspects.
- Browser Video Recording: Record, review, re-record video within the browser, and upload to the backend (limited retries).
- Transcription: Transcribe video recordings using AI with timestamps per segment.
- AI Evaluation: AI tool evaluates candidate responses: summarize strengths/weaknesses; rate skills on a scale; produce a JSON report and human summary.
- Recruiter Console: A dedicated area where recruiters can filter by role, view candidate profiles, watch videos inline, read transcripts, and export PDF reports.
- Authentication: Enable user and recruiter login/account creation

## Style Guidelines:

- Primary color: Light sea green (#20B2AA), a calming and professional color suitable for an interview setting.
- Background color: Very light grey (#F0F0F0), providing a clean and unobtrusive backdrop that maintains focus on the content. 
- Accent color: Soft blue (#ADD8E6) used sparingly for interactive elements and highlights, creating subtle emphasis.
- Body and headline font: 'Inter', a sans-serif font that offers a modern and neutral appearance, ensuring readability across all devices and contexts.
- Crisp, professional icons indicating record, stop, retry, and upload in the video recording interface. Icons should match Tailwind style conventions.
- A clean, responsive design for the recruiter dashboard, featuring clearly delineated sections for each video, the transcript, and the AI evaluation. Tailwind’s grid system will be heavily utilized.
- Use subtle entrance animations for question cards and loading skeletons during data fetch. Consider a typewriter effect for the AI-generated greeting.