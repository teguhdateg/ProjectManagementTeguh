'use client';
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Project,
  ProjectResponse,
  useProjectsGet,
} from "@/services/hooks/projects";
import {
  CirclePlus,
  Pencil,
  Trash,
  RefreshCcw,
} from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Modal from "./components/modal";
import { useDebounce } from "@/lib/useDebounce";

const defaultPage = 1;
const limit = 5;

const ResponsiveList: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = React.useState(defaultPage);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isFetching, refetch } = useProjectsGet({
    params: {
      name: debouncedSearch,
      page,
      perPage: limit,
    },
  });

  const projectsList: Project[] = (data as ProjectResponse)?.data ?? [];
  const meta = (data as ProjectResponse)?.meta?.pagination;

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
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button className="text-sm text-blue-600" variant="link">
                  <Pencil /> Edit
                </Button>
              </DialogTrigger>
              <Modal type="edit" />
            </form>
          </Dialog>
          <Button className="text-sm text-red-500" variant="link">
            <Trash /> Delete
          </Button>
        </div>
      ),
    },
  ];

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
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button className="w-40 hover:bg-cyan-400 bg-cyan-500 text-white">
                    <CirclePlus />
                    Add New Project
                  </Button>
                </DialogTrigger>
                <Modal type="add" />
              </form>
            </Dialog>
          </div>
        </div>

        {isFetching && (
          <div className="text-center text-sm text-gray-500 italic mb-2">
            Fetching data...
          </div>
        )}

        {/* Table Desktop */}
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
                      {col.dataIndex ? (
                        (() => {
                          const value = item[col.dataIndex as keyof Project];
                          if (
                            typeof value === "string" ||
                            typeof value === "number" ||
                            typeof value === "boolean"
                          ) {
                            return <p className="text-sm">{String(value)}</p>;
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
                      ) : (
                        col.render?.(item)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-3 bg-card text-card-foreground rounded-lg">
            <div className="p-2 text-sm">
              Showing <span className="font-medium text-primary">{limit}</span> of{" "}
              <span className="font-medium">{meta?.totalItems ?? 0}</span> data
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
                        ${isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"}
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
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-4 px-4 py-2">
          {projectsList.map((item, index) => (
            <Card
              key={index}
              className="p-4 shadow-sm rounded-xl bg-zinc-900 text-white"
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
        </div>
      </Card>
    </div>
  );
};

export default ResponsiveList;
