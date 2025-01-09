import { cookies } from "next/headers";
import { getWhoopProfile } from "@/lib/whoop";

export default async function DashboardPage() {
  const accessToken = cookies().get("whoop_access_token")?.value;

  if (!accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your WHOOP</h1>
          <a
            href="/api/whoop/connect"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Connect WHOOP
          </a>
          <div className="mt-4 text-sm text-gray-600">
            Testing in localhost environment
          </div>
        </div>
      </div>
    );
  }

  try {
    const profile = await getWhoopProfile(accessToken);

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Your WHOOP Data</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="grid gap-4">
            <div>
              <span className="font-medium">Name: </span>
              {profile.first_name} {profile.last_name}
            </div>
            <div>
              <span className="font-medium">Email: </span>
              {profile.email}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-500 p-4 rounded">
          <p>Failed to load WHOOP data. Please try reconnecting.</p>
          <pre className="mt-2 text-sm">
            {error instanceof Error ? error.message : String(error)}
          </pre>
          <div className="mt-4">
            <a
              href="/api/whoop/connect"
              className="text-red-600 underline hover:text-red-700"
            >
              Reconnect WHOOP
            </a>
          </div>
        </div>
      </div>
    );
  }
}
