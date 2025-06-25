import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type BoardViewProps = {
  boardName: string;
  goBack: () => void;
};

const columnTitles = ["Unassigned", "In Development", "Pending Review", "Done"];

export default function BoardView({ boardName, goBack }: BoardViewProps) {
  const [boardData, setBoardData] = useState<Record<string, string[]>>({
    Unassigned: [],
    "In Development": [],
    "Pending Review": [],
    Done: [],
  });

  const handleAddClick = (colName: string) => {
    const newTitle = prompt("What's the task?");
    if (!newTitle || newTitle.trim() === "") {
      return;
    }

    setBoardData((prevState) => {
      const updatedColumn = [...prevState[colName], newTitle];
      return {
        ...prevState,
        [colName]: updatedColumn,
      };
    });
  };

  return (
    <div className="p-4 bg-gray-200 min-h-screen flex flex-col">
      <div className="flex justify-between items-start border-b pb-3 mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-bold text-black">
              Board name goes here
            </h1>
            <div className="flex items-center gap-1 text-blue-600 cursor-pointer hover:underline">
              <Image src="/InviteIcon.svg" alt="" width={16} height={16} />
              <span>Invite</span>
            </div>
          </div>
        </div>

        <div className="w-px bg-gray-300 mx-4 self-stretch" />

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-800">John Doe</span>
            <Image
              src="/Avatar.svg"
              alt=""
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>
          <div className="flex items-center gap-1 text-blue-600 cursor-pointer hover:underline text-sm"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {columnTitles.map((colTitle) => {
          const tasksForThisCol = boardData[colTitle] || [];

          return (
            <div
              key={colTitle}
              className="bg-gray-100 rounded-md p-3 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-semibold text-gray-800">
                  {colTitle}
                </h2>
                <span className="text-sm text-gray-500">
                  {tasksForThisCol.length}
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                {tasksForThisCol.map((taskText, idx) => (
                  <div
                    key={`${colTitle}-${idx}`}
                    className="bg-white rounded border p-2 text-sm"
                  >
                    <strong className="block mb-1 text-black">
                      {taskText}
                    </strong>
                    <p className="text-xs text-gray-500">Description TBD</p>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={() => handleAddClick(colTitle)}
                className="bg-blue-100 text-blue-700 hover:text-blue-800 hover:bg-blue-100 text-sm flex items-center gap-1 w-full justify-center font-semibold rounded-md py-2"
              >
                <span className="text-lg">+</span>
                <span>Add task</span>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
