"use client";
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Project,
  ProjectResponse,
  useProjectDelete,
  useProjectsGet,
} from "@/services/hooks/projects";
import { CirclePlus, Pencil, Trash, RefreshCcw } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Modal from "./components/modal";
import { useDebounce } from "@/lib/useDebounce";

const defaultPage = 1;
const limit = 5;

export default function ResponsiveList() {
  const router = useRouter();
  const [page, setPage] = React.useState(defaultPage);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [open, setOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editProjectId, setEditProjectId] = React.useState("");

  const { data, isFetching, refetch } = useProjectsGet({
    params: {
      name: debouncedSearch,
      page,
      perPage: limit,
    },
  });

  const projectsList: Project[] = (data as ProjectResponse)?.data ?? [];
  const meta = (data as ProjectResponse)?.meta?.pagination;

  const handleEdit = (id: string) => {
    setIsEditOpen(true);
    setEditProjectId(id);
  };

  const { mutate: deleteProject } = useProjectDelete({
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error("Upload failed:", err);
    },
  });
  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;
    await deleteProject({ id });
    console.log("Deleting project with ID:", id);
  };

  const columns = [
    { title: "Id", dataIndex: "id" },
    { title: "Nama", dataIndex: "name" },
    { title: "Status", dataIndex: "status" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Documents",
      render: (item: Project) => (
        <ul className="text-sm list-disc pl-5">
          {item.documents.map((doc, i) => (
            <li key={i}>
              <a
                href={doc.url}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.name}
              </a>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Actions",
      render: (item: Project) => (
        <div className="flex gap-2">
          <Button
            className="text-sm text-blue-600"
            variant="link"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(item.id);
            }}
          >
            <Pencil /> Edit
          </Button>
          <Button
            className="text-sm text-red-500"
            variant="link"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item.id);
            }}
          >
            <Trash /> Delete
          </Button>
        </div>
      ),
    },
  ];

  const [mobileProjects, setMobileProjects] = React.useState<Project[]>([]);
  const [mobilePage, setMobilePage] = React.useState(1);
  const mobileLoader = useRef<HTMLDivElement | null>(null);

  // Fetch for mobile infinite scroll
  const { data: mobileData, isFetching: isMobileFetching } = useProjectsGet({
    params: {
      name: debouncedSearch,
      page: mobilePage,
      perPage: limit,
    },
  });

  useEffect(() => {
    if (mobileData && Array.isArray((mobileData as ProjectResponse)?.data)) {
      setMobileProjects((prev) =>
        mobilePage === 1
          ? (mobileData as ProjectResponse).data
          : [...prev, ...(mobileData as ProjectResponse).data]
      );
    }
  }, [mobileData, mobilePage]);

  // Reset mobileProjects saat search berubah
  useEffect(() => {
    setMobilePage(1);
  }, [debouncedSearch]);

  // Infinite scroll observer
  useEffect(() => {
    if (!mobileLoader.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isMobileFetching &&
          (mobileData as ProjectResponse)?.data?.length === limit
        ) {
          setMobilePage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(mobileLoader.current);
    return () => {
      if (mobileLoader.current) observer.unobserve(mobileLoader.current);
    };
  }, [isMobileFetching, mobileData]);

  return (
    <div className="flex flex-col">
      <Card className="bg-primary/2 border-primary/20 my-4 rounded-lg">
        <div className="flex justify-between items-center">
          <Input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="m-4 max-w-sm"
            placeholder="Search"
          />
          <div className="flex gap-2 items-center m-4">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCcw
                className={isFetching ? "animate-spin" : ""}
                size={18}
              />
              Refresh
            </Button>
            <Button
              className="w-40 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:bg-blue-400"
              onClick={() => setOpen(true)}
            >
              <CirclePlus />
              Add New Project
            </Button>
          </div>
        </div>

        {isFetching ? (
          <div className="text-center flex justify-center items-center text-sm text-blue-500 italic mb-2">
            <RefreshCcw
              className={isFetching ? "animate-spin" : ""}
              size={18}
            />{" "}
            Loading ...
          </div>
        ) : (
          <div className="hidden md:block overflow-hidden">
            <table className="m-4 w-full text-left table-auto min-w-full">
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th className="p-4 border-b" key={index}>
                      <p className="text-md font-bold">{col.title}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectsList.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-secondary border-b"
                    onClick={() => router.push(`/projects/${item.id}`)}
                  >
                    {columns.map((col, colIndex) => (
                      <td className="p-4 py-5" key={colIndex}>
                        {col.dataIndex
                          ? (() => {
                              const value =
                                item[col.dataIndex as keyof Project];
                              if (
                                typeof value === "string" ||
                                typeof value === "number" ||
                                typeof value === "boolean"
                              ) {
                                return (
                                  <p className="text-sm">{String(value)}</p>
                                );
                              }
                              if (Array.isArray(value)) {
                                return (
                                  <p className="text-sm italic text-gray-400">
                                    Array
                                  </p>
                                );
                              }
                              if (typeof value === "object" && value !== null) {
                                return (
                                  <p className="text-sm">
                                    {JSON.stringify(value)}
                                  </p>
                                );
                              }
                              return (
                                <p className="text-sm italic text-gray-400">
                                  Unknown
                                </p>
                              );
                            })()
                          : col.render?.(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3">
              <div className="p-2 text-sm">
                Showing{" "}
                <span className="font-medium text-primary">{limit}</span> of{" "}
                <span className="font-medium">{meta?.totalItems ?? 0}</span>{" "}
                data
              </div>

              <div className="flex flex-wrap items-center gap-1">
                <Button
                  disabled={meta?.currentPage === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  variant="ghost"
                  className="hover:bg-muted"
                >
                  Prev
                </Button>

                {meta?.totalPages &&
                  Array.from({ length: meta.totalPages }, (_, i) => {
                    const isActive = meta.currentPage === i + 1;
                    return (
                      <Button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`
                        px-3 py-1 text-sm
                        ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }
                      `}
                      >
                        {i + 1}
                      </Button>
                    );
                  })}

                <Button
                  disabled={meta?.currentPage === meta?.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  variant="ghost"
                  className="hover:bg-muted"
                >
                  Next
                </Button>
              </div>
            </div>
            {open && (
              <Dialog open={open} onOpenChange={setOpen}>
                <form>
                  <Modal type="add" />
                </form>
              </Dialog>
            )}

            {isEditOpen && (
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <form>
                  <Modal type="edit" id={editProjectId} />
                </form>
              </Dialog>
            )}
          </div>
        )}

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-4 px-4 py-2">
          {mobileProjects.map((item, index) => (
            <Card
              key={item.id}
              className="p-4 shadow-sm rounded-xl bg-primary/2"
            >
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold text-gray-400">
                    ID Project:
                  </p>
                  <p className="break-all text-sm">{item.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">Nama:</p>
                  <p className="text-sm">{item.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">Status:</p>
                  <p className="text-sm capitalize">{item.status}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">
                    Deskripsi:
                  </p>
                  <p className="text-sm whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
          {/* Loader div for intersection observer */}
          <div ref={mobileLoader} />
          {isMobileFetching && (
            <div className="text-center text-xs text-gray-400 py-2">
              Loading...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
