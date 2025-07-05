"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const taskSchema = z.object({
  taskTitle: z.string().min(1, "Task Title is required"),
  taskDescription: z.string().min(1, "Description is required"),
  assignedTo: z.string().optional(),
  deadline: z.date().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface BoardViewProps {
  boardName: string;
  goBack: () => void;
}

interface Task {
  title: string;
  description: string;
  deadline?: string;
  assignee?: string;
}

const listHeaders = ["Unassigned", "In Development", "Pending Review", "Done"];

export default function BoardView({ boardName, goBack }: BoardViewProps) {
  const [columnOrder, setColumnOrder] = useState<string[]>(listHeaders);
  const [taskColumns, setTaskColumns] = useState<Record<string, Task[]>>({
    Unassigned: [],
    "In Development": [],
    "Pending Review": [],
    Done: [],
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [openTask, setOpenTask] = useState<{
    column: string;
    task: Task;
  } | null>(null);
  const [isEditColumnModalOpen, setEditColumnModalOpen] = useState(false);
  const [columnToEdit, setColumnToEdit] = useState<string | null>(null);
  const [columnNameInput, setColumnNameInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const handleOpenModal = (
    columnName: string,
    taskToPrefill?: Task,
    taskIndex?: number
  ) => {
    setActiveColumn(columnName);
    setIsModalVisible(true);
    setEditIdx(taskIndex ?? null);
    reset({
      taskTitle: taskToPrefill?.title || "",
      taskDescription: taskToPrefill?.description || "",
      assignedTo: taskToPrefill?.assignee || "",
      deadline: taskToPrefill?.deadline
        ? new Date(taskToPrefill.deadline)
        : undefined,
    });
  };

  const saveTask = handleSubmit((data) => {
    const newEntry: Task = {
      title: data.taskTitle,
      description: data.taskDescription,
      assignee: data.assignedTo,
      deadline: data.deadline ? format(data.deadline, "yyyy-MM-dd") : "",
    };

    setTaskColumns((prev) => {
      const colData = [...prev[activeColumn!]];
      if (editIdx !== null) {
        colData[editIdx] = newEntry;
      } else {
        colData.push(newEntry);
      }
      return { ...prev, [activeColumn!]: colData };
    });

    setIsModalVisible(false);
    setEditIdx(null);
  });

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="bg-white border-b">
        <div className="flex justify-end items-center px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-black">
            John Doe
            <Image
              src="/Avatar.svg"
              alt=""
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-t">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold text-black">{boardName}</h1>
            <div className="flex items-center gap-1 text-blue-600 text-sm cursor-pointer hover:underline">
              <Image src="/InviteIcon.svg" alt="" width={16} height={16} />
              <span>Invite</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-blue-600 text-sm cursor-pointer hover:underline">
            <Image src="/EditIcon.svg" alt="Edit" width={16} height={16} />
            <span>Edit board</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 py-6">
        {columnOrder.map((idx) => {
          const tasks = taskColumns[idx] || [];
          return (
            <div key={idx} className="bg-white rounded-md p-3 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-semibold text-gray-800">{idx}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{tasks.length}</span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditColumnModalOpen(true);
                          setColumnToEdit(idx);
                          setColumnNameInput(idx);
                        }}
                      >
                        Edit name
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                {tasks.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setOpenTask({ column: idx, task: item })}
                    className="cursor-pointer bg-gray-100 rounded border p-2 text-sm hover:bg-gray-200"
                  >
                    <strong className="block mb-1 text-black">
                      {item.title}
                    </strong>
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {item.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={() => handleOpenModal(idx)}
                className="bg-blue-100 curosor-pointer text-blue-700 hover:text-blue-800 hover:bg-blue-100 text-sm flex items-center gap-1 w-full justify-center font-semibold rounded-md py-2"
              >
                <span className="text-lg">+</span>
                <span>Add task</span>
              </Button>
            </div>
          );
        })}
      </div>

      {openTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-black">
                  Viewing task to:{" "}
                  <span className="font-semibold">{openTask.column}</span>
                </p>
                <p className="text-lg font-bold text-black">
                  {openTask.task.title}
                </p>
              </div>

              <button
                className="text-blue-600 pl-26 cursor-pointer font-semibold text-sm hover:underline"
                onClick={() => {
                  const taskIndex = taskColumns[openTask.column].findIndex(
                    (t) =>
                      t.title === openTask.task.title &&
                      t.description === openTask.task.description &&
                      t.deadline === openTask.task.deadline &&
                      t.assignee === openTask.task.assignee
                  );

                  handleOpenModal(openTask.column, openTask.task, taskIndex);
                  setOpenTask(null);
                }}
              >
                Edit task
              </button>

              <button onClick={() => setOpenTask(null)}>
                <Image
                  src="/closeIcon.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="cursor-pointer"
                />
              </button>
            </div>

            <div className="mb-2">
              <p className="text-xs text-gray-400">Assigned to</p>
              <p className="text-sm text-black">
                {openTask.task.assignee || "Unassigned"}
              </p>
            </div>

            <div className="mb-2">
              <p className="text-xs text-gray-400">Due date & time</p>
              <p className="text-sm text-red-600">
                {openTask.task.deadline
                  ? `Due now • ${format(
                      new Date(openTask.task.deadline),
                      "MM/dd/yyyy • hh:mmaaa"
                    )}`
                  : "No deadline set"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {openTask.task.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      )}

      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg text-black mb-4">
              {editIdx !== null ? "Edit task in:" : "Add new task to:"}{" "}
              <span className="font-semibold text-black">{activeColumn}</span>
            </h2>

            <input
              {...register("taskTitle")}
              placeholder="Enter Task Title"
              className="w-full mb-1 px-3 py-2 border rounded placeholder-black border-gray-300 text-black text-sm"
            />
            {errors.taskTitle && (
              <p className="text-red-500 text-xs mb-2">
                {errors.taskTitle.message}
              </p>
            )}

            <div className="mb-3 relative">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex justify-between items-center px-3 py-2 border rounded text-sm text-black border-gray-300"
                  >
                    <span>
                      {watch("deadline")
                        ? format(
                            watch("deadline") as Date,
                            "MM/dd/yyyy • hh:mmaaa"
                          )
                        : "Select deadline"}
                    </span>
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 mt-2 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={watch("deadline")}
                    onSelect={(date) => setValue("deadline", date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <select
              {...register("assignedTo")}
              className="w-full mb-3 px-3 py-2 border rounded text-sm text-black border-gray-300"
            >
              <option value="">Assigned to:</option>
              <option value="John">John</option>
              <option value="Jane">Jane</option>
              <option value="Alex">Alex</option>
            </select>

            <textarea
              {...register("taskDescription")}
              placeholder="Enter description here"
              className="w-full px-3 py-2 border placeholder-gray-500 border-gray-300 rounded text-black text-sm resize-none h-24"
            />
            {errors.taskDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.taskDescription.message}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsModalVisible(false);
                  setEditIdx(null);
                }}
                className="border w-50 border-gray-300 text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={saveTask}
                className="bg-blue-700 text-white w-50 hover:bg-blue-800 disabled:opacity-50"
              >
                {editIdx !== null ? "Save Changes" : "Add Task"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isEditColumnModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
            <h2 className="text-md font-semibold text-black mb-3">
              Edit column
            </h2>
            <input
              type="text"
              value={columnNameInput}
              onChange={(e) => setColumnNameInput(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded text-sm text-black"
              placeholder="Column name goes here"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                className="border border-gray-300 text-black"
                onClick={() => setEditColumnModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  if (!columnToEdit || !columnNameInput.trim()) return;

                  setTaskColumns((prev) => {
                    const updated = { ...prev };
                    updated[columnNameInput] = updated[columnToEdit];
                    delete updated[columnToEdit];
                    return updated;
                  });

                  setColumnOrder((prev) =>
                    prev.map((col) =>
                      col === columnToEdit ? columnNameInput : col
                    )
                  );

                  setEditColumnModalOpen(false);
                  setColumnToEdit(null);
                  setColumnNameInput("");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
