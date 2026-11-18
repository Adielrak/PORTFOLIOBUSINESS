import type { Metadata } from "next";
import { StudioPage } from "@/components/studio/StudioPage";
import { fullNames, site } from "@/components/studio/content";
import "./studio.css";

export const metadata: Metadata = {
  title: `${fullNames} • ${site.role.join(" ")}`,
  description: site.intro,
};

export default function Page() {
  return <StudioPage />;
}
