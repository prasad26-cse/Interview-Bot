export interface Role {
  id: string;
  title: string;
  slug: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter';
  avatarUrl?: string;
}

export interface Question {
  index: number;
  prompt: string;
  category: 'tech' | 'behavioral' | 'system' | 'culture';
  difficulty: number;
}

export interface InterviewData {
  id: string;
  role: Role;
  greeting: string;
  questions: Question[];
}

export interface Skills {
    communication: number;
    technical_depth: number;
    problem_solving: number;
    role_alignment: number;
    clarity: number;
}

export interface Evaluation {
    overallScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    skills: Skills;
}

export interface Response {
    questionId: string;
    questionPrompt: string;
    videoUrl: string;
    transcript: string;
}

export interface Interview {
    id: string;
    roleId: string;
    candidate: User;
    status: 'created' | 'in_progress' | 'submitted' | 'scored';
    createdAt: string;
    submittedAt: string;
    evaluation: Evaluation | null;
    responses: Response[];
}

export interface FullInterview extends Interview {
    role: Role;
}
