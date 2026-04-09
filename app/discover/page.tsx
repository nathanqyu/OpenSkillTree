import type { Metadata } from "next";
import { Suspense } from "react";
import DiscoverClient from "@/components/discover/DiscoverClient";

export const metadata: Metadata = {
  title: "Discover — OpenSkillTree",
  description:
    "Find skills you didn't know you'd be good at. A structured exploration of your natural tendencies, interests, and strengths — mapped against skill progressions across dozens of domains.",
};

export default function DiscoverPage() {
  return (
    <Suspense>
      <DiscoverClient />
    </Suspense>
  );
}
