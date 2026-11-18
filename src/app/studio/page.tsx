import type { Metadata } from "next";
import { StudioPage } from "@/components/studio/StudioPage";
import { site } from "@/components/studio/content";
import "./studio.css";

export const metadata: Metadata = {
  title: `${site.firstName} ${site.lastName} • ${site.role[1]}`,
  description: site.intro,
};

export default function Page() {
  return <StudioPage />;
}
