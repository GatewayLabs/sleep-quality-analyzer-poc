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
  const [activeComponent, setActiveComponent] = useState("whoop");

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash.replace("#", "");
        setActiveComponent(hash || "whoop");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

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
