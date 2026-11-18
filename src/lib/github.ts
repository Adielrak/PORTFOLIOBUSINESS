import "server-only";
import type { GitHubRepo } from "./types";

export async function fetchGitHubRepos(profileURL: string): Promise<GitHubRepo[]> {
  const match = profileURL.match(/github\.com\/([^/]+)/);
  if (!match) return [];
  const username = match[1];

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-builder",
  };
  if (process.env.GITHUB_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_API_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
    { headers, next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];

  const repos: GitHubRepo[] = await res.json();
  return repos
    .filter((r) => !r.name.includes(username) && r.description)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);
}
