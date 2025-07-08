"use client";

import Image from "next/image";

export default function Navbar() {
  return (
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
  );
}
