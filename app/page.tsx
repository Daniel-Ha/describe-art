import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { getUsersPlaylists } from "./actions/spotify/playlists";

export default async function Home() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Describe Art</h1>
      </div>
    </main>
  );
}

async function PlaylistsSection() {
  try {
    const playlists = await getUsersPlaylists();
    return (
      <div>
        <h2 className="text-xl font-semibold">Your Playlists:</h2>
        <ul>
          {playlists.items?.map((playlist: { id: string; name: string }) => (
            <li key={playlist.id}>{playlist.name}</li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    return (
      <p className="text-red-500">Connect your Spotify account in settings</p>
    );
  }
}
