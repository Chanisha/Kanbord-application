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
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

type BoardViewProps = {
  boardName: string;
  goBack: () => void;
};

type Task = {
  title: string;
  description: string;
  deadline?: string;
  assignee?: string;
};

const columnTitles = ["Unassigned", "In Development", "Pending Review", "Done"];

export default function BoardView({ boardName, goBack }: BoardViewProps) {
  const [boardData, setBoardData] = useState<Record<string, Task[]>>({
    Unassigned: [],
    "In Development": [],
    "Pending Review": [],
    Done: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [calendarDate, setCalendarDate] = useState<Date | undefined>();

  const openModal = (col: string) => {
    setSelectedColumn(col);
    setShowModal(true);
    setTaskTitle("");
    setTaskDesc("");
    setTaskAssignee("");
    setCalendarDate(undefined);
  };

  const addTask = () => {
    if (!taskTitle.trim()) return;

    const deadline = calendarDate ? format(calendarDate, "yyyy-MM-dd") : "";

    const newTask: Task = {
      title: taskTitle,
      description: taskDesc,
      deadline,
      assignee: taskAssignee,
    };

    setBoardData((prev) => ({
      ...prev,
      [selectedColumn!]: [...prev[selectedColumn!], newTask],
    }));

    setShowModal(false);
  };

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
              <Image
                src="/InviteIcon.svg"
                alt="Invite"
                width={16}
                height={16}
              />
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
        {columnTitles.map((colTitle) => {
          const tasks = boardData[colTitle] || [];

          return (
            <div key={colTitle} className="bg-white rounded-md p-3 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-semibold text-gray-800">
                  {colTitle}
                </h2>
                <span className="text-sm text-gray-500">{tasks.length}</span>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                {tasks.map((task, idx) => (
                  <div
                    key={`${colTitle}-${idx}`}
                    className="bg-gray-100 rounded border p-2 text-sm"
                  >
                    <strong className="block mb-1 text-black">
                      {task.title}
                    </strong>
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {task.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={() => openModal(colTitle)}
                className="bg-blue-100 text-blue-700 hover:text-blue-800 hover:bg-blue-100 text-sm flex items-center gap-1 w-full justify-center font-semibold rounded-md py-2"
              >
                <span className="text-lg">+</span>
                <span>Add task</span>
              </Button>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg text-black mb-4">
              Add new task to:{" "}
              <span className=" font-semibold text-black">
                {selectedColumn}
              </span>
            </h2>

            <input
              type="text"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-0 placeholder-black border-gray-300 text-black text-sm"
            />

            <div className="mb-3 relative">
              <label className="text-sm font-medium text-black block mb-1">
                Select deadline
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex justify-between items-center px-3 py-2 border rounded text-sm text-black border-gray-300 focus:outline-none"
                  >
                    <span>
                      {calendarDate
                        ? format(calendarDate, "PPP")
                        : "Select deadline"}
                    </span>
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 mt-2 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={setCalendarDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <select
              value={taskAssignee}
              onChange={(e) => setTaskAssignee(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded text-sm text-black border-gray-300 focus:outline-none"
            >
              <option value="">Assign to:</option>
              <option value="John">John</option>
              <option value="Jane">Jane</option>
              <option value="Alex">Alex</option>
            </select>

            <textarea
              placeholder="Enter description here"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full mb-4 px-3 py-2 border focus:outline-none focus:ring-0 placeholder-gray-500 border-gray-300 rounded text-black text-sm resize-none h-24"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="border w-50 border-gray-300 text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={addTask}
                className="bg-blue-700 w-50 text-white hover:bg-blue-800 disabled:opacity-50"
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
