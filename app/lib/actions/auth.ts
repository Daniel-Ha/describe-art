"use server";

import { signIn, signOut } from "@/app/auth";

export const login = async () => {
    await signIn("spotify", { redirectTo: "/" });
}

export const logout = async () => {
    await signOut({ redirectTo: "/" });
}