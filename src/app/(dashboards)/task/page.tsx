"use client";

import { Card } from "@/components/ui/card";
import { useTaskGet } from "@/services/hooks/task";
import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "react-day-picker";
import SelectProject from "@/components/SelectProject";

type Task = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  assignee: {
    name: string;
    email: string;
  };
};

type TaskResponse = {
  data: Task[];
  meta: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      perPage: number;
    };
  };
};

const columns: ColumnDef<Task>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return status.replace("_", " ").toUpperCase();
    },
  },
  {
    header: "Priority",
    accessorKey: "priority",
    cell: ({ getValue }) => {
      const priority = getValue() as string;
      return priority.toUpperCase();
    },
  },
  {
    header: "Start Date",
    accessorKey: "startDate",
    cell: ({ getValue }) =>
      format(new Date(getValue() as string), "dd-MM-yyyy"),
  },
  {
    header: "End Date",
    accessorKey: "endDate",
    cell: ({ getValue }) =>
      format(new Date(getValue() as string), "dd-MM-yyyy"),
  },
  {
    header: "Assignee",
    accessorKey: "assignee.name",
    cell: ({ row }) => row.original.assignee.name,
  },
  {
    header: "Actions",
    cell(props) {
      const task = props.row.original;
      return (
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => alert(`Edit Task: ${task.name}`)}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => alert(`Delete Task: ${task.name}`)}
          >
            Delete
          </button>
        </div>
      );
    },
  },
];

const defaultPage = 1;
const limit = 5;

export default function Task() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    "54c2f3f8-cb33-4265-a1d6-486b7e4a2d92"
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: defaultPage - 1,
    pageSize: limit,
  });

  const { data, isFetching, refetch } = useTaskGet({
    params: {
      projectId: selectedProjectId,
      status: "",
      priority: "",
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    },
  }) as {
    data: TaskResponse | undefined;
    isFetching: boolean;
    refetch: () => void;
  };

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: {
      pagination,
    },
    pageCount: data?.meta.pagination.totalPages ?? 0,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  return (
    <>
      <Card className="mt-5 p-4">
        <h2 className="text-xl font-bold mb-4">Task List</h2>
        {isFetching ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex flex-row justify-between mb-4">
              <div className="flex flex-row mb-4 items-center space-x-2">
                <div>
                  <Label className="font-bold mb-1">Project</Label>
                  <SelectProject
                    selectedProjectId={selectedProjectId}
                    onSelectProject={(projectId) => {
                      setSelectedProjectId(projectId);
                      setPagination((prev) => ({
                        ...prev,
                        pageIndex: 0, // reset ke halaman 1 jika perlu
                      }));
                    }}
                  />
                </div>
                <div>
                  <Label className="font-bold mb-1">Status</Label>
                  <Input placeholder="Search" />
                </div>
                <div>
                  <Label className="font-bold mb-1">Priority</Label>
                  <Input placeholder="Search" />
                </div>
              </div>
              <div className="flex flex-row justify-end items-end mb-4">
                <button
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 text-white rounded-md"
                  onClick={() => alert("Add New Task")}
                >
                  Add New Task
                </button>
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="text-sm font-semibold">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-3 border">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-secondary">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 text-sm border">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center p-3 text-sm">
              <div>
                Showing {table.getRowModel().rows.length} of{" "}
                {data?.meta.pagination.totalItems} data
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => table.setPageIndex(i)}
                    className={`px-3 py-1 rounded border text-sm ${
                      table.getState().pagination.pageIndex === i
                        ? "bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500"
                        : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
