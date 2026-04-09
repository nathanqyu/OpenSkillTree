import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getModuleById } from "@/data/try-it/registry";
import TryItPlayer from "@/components/try-it/TryItPlayer";

interface PageProps {
  params: Promise<{ treeId: string; moduleId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleId } = await params;
  const module = getModuleById(moduleId);
  if (!module) return { title: "Module Not Found — OpenSkillTree" };
  return {
    title: `Try It: ${module.title} — OpenSkillTree`,
    description: module.description,
  };
}

export default async function TryItPage({ params }: PageProps) {
  const { treeId, moduleId } = await params;
  const decodedTreeId = decodeURIComponent(treeId);
  const module = getModuleById(moduleId);

  if (!module || module.treePathId !== decodedTreeId) {
    notFound();
  }

  return <TryItPlayer module={module} />;
}
