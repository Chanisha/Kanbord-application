"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Auth() {
  const [isModalOpen, toggleModal] = useState(false);

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <aside className="w-full md:w-64 bg-white border-b md:border-r md:border-b-0 py-4 md:py-6 px-0 md:px-0 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-stretch">
        <div className="flex items-center md:mb-10">
          <Image
            src="/logo.svg"
            alt=""
            width={140}
            height={15}
            className="pb-4 pl-10 md:pb-0"
            priority
          />
        </div>

        <nav className="flex gap-2 md:flex-col md:space-y-2">
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

      <div className="flex flex-col flex-1">
        <header className="h-16 bg-white border-b flex justify-end items-center px-4 sm:px-6">
          <div className="flex items-center text-black gap-2 text-sm font-medium">
            John Doe
            <Image
              src="/Avatar.svg"
              alt=""
              width={20}
              height={20}
              className="h-7 w-7"
            />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center bg-gray-100 px-4 py-6">
          <div className="text-center max-w-sm w-full">
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-1">
              Nothing to show here
            </h2>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              Create or join a new board
            </p>
            <Button
              onClick={() => toggleModal(true)}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white sm:w-auto"
            >
              Create New Board
            </Button>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-black mb-4">
              Create new board
            </h2>
            <input
              type="text"
              placeholder="Enter board name"
              className="w-full border focus:border-gray-300 focus:outline-none focus:ring-0 rounded border-gray-300 text-black px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                className="w-50 border text-black border-gray-300"
                variant="ghost"
                onClick={() => toggleModal(false)}
              >
                Cancel
              </Button>
              <Button className="cursor-pointer w-50 bg-blue-700 hover:bg-blue-600 text-white">
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
