import type { Role, User, Interview } from './types';

// This file now contains only placeholder data or can be used for seeding the database.
// All dynamic data is fetched from Firebase.

export const roles: Role[] = [
  {
    id: 'role_1',
    title: 'Frontend Developer (React)',
    slug: 'frontend-developer',
    description: 'Build and maintain React apps with TypeScript, focusing on performance and accessibility. You will work with a modern stack, including Next.js, Tailwind CSS, and GraphQL.',
  },
  {
    id: 'role_2',
    title: 'Backend Developer (FastAPI)',
    slug: 'backend-developer',
    description: 'Design, build, and maintain scalable APIs using FastAPI and Python. Experience with SQL databases, asynchronous programming, and cloud services like AWS is essential.',
  },
  {
    id: 'role_3',
    title: 'Data Analyst',
    slug: 'data-analyst',
    description: 'Analyze large datasets to extract meaningful insights. Proficiency in SQL, Python (with pandas, numpy), and data visualization tools like Tableau or PowerBI is required.',
  },
];

export const users: User[] = [
    {
        id: 'user_1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'candidate',
        avatarUrl: 'https://placehold.co/100x100.png'
    },
    {
        id: 'user_2',
        name: 'Bob Williams',
        email: 'bob@example.com',
        role: 'candidate',
        avatarUrl: 'https://placehold.co/100x100.png'
    },
    {
        id: 'user_recruiter_1',
        name: 'Charles Dickens',
        email: 'charles@vidhire.com',
        role: 'recruiter',
        avatarUrl: 'https://placehold.co/100x100.png'
    }
]

export const interviews: Interview[] = [
  {
    id: 'interview_1',
    roleId: 'role_1',
    candidate: users[0],
    status: 'scored',
    createdAt: new Date('2024-05-20T10:00:00Z').toISOString(),
    submittedAt: new Date('2024-05-20T10:30:00Z').toISOString(),
    evaluation: {
        overallScore: 4,
        summary: 'Alice is a strong frontend candidate with excellent communication skills and a solid grasp of React principles. She provided clear, well-structured answers to most questions. Her systems design knowledge could be deeper, but she shows great problem-solving aptitude.',
        strengths: ['React Knowledge', 'Clear Communication', 'Problem-Solving'],
        weaknesses: ['System Design Depth', 'State Management Patterns'],
        skills: {
            communication: 5,
            technical_depth: 4,
            problem_solving: 4,
            role_alignment: 5,
            clarity: 5,
        }
    },
    responses: [
        {
            questionId: 'q_1',
            questionPrompt: 'Tell us about your most challenging React project.',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            transcript: 'My most challenging project was building a real-time data visualization dashboard. We had to handle thousands of data points updating every second, which required careful performance optimization using techniques like virtualization and memoization. It taught me a lot about React\'s rendering process.'
        },
        {
            questionId: 'q_2',
            questionPrompt: 'How do you handle state management in a large React application?',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            transcript: 'For large applications, I typically lean towards solutions like Redux Toolkit or Zustand. I prefer Zustand for its simplicity and minimal boilerplate. For simpler cases, React Context with hooks like useReducer can be very effective without adding external dependencies. The key is to choose the right tool for the complexity of the state.'
        },
        {
            questionId: 'q_3',
            questionPrompt: 'Describe your experience with accessibility (a11y) in web development.',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            transcript: 'I take accessibility very seriously. In my previous role, I was responsible for ensuring our application met WCAG 2.1 AA standards. This involved using semantic HTML, managing focus for keyboard users, providing proper ARIA attributes for dynamic components, and ensuring sufficient color contrast. I often use tools like Axe and Lighthouse to audit our work.'
        }
    ]
  },
  {
    id: 'interview_2',
    roleId: 'role_2',
    candidate: users[1],
    status: 'submitted',
    createdAt: new Date('2024-05-21T11:00:00Z').toISOString(),
    submittedAt: new Date('2024-05-21T11:45:00Z').toISOString(),
    evaluation: null,
    responses: []
  },
    {
    id: 'interview_3',
    roleId: 'role_1',
    candidate: users[1],
    status: 'scored',
    createdAt: new Date('2024-05-22T09:00:00Z').toISOString(),
    submittedAt: new Date('2024-05-22T09:35:00Z').toISOString(),
     evaluation: {
        overallScore: 3,
        summary: 'Bob has foundational knowledge of React but struggled with more in-depth technical questions. His communication was adequate but could be more structured. He seems eager to learn but may need some mentoring to get up to speed for a senior role.',
        strengths: ['Eagerness to Learn', 'Basic React Syntax'],
        weaknesses: ['Technical Depth', 'Answer Structure', 'Performance Concepts'],
        skills: {
            communication: 3,
            technical_depth: 2,
            problem_solving: 3,
            role_alignment: 3,
            clarity: 4,
        }
    },
    responses: [
        {
            questionId: 'q_1',
            questionPrompt: 'Tell us about your most challenging React project.',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            transcript: 'I built a small e-commerce site once. It was hard to get the shopping cart to work right.'
        },
        {
            questionId: 'q_2',
            questionPrompt: 'How do you handle state management in a large React application?',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            transcript: 'I just use useState mostly. I have heard of Redux but it seems complicated.'
        }
    ]
  },
];
