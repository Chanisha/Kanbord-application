"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white px-4 sm:px-10 md:px-20 lg:px-32 pb-50  gap-8 sm:gap-10 overflow-hidden">
      <main className="pb-5 sm:pt-10">
        <Image src="/logo.svg" alt="" width={140} height={15} priority />
      </main>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center text-black">
        Welcome to Kanbord
      </h1>

      <button
        onClick={() => router.push("/auth")}
        className="px-5 py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-md hover:bg-blue-700 transition"
      >
        Continue with Google
      </button>

      <div className="absolute bottom-0 left-0 w-full">
        <Image
          src="/illustration.png"
          alt=""
          width={1920}
          height={300}
          layout="responsive"
          priority
        />
      </div>
    </div>
  );
}
