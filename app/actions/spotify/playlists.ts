"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const getUsersPlaylists = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const client = await clerkClient();
  
  // Get the Spotify OAuth token from Clerk
  const tokens = await client.users.getUserOauthAccessToken(userId, "spotify");

  if (!tokens.data || tokens.data.length === 0) {
    throw new Error("No Spotify account connected");
  }

  const accessToken = tokens.data[0].token;

  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
};