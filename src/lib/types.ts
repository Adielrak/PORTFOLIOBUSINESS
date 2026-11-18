export type Template = "minimal" | "bold" | "creative";
export type Plan = "free" | "pro";

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  url: string;
  imageIndex: number | null;
}

export interface Experience {
  role: string;
  org: string;
  duration: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  summary: string;
  experience: Experience[];
  education: Education[];
}

export interface PortfolioContent {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  projects: Project[];
  skills: string[];
  resume: ResumeData;
}

export interface UserProfile {
  uid: string;
  name: string;
  title: string;
  bio: string;
  jobTarget: string;
  photoURL: string;
  screenshotURLs: string[];
  template: Template;
  generatedAt: number;
  viewCount: number;
  socialLinks?: SocialLinks;
  portfolio: {
    tagline: string;
    bio: string;
    projects: Project[];
    skills: string[];
  };
  resume: ResumeData;
  // Plan & billing
  isPaid: boolean;
  plan: Plan;
  tokensUsedThisMonth: number;
  tokenResetAt: number;
  referralCode: string;
}

export interface ContactMessage {
  id?: string;
  fromName: string;
  fromEmail: string;
  message: string;
  createdAt: number;
  read: boolean;
}

export interface DailyViews {
  // keys are ISO date strings "YYYY-MM-DD"
  [date: string]: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PortfolioChange {
  path: string;
  value: unknown;
}

export interface ChatEditResponse {
  changes: PortfolioChange[];
  explanation: string;
  tokensUsed: number;
}

export interface FormState {
  // Step 1: Personal
  fullName: string;
  jobTitle: string;
  bio: string;
  photoFile: File | null;
  photoURL: string;
  websiteURL: string;
  twitterURL: string;

  // Step 2: Work
  githubURL: string;
  linkedinURL: string;
  projectURLs: string[];

  // Step 3: Resume
  resumeFile: File | null;
  resumeURL: string;
  skills: string[];
  jobTarget: string;

  // Step 4: Media
  screenshotFiles: File[];
  screenshotURLs: string[];

  // Meta
  template: Template;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  language: string | null;
  stargazers_count: number;
}

// Token budget per plan (monthly)
export const TOKEN_LIMITS: Record<Plan, number> = {
  free: 0,
  pro: 100_000,
};
