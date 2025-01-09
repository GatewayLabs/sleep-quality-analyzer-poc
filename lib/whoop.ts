import { WHOOP_BASE_URL, REDIRECT_URI } from "@/constants";

export async function getWhoopAuthUrl() {
  if (!process.env.WHOOP_CLIENT_ID) {
    throw new Error("WHOOP_CLIENT_ID is not set");
  }

  const state = crypto.randomUUID();

  const authorizationUrl = new URL(`${WHOOP_BASE_URL}/oauth/oauth2/auth`);
  authorizationUrl.searchParams.set("client_id", process.env.WHOOP_CLIENT_ID);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("scope", "offline read:profile");
  authorizationUrl.searchParams.set("redirect_uri", REDIRECT_URI);

  console.log("Auth URL params:", {
    client_id: process.env.WHOOP_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "offline read:profile",
  });

  return { url: authorizationUrl.toString(), state };
}

export async function handleWhoopCallback(code: string) {
  if (!process.env.WHOOP_CLIENT_ID || !process.env.WHOOP_CLIENT_SECRET) {
    throw new Error("WHOOP credentials not set");
  }

  console.log("Handling callback with code:", code);

  const params = new URLSearchParams();
  params.set("grant_type", "authorization_code");
  params.set("code", code);
  params.set("redirect_uri", REDIRECT_URI);

  try {
    const response = await fetch(`${WHOOP_BASE_URL}/oauth/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.WHOOP_CLIENT_ID}:${process.env.WHOOP_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: params,
    });

    console.log("Token response status:", response.status);

    const responseText = await response.text();
    console.log("Token response body:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: "Unknown error", error_description: responseText };
      }
      console.error("Token error response:", errorData);
      throw new Error(
        `Failed to get access token: ${
          errorData.error_description || response.statusText
        }`
      );
    }

    const tokens = JSON.parse(responseText);
    console.log("Successfully obtained tokens");
    return tokens;
  } catch (error) {
    console.error("Token request error:", error);
    throw error;
  }
}

export async function getWhoopProfile(accessToken: string) {
  const response = await fetch(
    `${WHOOP_BASE_URL}/developer/v1/user/profile/basic`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch WHOOP profile: ${
        errorData.error_description || response.statusText
      }`
    );
  }

  return response.json();
}
