// Single source of truth for the /studio portfolio. Edit text here, not in the components.

export type Person = { firstName: string; lastName: string; initials: string };

export const people: Person[] = [
  { firstName: "Adiel", lastName: "Rakover", initials: "AR" },
  { firstName: "Rebeka", lastName: "Szabo", initials: "RS" },
];

export const site = {
  // Shown in the top-left logo; hovering swaps short -> full.
  brand: "Code by",
  brandShort: "Adiel & Rebeka",
  brandFull: "Rakover & Szabo",
  // Infinite marquee in the hero.
  marquee: "Adiel Rakover & Rebeka Szabo —",
  role: ["Freelance", "Web Developers"],
  location: ["Working", "remotely,", "worldwide"],
  // IANA time zone for the footer clock, e.g. "Europe/Budapest". Empty hides the clock.
  timezone: "",
  // Optional portraits in /public, e.g. ["/studio/adiel.jpg", "/studio/rebeka.jpg"].
  heroImages: [] as string[],
  // Contact details. Empty values are hidden on the page.
  email: "",
  phone: "",
  greetings: ["Hello", "Bonjour", "Ciao", "Olà", "やあ", "Hallå", "Guten tag", "Hallo"],
  intro:
    "We're Adiel and Rebeka, two developers building fast, modern websites and web apps. Clear communication, clean code, no nonsense.",
  introAside:
    "Working as a duo means one small, focused team takes your project from first idea to launch, and stays around after it goes live.",
  workEmptyTitle: "Our first projects are on the way.",
  workEmptyText:
    "We're taking on our first clients right now. Have an idea for a website or web app? It could be the first one featured here.",
  nav: [
    { title: "Home", href: "#home" },
    { title: "Work", href: "#work" },
    { title: "About", href: "#about" },
    { title: "Contact", href: "#contact" },
  ],
  // Add real profile links, e.g. { title: "LinkedIn", href: "https://linkedin.com/in/..." }.
  socials: [] as { title: string; href: string }[],
};

export const fullNames = people.map((p) => `${p.firstName} ${p.lastName}`).join(" & ");

export type Project = { title: string; tag: string; color: string; accent: string };

// Add finished projects here; the Work list and sliding showcase appear automatically.
// Example: { title: "Client Site", tag: "Design & Development", color: "#000000", accent: "#706D63" }
export const projects: Project[] = [];

export const slider1 = [
  { color: "#e3e5e7", accent: "#455CE9" },
  { color: "#d6d7dc", accent: "#1C1D20" },
  { color: "#e3e3e3", accent: "#C9B98A" },
  { color: "#21242b", accent: "#999D9E" },
];

export const slider2 = [
  { color: "#d4e3ec", accent: "#334BD3" },
  { color: "#e5e0e1", accent: "#706D63" },
  { color: "#d7d4cf", accent: "#1C1D20" },
  { color: "#e1dad6", accent: "#455CE9" },
];
