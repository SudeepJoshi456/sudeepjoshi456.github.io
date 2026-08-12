export const profile = {
  name: 'Sudeep Joshi',
  title: 'Software Engineer',
  school: 'CS @ Alabama A&M (GPA 4.0)',
  status: 'Looking for new grad software engineering roles',
  email: 'joshisudeep456@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/sudeepjoshi456/',
    github: 'https://github.com/SudeepJoshi456',
    resume: '/Sudeep_Joshi_Resume.pdf',
  },
}

/** Compact homepage lines with optional brand logos. */
export const highlightLines: { text: string; logo?: 'microsoft' | 'amazon' | 'nsf' | 'aamu' | 'wgi' }[] = [
  { text: 'SWE Intern @ Microsoft', logo: 'microsoft' },
  { text: 'SDE Intern @ Amazon ×2', logo: 'amazon' },
  { text: 'Research @ NSF', logo: 'nsf' },
  { text: 'Research @ AAMU', logo: 'aamu' },
  { text: 'Geospatial SWE Intern @ WGI', logo: 'wgi' },
]


export type ExperienceItem = {
  id: string
  company: string
  role: string
  location: string
  dates: string
  metric: string
  summary: string
  bullets: string[]
  stack: string[]
  href?: string
}

export const experience: ExperienceItem[] = [
  {
    id: 'microsoft',
    company: 'Microsoft',
    role: 'Software Engineer Intern',
    location: 'Redmond, WA',
    dates: 'May 2026 to Jul 2026',
    href: 'https://www.microsoft.com',
    metric: '80%+ faster expense review',
    summary: 'built a Microsoft 365 Copilot expense agent that cut manager review time by over 80%',
    bullets: [
      'Built the C#/.NET backend for a Microsoft 365 Copilot AI Expense Agent connecting two enterprise financial systems into a unified real-time budget dashboard.',
      'Added conversational budget allocation with Microsoft Graph org data so managers could split team budgets by region in natural language.',
      'Fixed a Copilot rendering bug and a backend concurrency issue; added caching, batching, and retry logic for large org hierarchies.',
    ],
    stack: ['C#', '.NET', 'Microsoft Graph', 'Copilot', 'Azure'],
  },
  {
    id: 'amazon-arc',
    company: 'Amazon',
    role: 'Software Development Engineer Intern',
    location: 'New York, NY',
    dates: 'Jan 2026 to Apr 2026',
    href: 'https://www.amazon.com',
    metric: '5 to 8 hrs saved per manager / quarter',
    summary: 'shipped Slack launch announcements for Arc on a full serverless AWS stack',
    bullets: [
      'Architected and shipped Slack Launch Announcements for Arc on AWS (React, Lambda/TypeScript, API Gateway, DynamoDB, S3, CDK), closing a 70% coverage gap.',
      'Solved Slack media embedding for inline assets and built create, edit, and soft-delete into a full announcement lifecycle.',
      'Shipped stretch goals early: an Amazon Bedrock AI case study generator and a query optimization that removed full-table scans.',
    ],
    stack: ['React', 'TypeScript', 'AWS Lambda', 'DynamoDB', 'CDK', 'Bedrock'],
  },
  {
    id: 'wgi',
    company: 'WGI',
    role: 'Geospatial Software Engineering Intern',
    location: 'Huntsville, AL',
    dates: 'Sep 2025 to Dec 2025',
    href: 'https://www.wginc.com',
    metric: 'YOLOv8 in production pipeline',
    summary: 'put YOLOv8 billboard detection into a production geospatial pipeline at WGI',
    bullets: [
      'Fine-tuned a YOLOv8 billboard detection model on a custom Roboflow dataset and deployed it into WGI’s production ODA image processing pipeline.',
      'Reverse-engineered a legacy C# codebase (call graphs and schema) to enable migration to a Python ArcGIS toolbox pipeline.',
    ],
    stack: ['Python', 'YOLOv8', 'Roboflow', 'C#', 'ArcGIS'],
  },
  {
    id: 'amazon-clone',
    company: 'Amazon',
    role: 'Software Development Engineer Intern',
    location: 'New York, NY',
    dates: 'May 2025 to Jul 2025',
    href: 'https://www.amazon.com',
    metric: '~80% faster deal setup',
    summary: 'cut Amazon deal setup time by ~80% with an end-to-end Clone Deal feature',
    bullets: [
      'Built Clone Deal end to end (Coral backend, React/Redux frontend) for sales teams handling 150+ deals/day.',
      'Designed a cross-service API to auto-populate fields across legacy systems; authored HLD/LLD, led design reviews, and shipped with full test coverage.',
    ],
    stack: ['React', 'Redux', 'Java', 'Coral', 'CI/CD'],
  },
]

export type ProjectItem = {
  id: string
  title: string
  year: string
  description: string
  stack: string[]
  highlight?: string
}

export const projects: ProjectItem[] = [
  {
    id: 'fico',
    title: 'FICO Credit Card Fraud Detection',
    year: '2025',
    description:
      'Built fraud-signal features on 1.6M transactions and trained a neural net that hit AUC 0.92 on a blind holdout, catching 75.6% of fraud losses while reviewing just 0.5% of legitimate transactions.',
    stack: ['Python', 'TensorFlow', 'scikit-learn', 'pandas'],
    highlight: 'AUC 0.92 on 1.6M transactions',
  },
  {
    id: 'uplift',
    title: 'Uplift Biz',
    year: '2025',
    description:
      'Full-stack AI counseling platform with Gemini recommendations, financial dashboards, and Firebase Auth/Firestore sync.',
    stack: ['Next.js', 'Firebase', 'Gemini AI'],
    highlight: 'Top 10 of 200+ teams at HBCU App Build & Pitch',
  },
]

export const education = [
  {
    id: 'aamu',
    school: 'Alabama A&M University',
    detail: 'B.S. Computer Science, GPA 4.0/4.0, Transfer Merit Scholar',
    dates: 'Expected Dec 2026',
    location: 'Huntsville, AL',
  },
  {
    id: 'jsu',
    school: 'Jacksonville State University',
    detail: 'B.S. Computer Science (Data Science), GPA 4.0/4.0, Prestige Scholar',
    dates: 'Aug 2022 to Dec 2023',
    location: 'Jacksonville, AL',
  },
]

export const skills = {
  languages: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C#', 'C++'],
  frameworks: ['React', 'Redux', 'Next.js', 'Spring Boot', 'FastAPI', '.NET'],
  cloud: [
    'AWS Lambda',
    'API Gateway',
    'DynamoDB',
    'S3',
    'CDK',
    'Bedrock',
    'Azure',
    'Microsoft Graph',
  ],
  tools: ['Git', 'SQL', 'Node.js', 'REST APIs'],
}

export const recognition = [
  'Meta Scholar 2024',
  'Goldman Sachs VCI',
  'Bloomberg Accelerator',
  'PFX2025 Research Mentor',
  'CodePath Advanced TIP',
  'Mastercard Data Challenge Finalist',
  'HBCU App Build & Pitch (Top 10 of 200+)',
]

export const aboutLines = [
  'Looking for new grad software engineering roles (graduating Dec 2026).',
  'I care about shipping software people actually use.',
  'Recently that has meant Copilot agents at Microsoft, serverless product features at Amazon, and geospatial ML in production at WGI.',
  'I move well in large codebases, write clear design docs, and own work end to end.',
]

export const leadership = [
  'President, IEEE @ JSU',
  'Secretary, IEEE @ AAMU',
  'President, Nepalese Student Organization @ JSU',
  'Google Developer Student Club',
  'ColorStack',
]
