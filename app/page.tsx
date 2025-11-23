import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-4xl font-bold">You are signed in</h1>
      </div>
    </main>
  );
}
