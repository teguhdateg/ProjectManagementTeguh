import { use } from "react";
import ProjectDetails from "./ProjectDetails";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <ProjectDetails id={id} />;
}
