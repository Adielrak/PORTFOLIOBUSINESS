import type { UserProfile, Template } from "@/lib/types";
import { MinimalTemplate } from "./templates/Minimal";
import { BoldTemplate } from "./templates/Bold";
import { CreativeTemplate } from "./templates/Creative";

interface Props {
  profile: UserProfile;
  template?: Template;
  watermark?: boolean;
}

export function PortfolioPreview({ profile, template, watermark = true }: Props) {
  const t = template ?? profile.template ?? "minimal";

  if (t === "bold") return <BoldTemplate profile={profile} watermark={watermark} />;
  if (t === "creative") return <CreativeTemplate profile={profile} watermark={watermark} />;
  return <MinimalTemplate profile={profile} watermark={watermark} />;
}
