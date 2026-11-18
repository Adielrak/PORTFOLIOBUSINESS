import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { PortfolioContent, GitHubRepo, ChatMessage, ChatEditResponse } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const GENERATION_PROMPT = `You are an elite portfolio and resume writer for top tech talent.
Given raw user inputs, generate polished, compelling content.
Output ONLY valid JSON. No preamble, no markdown, no code fences.`;

interface GenerateInput {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  jobTarget: string;
  websiteURL?: string;
  linkedinURL?: string;
  projectURLs?: string[];
  resumeText?: string;
  githubRepos?: GitHubRepo[];
}

export async function generatePortfolioContent(input: GenerateInput): Promise<PortfolioContent> {
  const userMessage = `Generate a portfolio and resume for this person:

Name: ${input.name}
Title: ${input.title}
Bio: ${input.bio}
Skills: ${input.skills.join(", ")}
Job Target: ${input.jobTarget}
${input.websiteURL ? `Website: ${input.websiteURL}` : ""}
${input.linkedinURL ? `LinkedIn: ${input.linkedinURL}` : ""}
${input.projectURLs?.length ? `Project URLs:\n${input.projectURLs.join("\n")}` : ""}
${input.resumeText ? `\nResume Text:\n${input.resumeText}` : ""}
${
  input.githubRepos?.length
    ? `\nTop GitHub Repos:\n${input.githubRepos
        .map(
          (r) =>
            `- ${r.name}: ${r.description ?? "No description"} [${r.language ?? "unknown"}] ★${r.stargazers_count}`
        )
        .join("\n")}`
    : ""
}

Return ONLY this JSON schema:
{
  "name": string,
  "title": string,
  "tagline": string,
  "bio": string,
  "projects": [{"title": string, "description": string, "tech": string[], "url": string, "imageIndex": number | null}],
  "skills": string[],
  "resume": {
    "summary": string,
    "experience": [{"role": string, "org": string, "duration": string, "bullets": string[]}],
    "education": [{"degree": string, "institution": string, "year": string}]
  }
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: GENERATION_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text) as PortfolioContent;
}

const CHAT_EDIT_PROMPT = `You are a portfolio editor AI. You help users improve their portfolio by making targeted edits.

You receive the current portfolio data as context and the user's requested change.
Return ONLY valid JSON — no preamble, no markdown fences.

Supported edit paths:
- "portfolio.bio"        — the written bio paragraph
- "portfolio.tagline"   — the short tagline/headline
- "portfolio.skills"    — array of skill strings
- "portfolio.projects"  — full array replacement (preserve structure)
- "resume.summary"      — resume summary paragraph

Only change what was asked. Keep all other fields identical to the input.

Response schema:
{
  "changes": [
    { "path": "portfolio.bio", "value": "..." }
  ],
  "explanation": "One sentence explaining what you changed and why."
}`;

export async function chatEditPortfolio(
  history: ChatMessage[],
  currentPortfolio: object
): Promise<ChatEditResponse> {
  const contextMessage: Anthropic.MessageParam = {
    role: "user",
    content: `Current portfolio data:\n${JSON.stringify(currentPortfolio, null, 2)}\n\nUser request: ${history[history.length - 1].content}`,
  };

  // Build message history for multi-turn context (skip last user msg, already in contextMessage)
  const priorMessages: Anthropic.MessageParam[] = history
    .slice(0, -1)
    .map((m) => ({ role: m.role, content: m.content }));

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: CHAT_EDIT_PROMPT,
    messages: [...priorMessages, contextMessage],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";
  const parsed = JSON.parse(text) as { changes: ChatEditResponse["changes"]; explanation: string };

  return {
    changes: parsed.changes ?? [],
    explanation: parsed.explanation ?? "",
    tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
  };
}
