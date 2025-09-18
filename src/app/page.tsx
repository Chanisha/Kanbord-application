"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AuthForm from "@/components/ui/auth-form";
import ClientOnly from "@/components/ClientOnly";
import { User } from "@/lib/api";

export default function Home() {
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    // Redirect to auth page after successful authentication
    window.location.href = "/auth";
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white px-4 sm:px-10 md:px-20 lg:px-32 pb-50 gap-8 sm:gap-10 overflow-hidden">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center text-black">
        Welcome to Your Note Management Board
      </h1>

      <ClientOnly>
        <button
          onClick={() => setIsAuthFormOpen(true)}
          className="px-5 py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          Continue with Google
        </button>
      </ClientOnly>

      <div className="absolute bottom-0 left-0 w-full">
        <Image
          src="/illustration.png"
          alt=""
          width={1920}
          height={300}
          priority
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>

      <ClientOnly>
        <AuthForm
          isOpen={isAuthFormOpen}
          onClose={() => setIsAuthFormOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </ClientOnly>
    </div>
  );
}
