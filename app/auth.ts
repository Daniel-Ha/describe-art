import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const {auth, handlers, signIn, signOut} = NextAuth({
    providers: [SpotifyProvider]
})