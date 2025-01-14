"use client";
import { useState, useEffect } from "react";
import { getSleepCollection } from "../lib/whoop";
import { formatSleepData, FormattedSleepResponse } from "../lib/utils";
import SleepDashboard from "./details";
import { Button } from "./ui/button";
import { analyzeWhoopSleep } from "../app/action";
import { SleepAnalysisData } from "../lib/types";
import SleepAnalysis from "./compute-result";

export function Whoop() {
  const [authenticated, setAuthenticated] = useState(false);
  const [sleepData, setSleepData] = useState<FormattedSleepResponse | null>(
    null
  );
  const [analysisData, setAnalysisData] = useState<SleepAnalysisData | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!sleepData) return;

    setAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeWhoopSleep(sleepData);

      if (result.success) {
        setAnalysisData(result.data);
      } else {
        setError(new Error(result.error));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to analyze sleep data")
      );
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    const authCookie = getCookie("authenticated");
    setAuthenticated(!!authCookie);

    const fetchData = async () => {
      if (!authCookie) {
        setLoading(false);
        return;
      }

      try {
        const data = await getSleepCollection({ limit: 1 });
        setSleepData(formatSleepData(data));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Loading WHOOP data...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex mt-4 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your WHOOP</h1>
          <a
            href="/api/whoop/connect"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Connect WHOOP
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-500 p-4 rounded">
          <p>Failed to load WHOOP data. Please try reconnecting.</p>
          <pre className="mt-2 text-sm">{error.message}</pre>
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

  return (
    <div className="space-y-6 p-2">
      <div className="grid gap-2">
        {sleepData && <SleepDashboard sleepData={sleepData} />}
      </div>

      <Button
        onClick={handleAnalyze}
        className="w-full"
        disabled={!sleepData || analyzing}
      >
        {analyzing ? (
          <>
            <span className="mr-2">Analyzing...</span>
            <span className="animate-spin">⚪</span>
          </>
        ) : (
          "Analyze Sleep Data"
        )}
      </Button>

      {analysisData && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Analysis Results</h3>
          <SleepAnalysis data={analysisData} sleepData={sleepData!} />
        </div>
      )}
    </div>
  );
}

function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(name + "="));
  return cookie ? cookie.split("=")[1] : null;
}
