export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { generatePortfolioContent } from "@/lib/claude";
import { fetchGitHubRepos } from "@/lib/github";
import { parseResumePdf } from "@/lib/pdf";
import { savePortfolio } from "@/lib/firebase/firestore";
import { getAdminAuth } from "@/lib/firebase/admin-auth";
import type { Template } from "@/lib/types";

export async function POST(req: NextRequest) {
  // Verify Firebase ID token from Authorization header
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let uid: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const formData = await req.formData();

  const name = formData.get("fullName") as string;
  const title = formData.get("jobTitle") as string;
  const bio = formData.get("bio") as string;
  const websiteURL = formData.get("websiteURL") as string;
  const githubURL = formData.get("githubURL") as string;
  const linkedinURL = formData.get("linkedinURL") as string;
  const twitterURL = formData.get("twitterURL") as string;
  const skills = JSON.parse((formData.get("skills") as string) || "[]") as string[];
  const jobTarget = formData.get("jobTarget") as string;
  const projectURLs = JSON.parse((formData.get("projectURLs") as string) || "[]") as string[];
  const photoURL = formData.get("photoURL") as string;
  const screenshotURLs = JSON.parse((formData.get("screenshotURLs") as string) || "[]") as string[];
  const template = (formData.get("template") as Template) || "minimal";
  const resumeFile = formData.get("resumeFile") as File | null;

  // Parse resume PDF
  let resumeText = "";
  if (resumeFile && resumeFile.size > 0) {
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    try {
      resumeText = await parseResumePdf(buffer);
    } catch {
      // silently skip if parse fails
    }
  }

  // Fetch GitHub repos
  const githubRepos = githubURL ? await fetchGitHubRepos(githubURL) : [];

  // Generate with Claude
  const content = await generatePortfolioContent({
    name,
    title,
    bio,
    skills,
    jobTarget,
    websiteURL,
    linkedinURL,
    projectURLs: projectURLs.filter(Boolean),
    resumeText,
    githubRepos,
  });

  // Save to Firestore
  await savePortfolio(uid, {
    uid,
    name,
    title,
    bio,
    jobTarget,
    photoURL: photoURL || "",
    screenshotURLs,
    template,
    generatedAt: Date.now(),
    viewCount: 0,
    socialLinks: {
      github: githubURL || undefined,
      linkedin: linkedinURL || undefined,
      twitter: twitterURL || undefined,
      website: websiteURL || undefined,
    },
    portfolio: {
      tagline: content.tagline,
      bio: content.bio,
      projects: content.projects,
      skills: content.skills,
    },
    resume: content.resume,
    isPaid: false,
    plan: "free",
    tokensUsedThisMonth: 0,
    tokenResetAt: Date.now(),
    referralCode: uid.slice(0, 8),
  });

  return NextResponse.json({ success: true, portfolio: content });
}
