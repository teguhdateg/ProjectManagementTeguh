"use client";

import { useProjectsGetById } from "@/services/hooks/projects";
import { Card } from "@/components/ui/card-hover-effect";
import React, { useState } from "react";
import { createPortal } from "react-dom";

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
  const projectsDetails =
    (data as ProjectResponse)?.data ?? ({} as ProjectResponse["data"]);

  // Tambahkan state untuk modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    url: string;
    name: string;
  } | null>(null);

  // Fungsi cek file gambar
  const isImage = (url: string) =>
    /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);

  // Modal JSX
  const modal =
    openModal && selectedDoc
      ? createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60"
            onClick={() => setOpenModal(false)}
          >
            <div
              className="bg-white rounded-lg p-4 max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                onClick={() => setOpenModal(false)}
              >
                &times;
              </button>
              <img
                src={selectedDoc.url}
                alt={selectedDoc.name}
                className="w-full h-auto rounded"
              />
              <div className="mt-2 text-center">{selectedDoc.name}</div>
            </div>
          </div>,
          typeof window !== "undefined" ? document.body : (null as any)
        )
      : null;

  return (
    <div className="flex flex-col">
      <Card className="bg-primary/2 border-primary/20 my-4 rounded-lg">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {projectsDetails.documents?.map((doc) => (
              <div
                key={doc.url}
                className="cursor-pointer"
                onClick={() => {
                  if (isImage(doc.url)) {
                    setSelectedDoc(doc);
                    setOpenModal(true);
                  } else {
                    // Untuk file non-gambar, download file
                    window.open(doc.url, "_blank");
                  }
                }}
              >
                <Card className="flex flex-col items-center p-3 hover:shadow-lg transition">
                  {isImage(doc.url) ? (
                    <img
                      src={doc.url}
                      alt={doc.name}
                      className="h-32 w-full object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="h-32 w-full flex items-center justify-center bg-gray-100 rounded mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-400"
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
                    </div>
                  )}
                  <span className="text-sm text-center break-all">
                    {doc.name}
                  </span>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Created By</h3>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-medium">
                {projectsDetails.createdBy?.name}
              </span>
              <span className="text-sm">
                {projectsDetails.createdBy?.email}
              </span>
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
      {modal}
    </div>
  );
}
