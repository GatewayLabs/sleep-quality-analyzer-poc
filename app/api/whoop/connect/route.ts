import { getWhoopAuthUrl } from "@/lib/whoop";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const { url, state } = await getWhoopAuthUrl();

    cookies().set("whoop_state", state, {
      httpOnly: true,
      sameSite: "lax",
    });

    console.log("Redirecting to WHOOP auth URL:", url);
    return Response.redirect(url);
  } catch (error) {
    console.error("Connect error:", error);
    return Response.json(
      { error: "Failed to initiate WHOOP connection" },
      { status: 500 }
    );
  }
}
