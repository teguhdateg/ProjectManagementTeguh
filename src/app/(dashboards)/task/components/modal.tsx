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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useUploadFile } from "@/services/hooks/uploadFile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskPost } from "@/services/hooks/task";

const formSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  startDate: z.date(),
  endDate: z.date(),
  status: z.string().min(1, { message: "Status is required" }),
  assigneeId: z.string().min(1, { message: "Status is required" }),
  priority: z.string().min(1, { message: "Status is required" }),
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
interface TaskModalProps {
  type: "add" | "edit";
  projectId?: string;
  taskId?: string;
}
export default function TaskModal({ type, projectId, taskId }: TaskModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      assigneeId: "",
      status: "",
      priority: "",
    },
  });

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (type === "edit" && projectDetail) {
  //     console.log(projectDetail.data);
  //     form.setValue("name", projectDetail.data.name);
  //     form.setValue("description", projectDetail.data.description);
  //     form.setValue("startDate", new Date(projectDetail.data.startDate));
  //     form.setValue("endDate", new Date(projectDetail.data.endDate));
  //     form.setValue("status", projectDetail.data.status);

  //   }
  // }, [type, projectDetail, form]);

  const { mutateAsync } = useUploadFile({
    onSuccess: (res) => {
      console.log(res);
      const data = res;
    },
    onError: (err) => {
      console.error("Upload failed:", err);
    },
  });

  const { mutate: addTask } = useTaskPost({
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error("Upload failed:", err);
    },
  });

  // const { mutate: editProject } = useProjectPut({
  //   onSuccess: (res) => {
  //     console.log(res);
  //   },
  //   onError: (err) => {
  //     console.error("Upload failed:", err);
  //   },
  // });

  async function onSubmit(values: FormData) {
    setLoading(true);

    try {
      const payload = {
        name: values.name,
        description: values.description,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        status: values.status,
        priority: values.priority,
        // assigneeId: values.assigneeId,
        assigneeId: "398cbad3-62c2-4790-b4a9-e6f1cbd525f1",
      };
      addTask({
        ...payload,
        projectId: projectId || "",
      });
      // (await type) === "add"
      //   ? addProject(payload)
      //   : editProject({ ...payload, id: projectDetail.data.id ?? "" });
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
          <DialogTitle>
            {type === "add" ? "Add New Task" : "Edit Task"}
          </DialogTitle>
          <DialogDescription>
            Create your new Task. Click save when you’re done.
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
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} />
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
                          {field.value ? (
                            format(field.value, "dd-MM-yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
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
                          date > new Date("2100-01-01") ||
                          date < new Date("2000-01-01")
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
                          {field.value ? (
                            format(field.value, "dd-MM-yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
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
                          date > new Date("2100-01-01") ||
                          date < new Date("2000-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
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
                  <Select value={field.value} onValueChange={field.onChange}>
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

            {/* Prioroty */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="flex flex-col mb-2">
                  <FormLabel>Prioroty</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team Emails */}
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (              
                <FormItem className="flex flex-col mb-2">         
                  <FormLabel>assigneeId</FormLabel>
                  <Input placeholder="Enter assigneeId" {...field} />
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
              <Button
                className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </>
  );
}
