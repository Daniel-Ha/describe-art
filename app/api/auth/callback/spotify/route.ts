import { handlers } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("req", req);
  const url = new URL(req.url);
  const querySnapshot = Object.fromEntries(url.searchParams.entries());

  console.info("[Spotify callback] incoming query", querySnapshot);

  const nextAuthResponse = await handlers.GET(req);

  console.info("[Spotify callback] NextAuth response", {
    status: nextAuthResponse.status,
    redirected: nextAuthResponse.redirected,
    location: nextAuthResponse.headers.get("location"),
  });

  return nextAuthResponse;
}
