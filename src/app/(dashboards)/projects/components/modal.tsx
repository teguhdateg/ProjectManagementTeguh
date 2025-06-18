"use client";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useUploadFile } from "@/services/hooks/uploadFile";
import { useProjectDelete, useProjectPost, useProjectPut, useProjectsGetById } from "@/services/hooks/projects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  startDate: z.date(),
  endDate: z.date(),
  teamEmails: z
    .array(z.string().email({ message: "Invalid email format" }))
    .min(1, { message: "At least one email is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  file: z
    .custom<FileList>((value) => {
      if (typeof window === "undefined") return true; // SSR: skip
      return value instanceof FileList && value.length > 0;
    }, {
      message: "File is required",
    }),
});

type FormData = z.infer<typeof formSchema>;

type UploadedFile = {
    message: string;
    data: {
      url: string;
      public_id: string;
      resource_type: string;
    };
};

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
interface ModalProps {
  type: "add" | "edit";
  id?: string;
}
export default function Modal({ type, id }: ModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      teamEmails: [],
      status: "",
      file: undefined as unknown as FileList,
    },
  });

  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  console.log(type)
  const { data: projectDetail } = useProjectsGetById({ id: id ?? "" }) as { data: ProjectResponse };

  useEffect(() => {
    if (type === "edit" && projectDetail) {
      console.log(projectDetail.data)
      form.setValue("name", projectDetail.data.name);
      form.setValue("description", projectDetail.data.description);
      form.setValue("startDate", new Date(projectDetail.data.startDate));
      form.setValue("endDate", new Date(projectDetail.data.endDate));
      form.setValue("status", projectDetail.data.status);
      form.setValue("teamEmails", projectDetail.data.teams.map((team) => team.email));

      setUploadedFile({
        message: "Already uploaded",
        data: {
          url: projectDetail.data.documents?.[0]?.url ?? "",
          public_id: "",
          resource_type: "",
        },
      });
    }
  }, [type, projectDetail, form]);

  const { mutateAsync } = useUploadFile({
    onSuccess: (res) => {
      console.log(res);
      const data = res;
      setUploadedFile(data);
    },
    onError: (err) => {
      console.error("Upload failed:", err);
    },
  });

  const{mutate: addProject, isError: isAddError} = useProjectPost({
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error("Upload failed:", err);
    },
  })

  const{mutate: editProject, isError} = useProjectPut({
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error("Upload failed:", err);
    },
  })

  async function onSubmit(values: FormData) {
    setLoading(true);

    const file = values.file?.[0];
    if (!file) {
      console.error("❌ Tidak ada file yang dipilih.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
      name: values.name,
      description: values.description,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      status: values.status,
      teamEmails: values.teamEmails,
      documents: [
        {
          name: file.name,
          url: uploadedFile?.data?.url || ""
        }
      ],
    };

      await type === "add" ? addProject(payload) : editProject({...payload, id: projectDetail.data.id ?? "",});
      console.log("✅ Final Payload:", payload);
    } catch (err) {
      console.error("❌ Upload gagal saat submit:", err);
    }

    setLoading(false);
  }
  return (
    <>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{type==="add" ? "Add New Project" : "Edit Project"}</DialogTitle>
            <DialogDescription>
              Create your new project. Click save when you’re done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Project Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-2">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "dd-MM-yyyy") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                          disabled={(date) =>
                            date > new Date("2100-01-01") || date < new Date("2000-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-2">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "dd-MM-yyyy") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                          disabled={(date) =>
                            date > new Date("2100-01-01") || date < new Date("2000-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Team Emails */}
              <FormField
                control={form.control}
                name="teamEmails"
                render={() => (
                  <FormItem className="mb-2">
                    <FormLabel>Team Emails (comma separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@example.com, user2@example.com"
                        value={form.watch("teamEmails").join(", ")} // ✅ tampilkan nilai
                        onChange={(e) => {
                          const emails = e.target.value
                            .split(",")
                            .map((email) => email.trim());
                          form.setValue("teamEmails", emails);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-2">
                    <FormLabel>Status</FormLabel>
                    <Select 
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="active">active</SelectItem>
                        <SelectItem value="on_hold">on_hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Upload */}
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={async (e) => {
                        const files = e.target.files as FileList;
                        if (!files || files.length === 0) return;
                        form.setValue("file", files); 
                        try {
                            setLoading(true);
                            const result = await mutateAsync({
                            body: {
                                file: files[0],
                                folder: "projects",
                            },
                            });
                        } catch (err) {
                            console.error("❌ Gagal upload dari onchange:", err);
                        } finally {
                            setLoading(false);
                        }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Footer */}
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
    </>
  );
}
