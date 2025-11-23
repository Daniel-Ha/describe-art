import { Suspense } from "react";
import { login } from "../lib/actions/auth";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <Suspense>
          <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-4xl font-bold">You are not signed in</h1>
            <button onClick={login}>Sign in with Spotify</button>
          </div>
        </Suspense>
      </div>
    </main>
  );
}
