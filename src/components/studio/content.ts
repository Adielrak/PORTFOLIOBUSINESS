// Single source of truth for the /studio portfolio. Swap these values for your own.
export const site = {
  firstName: "Your",
  lastName: "Name",
  brand: "Code by",
  role: ["Freelance", "Designer & Developer"],
  location: ["Located", "in the", "World"],
  timezone: "Europe/Amsterdam",
  // Put an image in /public (e.g. /studio/portrait.png) to show a hero portrait.
  heroImage: "" as string,
  email: "hello@example.com",
  phone: "+00 0 00 00 00 00",
  greetings: ["Hello", "Bonjour", "Ciao", "Olà", "やあ", "Hallå", "Guten tag", "Hallo"],
  intro:
    "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge.",
  introAside:
    "The combination of my passion for design, code & interaction positions me in a unique place in the web design world.",
  nav: [
    { title: "Home", href: "#home" },
    { title: "Work", href: "#work" },
    { title: "About", href: "#about" },
    { title: "Contact", href: "#contact" },
  ],
  socials: [
    { title: "Awwwards", href: "#" },
    { title: "Instagram", href: "#" },
    { title: "Dribbble", href: "#" },
    { title: "LinkedIn", href: "#" },
  ],
};

export type Project = { title: string; tag: string; color: string; accent: string };

export const projects: Project[] = [
  { title: "Northwind", tag: "Design & Development", color: "#000000", accent: "#706D63" },
  { title: "Atlas Studio", tag: "Design & Development", color: "#8C8C8C", accent: "#D9D6CF" },
  { title: "Kinetic", tag: "Interaction & Development", color: "#EFE8D3", accent: "#C9B98A" },
  { title: "Quiet Hours", tag: "Design & Development", color: "#706D63", accent: "#1C1D20" },
];

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
