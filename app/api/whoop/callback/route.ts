import { handleWhoopCallback } from "@/lib/whoop";
import { cookies } from "next/headers";
import { REDIRECT_URI } from "@/constants";

export async function GET(request: Request) {
  console.log("Received callback request to:", REDIRECT_URI);

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  if (error) {
    console.error("OAuth error:", error, error_description);
    return Response.json(
      {
        error: error_description || error,
      },
      { status: 400 }
    );
  }

  const storedState = cookies().get("whoop_state")?.value;
  console.log("Stored state:", storedState, "Received state:", state);

  if (!storedState || storedState !== state) {
    return Response.json({ error: "Invalid state" }, { status: 400 });
  }

  if (!code) {
    return Response.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const tokens = await handleWhoopCallback(code);

    cookies().set("whoop_access_token", tokens.access_token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: tokens.expires_in,
    });

    cookies().set("authenticated", "true", {
      httpOnly: false,
      sameSite: "lax",
      maxAge: tokens.expires_in,
    });

    if (tokens.refresh_token) {
      cookies().set("whoop_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return Response.redirect("http://localhost:3000/#whoop");
  } catch (error) {
    console.error("WHOOP callback error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to handle callback",
      },
      { status: 500 }
    );
  }
}
