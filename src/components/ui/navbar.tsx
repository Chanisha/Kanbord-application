"use client";

import Image from "next/image";
import { apiService, User } from "@/lib/api";

interface NavbarProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const displayName = user ? user.fullName : "John Doe";
  const userInitial = user ? user.firstName.charAt(0).toUpperCase() : "J";

  const handleLogout = () => {
    apiService.logout();
    if (onLogout) {
      onLogout();
    } else {
      // Default behavior - redirect to home page
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center text-black gap-3 text-sm font-medium">
      <span>{displayName}</span>
      <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
        {userInitial}
      </div>
      {user && (
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-100 transition-colors"
        >
          Logout
        </button>
      )}
    </div>
  );
}
