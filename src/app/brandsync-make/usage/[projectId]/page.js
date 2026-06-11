import ProjectUsage from "@/feature/brandsync-make/ProjectUsage";

export const dynamic = "force-dynamic";

export default async function ProjectUsagePage({ params }) {
  const { projectId } = await params;
  return <ProjectUsage projectId={projectId} />;
}
