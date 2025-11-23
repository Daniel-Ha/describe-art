import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

console.log("NEXTAUTH_URL", process.env.NEXTAUTH_URL)
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,playlist-modify-private,playlist-modify-public",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
        if(account){
            token.access_token = account.access_token;
        }
        return token;
    },
    async session({ session, token }) {
        return {
            ...session,
            token
        };
    },
}
});
