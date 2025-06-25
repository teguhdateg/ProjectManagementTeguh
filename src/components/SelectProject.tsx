import React, { useEffect, useRef, useState } from "react";
import {
  Project,
  ProjectResponse,
  useProjectsGet,
} from "@/services/hooks/projects";

type SelectProjectProps = {
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
};

export default function SelectProject({
  selectedProjectId,
  onSelectProject,
}: SelectProjectProps) {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isFetching, refetch } = useProjectsGet({
    params: {
      name: "",
      page,
      perPage: limit,
    },
  });

  const projectsList: Project[] = (data as ProjectResponse)?.data ?? [];
  const meta = (data as ProjectResponse)?.meta?.pagination;
  const loader = useRef<HTMLDivElement | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (projectsList && Array.isArray(projectsList)) {
      setProjects((prev) =>
        page === 1 ? projectsList : [...prev, ...projectsList]
      );
    }
  }, [projectsList, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetching &&
          Array.isArray(projectsList) &&
          projectsList.length === limit
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [isFetching, projectsList]);

  return (
    <div className="relative w-64">
        <select
          value={selectedProjectId || ""}
          onChange={(e) => onSelectProject(e.target.value)}
          className="w-full border rounded-md p-1.5"

        >
          <option value="" disabled>
            Select a project
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
    </div>
  );
}
