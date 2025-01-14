"use client";

import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { ManualForm } from "../components/form";
import { Whoop } from "../components/whoop";

export default function SleepAnalyzer() {
  const { isConnected } = useAccount();
  const [activeComponent, setActiveComponent] = useState("manual");

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash.replace("#", "");
        setActiveComponent(hash || "manual");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const switchComponent = (componentName: string) => {
    if (typeof window !== "undefined") {
      window.location.hash = componentName;
      setActiveComponent(componentName);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">
            Secure Sleep Pattern Analyzer
          </CardTitle>
          <CardDescription>
            Analyze your sleep patterns securely using encrypted computation
          </CardDescription>
          <CardContent className="mt-3 mx-auto">
            <ConnectButton label="Sign in" />
          </CardContent>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <Alert>
              <AlertDescription>
                Please connect your wallet to access the sleep analysis form.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex justify-center space-x-4 mb-4">
                
                <button
                  className={`px-4 py-2 rounded transition-colors ${
                    activeComponent === "whoop"
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                  onClick={() => switchComponent("whoop")}
                  disabled={activeComponent === "whoop"}
                >
                  Get from Whoop
                </button>
              </div>
              <div>
                {activeComponent === "manual" && (
                  <ManualForm isConnected={isConnected} />
                )}
                {activeComponent === "whoop" && <Whoop />}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
