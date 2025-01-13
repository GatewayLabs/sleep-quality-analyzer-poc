/* eslint-disable @typescript-eslint/no-explicit-any */
import { WHOOP_BASE_URL, REDIRECT_URI } from "@/constants";

export interface WhoopSleepData {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  nap: boolean;
  score_state: string;
  score: {
    stage_summary: any;
    sleep_needed: {
      baseline_milli: number;
      need_from_sleep_debt_milli: number;
      need_from_recent_strain_milli: number;
      need_from_recent_nap_milli: number;
    };
    respiratory_rate: number;
    sleep_performance_percentage: number;
    sleep_consistency_percentage: number;
    sleep_efficiency_percentage: number;
  };
}

export interface SleepResponse {
  records: WhoopSleepData[];
  next_token?: string;
}

export async function getWhoopAuthUrl() {
  if (!process.env.WHOOP_CLIENT_ID) {
    throw new Error("WHOOP_CLIENT_ID is not set");
  }

  const state = crypto.randomUUID();

  const authorizationUrl = new URL(`${WHOOP_BASE_URL}/oauth/oauth2/auth`);
  authorizationUrl.searchParams.set("client_id", process.env.WHOOP_CLIENT_ID);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("scope", "offline read:sleep");
  authorizationUrl.searchParams.set("redirect_uri", REDIRECT_URI);

  console.log("Auth URL params:", {
    client_id: process.env.WHOOP_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "read:sleep",
  });

  return { url: authorizationUrl.toString(), state };
}

export async function handleWhoopCallback(code: string) {
  if (!process.env.WHOOP_CLIENT_ID || !process.env.WHOOP_CLIENT_SECRET) {
    throw new Error("WHOOP credentials not set");
  }

  console.log("Handling callback with code:", code);

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
    // Add client credentials in the body instead of Authorization header
    client_id: process.env.WHOOP_CLIENT_ID,
    client_secret: process.env.WHOOP_CLIENT_SECRET,
  });

  try {
    const response = await fetch(`${WHOOP_BASE_URL}/oauth/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
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

export async function refreshWhoopToken(refreshToken: string) {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    // Add client credentials in the body
    client_id: process.env.WHOOP_CLIENT_ID!,
    client_secret: process.env.WHOOP_CLIENT_SECRET!,
  });

  const response = await fetch(`${WHOOP_BASE_URL}/oauth/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to refresh token: ${
        errorData.error_description || response.statusText
      }`
    );
  }

  return response.json();
}

export async function getSleepCollection(options?: {
  limit?: number;
  start?: string;
  end?: string;
  nextToken?: string;
}) {
  const params = new URLSearchParams();
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.start) params.append("start", options.start);
  if (options?.end) params.append("end", options.end);
  if (options?.nextToken) params.append("nextToken", options.nextToken);

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const response = await fetch(`/api/whoop/sleep${queryString}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch sleep data: ${
        error.error_description || response.statusText
      }`
    );
  }

  return (await response.json()) as SleepResponse;
}
