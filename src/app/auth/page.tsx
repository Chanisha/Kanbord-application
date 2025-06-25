"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BoardView from "@/components/ui/boardview";

export default function AuthPage() {
  const [showModal, setShowModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [boardList, updateBoardList] = useState<string[]>([]);
  const [activeBoard, setActiveBoard] = useState<string | null>(null);

  const createBoard = () => {
    if (newBoardName.trim() === "") return;
    updateBoardList((prevBoards) => [...prevBoards, newBoardName]);
    setNewBoardName("");
    setShowModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <aside className="w-full md:w-64 bg-white border-b md:border-r md:border-b-0 py-4 px-0 flex flex-col items-center md:items-stretch">
        <div className="flex items-center justify-center mb-8">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={140}
            height={15}
            className="pl-2 pr-5"
            priority
          />
        </div>

        <nav className="flex flex-col gap-2 md:space-y-2 px-4">
          <SidebarLink
            icon={
              <Image
                src="/House.svg"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5"
              />
            }
            label="Home"
            isActive
          />
          <SidebarLink
            icon={
              <Image
                src="/NotePencil.svg"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5"
              />
            }
            label="Boards"
          />
          <SidebarLink
            icon={
              <Image
                src="/UserCircle.svg"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5"
              />
            }
            label="Profile"
          />
        </nav>
      </aside>

      {activeBoard ? (
        <div className="flex-1">
          <BoardView
            boardName={activeBoard}
            goBack={() => setActiveBoard(null)}
          />
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <header className="h-16 bg-white border-b flex justify-end items-center px-4 sm:px-6">
            <div className="flex items-center text-black gap-2 text-sm font-medium">
              John Doe
              <Image
                src="/Avatar.svg"
                alt="User Avatar"
                width={20}
                height={20}
                className="h-7 w-7"
              />
            </div>
          </header>

          <main className="flex-1 bg-gray-100 px-4 py-6">
            <div className="mb-6 text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-1">
                {boardList.length === 0
                  ? "Nothing to show here"
                  : "Recently Viewed (Last 3 Boards)"}
              </h2>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                {boardList.length === 0 ? "Create or join a new board" : ""}
              </p>
              <Button
                onClick={() => setShowModal(true)}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white sm:w-auto"
              >
                + New Board
              </Button>
            </div>

            {boardList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
                {boardList.slice(-3).map((boardTitle, i) => (
                  <div
                    key={`board-${i}`}
                    className="bg-white shadow rounded-md p-4 text-left flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-black leading-snug mb-1">
                        {boardTitle}
                      </h3>
                      <p className="text-gray-500 text-xs">Owned by you</p>
                    </div>
                    <div className="flex justify-between items-center text-sm text-blue-600 mt-4">
                      <div className="flex font-semibold gap-4">
                        <div className="flex items-center gap-1 cursor-pointer text-blue-600 hover:underline">
                          <Image
                            src="/InviteIcon.svg"
                            alt=""
                            width={16}
                            height={16}
                          />
                          <span>Invite</span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer text-blue-600 hover:underline">
                          <Image
                            src="/EditIcon.svg"
                            alt=""
                            width={16}
                            height={16}
                          />
                          <span>Edit board</span>
                        </div>
                      </div>
                      <span
                        onClick={() => setActiveBoard(boardTitle)}
                        className="cursor-pointer font-medium text-blue-600 hover:underline"
                      >
                        Open
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-black mb-4">
              Create a new board
            </h2>
            <input
              type="text"
              placeholder="Name your board"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              className="w-full border focus:border-gray-300 focus:outline-none focus:ring-0 rounded border-gray-300 text-black px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                className="w-50 border text-black border-gray-300"
                variant="ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer w-50 bg-blue-700 hover:bg-blue-600 text-white"
                onClick={createBoard}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarLink({
  icon,
  label,
  isActive = false,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "justify-start rounded-r-full text-sm transition",
        isActive
          ? "bg-blue-100 text-blue-800 font-medium border-l-4 h-14 w-50 border-blue-600"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      {icon}
      {label}
    </Button>
  );
}
