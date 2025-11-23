"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return (
      <main className="flex items-center justify-center md:h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <h1 className="text-4xl font-bold">You are signed in</h1>
        </div>
      </main>
    );
  } else {
    redirect("/login");
  }
}
