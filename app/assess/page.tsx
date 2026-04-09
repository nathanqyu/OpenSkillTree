import type { Metadata } from "next";
import AssessClient from "@/components/assess/AssessClient";

export const metadata: Metadata = {
  title: "Deep Assessment — OpenSkillTree",
  description:
    "A multi-section aptitude assessment combining cognitive tasks and self-reflection. Sharpen your skill profile in 20 minutes.",
};

export default function AssessPage() {
  return <AssessClient />;
}
