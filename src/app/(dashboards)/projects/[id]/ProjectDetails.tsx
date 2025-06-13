"use client";

import { useProjectsGetById } from "@/services/hooks/projects";
import { Card } from "@/components/ui/card-hover-effect";

export interface ProjectResponse {
  data: {
    createdAt: string;
    createdBy: { id: string; name: string; email: string };
    createdById: string;
    description: string;
    documents: { url: string; name: string }[];
    endDate: string;
    id: string;
    isOverdue: boolean;
    name: string;
    overdueDays: number;
    startDate: string;
    status: string;
    teams: { id: string; name: string; email: string }[];
    updatedAt: string;
    userId: string;
  };
}

export default function ProjectDetails({ id }: { id: string }) {
  const { data } = useProjectsGetById({ id });

  const projectsDetails = (data as ProjectResponse)?.data ?? ({} as ProjectResponse["data"]);

  return (
    <>
    <Card className="bg-primary/2 border-primary/20  my-4 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{projectsDetails.name}</h1>
      <p className="mb-6">{projectsDetails.description}</p>

      <div className="flex flex-wrap gap-6 mb-6">
        <div>
          <h3 className="font-semibold">Status</h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              projectsDetails.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {projectsDetails.status?.charAt(0).toUpperCase() +
              projectsDetails.status?.slice(1)}
          </span>
        </div>

        <div>
          <h3 className="font-semibold">Start Date</h3>
          <p>{new Date(projectsDetails.startDate).toLocaleDateString()}</p>
        </div>

        <div>
          <h3 className="font-semibold">End Date</h3>
          <p>{new Date(projectsDetails.endDate).toLocaleDateString()}</p>
        </div>

        {projectsDetails.isOverdue && (
          <div>
            <h3 className="font-semibold text-red-600">Overdue</h3>
            <p className="text-red-600 font-semibold">
              {projectsDetails.overdueDays} days overdue
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Documents</h3>
        <ul className="space-y-2">
          {projectsDetails.documents?.map((doc) => (
            <li key={doc.url}>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {doc.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Created By</h3>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-medium">{projectsDetails.createdBy?.name}</span>
            <span className="text-sm">{projectsDetails.createdBy?.email}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Team Members</h3>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {projectsDetails.teams?.map((member) => (
            <li
              key={member.id}
              className="bg-gray-50 rounded-lg p-3 shadow-sm flex flex-col items-center text-center"
            >
              <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-white font-bold text-lg">
                {member.name.charAt(0)}
              </div>
              <span className="mt-2 font-medium">{member.name}</span>
              <span className="text-xs text-secondary">{member.email}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
    </>
  );
}
