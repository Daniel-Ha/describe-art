import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <Suspense>
          <h2 className="text-2xl font-bold">You need login!</h2>
        </Suspense>
      </div>
    </main>
  );
}
