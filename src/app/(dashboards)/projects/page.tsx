"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";
import { useProjectsGet } from "@/services/hooks/projects";
import { set } from "zod";

export interface Project {
  id: number;
  name: string;
  status: string;
  description: string;
}

export interface ProjectResponse {
  data: Project[];
}

const ResponsiveList: React.FC = () => {
  const { data } = useProjectsGet({
    params: {
      params: {
        page: 1,
        perPage: 10,
      },
    },
  });
const projectsList: Project[] = (data as ProjectResponse)?.data ?? [];
console.log(projectsList, "data")

  const columns: {
  title: string;
  dataIndex?: keyof Project;
  render?: () => React.ReactNode;
  }[] = [
  { title: "id", dataIndex: "id" },
  { title: "Nama", dataIndex: "name" },
  { title: "Status", dataIndex: "status" },
  { title: "Description", dataIndex: "description" },
  {
    title: "",
    render: () => {
      return <Button className="link">Edit</Button>;
    },
  },
];

  return (
    <div className="flex flex-col">
      <div className="flex justify-between ">
        <h1 className="m-4 font-bold">All Projects</h1>
        <Button type="button" className="w-50 hover:bg-lime-400 bg-lime-500 text-white m-4">Add New Project</Button>
    </div>
    <Card className="m-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden">
        <table className="m-4 w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th className="p-4 border-b" key={index}>
                  <p className="text-sm font-bold">{col.title}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projectsList.map((item: Project, index: number) => (
              <tr className="hover:bg-secondary border-b" key={index}>
                {columns.map((col, colIndex) => (
                  <td className="p-4 py-5" key={colIndex}>
                    {col.dataIndex ? (
                      <p className="text-sm">{item[col.dataIndex]}</p>
                    ) : (
                      col.render?.()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4 m-4 gap-4">
        {projectsList.map((item: Project, index: number) => (
          <Card key={index} className="p-4 shadow-sm rounded-lg">
            <div className="flex justify-between m-2 gap-2">
              <p className="text-sm font-bold">Id Project:</p>
              <p>{item.id}</p> 
            </div>
            <div className="flex justify-between m-2 gap-2">
              <p className="text-sm font-bold">Nama:</p>
              <p>{item.name}</p> 
            </div>
            <div className="flex justify-between m-2 gap-2">
              <p className="text-sm font-bold">Status:</p>
              <p>{item.status}</p> 
            </div>
            <div className="flex justify-between m-2 gap-2">
              <p className="text-sm font-bold">Description:</p>
              <p>{item.description}</p> 
            </div>
          </Card>
        ))}
      </div>
    </Card>
    </div>
  );
};

export default ResponsiveList;
