
import type { Role, User, FullInterview } from './types';

// Mock data for roles
export const roles: Role[] = [
  {
    id: 'role_1',
    title: 'Senior Frontend Engineer',
    slug: 'senior-frontend-engineer',
    description: 'We are looking for an experienced frontend engineer to build modern, responsive, and performant user interfaces using React and Next.js.'
  },
  {
    id: 'role_2',
    title: 'Product Manager',
    slug: 'product-manager',
    description: 'Define product vision, strategy, and roadmap. Work closely with engineering, design, and marketing to launch new features and products.'
  },
  {
    id: 'role_3',
    title: 'AI/ML Engineer',
    slug: 'ai-ml-engineer',
    description: 'Develop and deploy machine learning models. Experience with Python, TensorFlow/PyTorch, and cloud platforms like GCP or AWS is required.'
  },
];

// Mock data for users (candidates and recruiters)
export let users: User[] = [
  {
    id: 'user_1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'candidate',
    avatarUrl: 'https://i.pravatar.cc/150?u=alice@example.com',
  },
  {
    id: 'user_2',
    name: 'Bob Williams',
    email: 'bob@example.com',
    role: 'recruiter',
    avatarUrl: 'https://i.pravatar.cc/150?u=bob@example.com',
  },
   {
    id: 'user_3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'candidate',
    avatarUrl: 'https://i.pravatar.cc/150?u=charlie@example.com',
  },
];

// Mock data for interviews
export let interviews: FullInterview[] = [
  {
    id: 'interview_1',
    roleId: 'role_1',
    role: roles[0],
    candidate: users[0],
    status: 'scored',
    createdAt: '2024-08-15T10:00:00Z',
    submittedAt: '2024-08-15T11:30:00Z',
    evaluation: {
      overallScore: 4.5,
      summary: 'Alice demonstrated strong technical knowledge and excellent communication skills. Her problem-solving approach was methodical and clear. A very strong candidate for this role.',
      strengths: ['React Hooks', 'System Design', 'Clear Communication'],
      weaknesses: ['State management libraries (minor)'],
      skills: {
        communication: 5,
        technical_depth: 4,
        problem_solving: 5,
        role_alignment: 4,
        clarity: 5,
      },
    },
    responses: [
        { questionId: 'q_1', questionPrompt: 'Tell us about your experience with Next.js.', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4', transcript: 'I have been using Next.js for the past three years...' },
        { questionId: 'q_2', questionPrompt: 'How do you handle state management in large React applications?', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4', transcript: 'I prefer using a combination of React Context for...' },
    ],
  },
  {
    id: 'interview_2',
    roleId: 'role_3',
    role: roles[2],
    candidate: users[2],
    status: 'submitted',
    createdAt: '2024-08-16T14:00:00Z',
    submittedAt: '2024-08-16T15:00:00Z',
    evaluation: null,
    responses: [
      { questionId: 'q_3', questionPrompt: 'Explain the difference between a GAN and a VAE.', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4', transcript: 'A Generative Adversarial Network consists of two neural networks...' },
    ],
  },
];
