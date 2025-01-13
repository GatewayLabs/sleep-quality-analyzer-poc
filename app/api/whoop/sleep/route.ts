import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get URL parameters using searchParams
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const nextToken = searchParams.get("nextToken");

  // Get access token from cookies
  const cookieStore = cookies();
  const accessToken = cookieStore.get("whoop_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token not found" },
      { status: 401 }
    );
  }

  // Build query parameters
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit);
  if (start) params.append("start", start);
  if (end) params.append("end", end);
  if (nextToken) params.append("nextToken", nextToken);

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const url = `https://api.prod.whoop.com/developer/v1/activity/sleep${queryString}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch sleep data: ${
          error.error_description || response.statusText
        }`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error || "Internal server error" },
      { status: 500 }
    );
  }
}
