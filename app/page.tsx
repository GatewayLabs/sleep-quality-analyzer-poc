"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Moon,
  BedDouble,
  Timer,
  Activity,
  BarChart,
  Clock,
  Brain,
  Circle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { analyzeSleep } from "./action";
import { useFormStatus } from "react-dom";

export default function SleepAnalyzer() {
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await analyzeSleep(formData);
    if (result.success) {
      setResults(result.data);
      setError(null);
    } else {
      setError(result?.error as string);
      setResults(null);
    }
  }

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
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rem_sleep" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  REM Sleep
                </Label>
                <Input
                  id="rem_sleep"
                  name="rem_sleep"
                  type="number"
                  placeholder="Minutes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deep_sleep" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Deep Sleep
                </Label>
                <Input
                  id="deep_sleep"
                  name="deep_sleep"
                  type="number"
                  placeholder="Minutes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="total_sleep"
                  className="flex items-center gap-2"
                >
                  <BedDouble className="h-4 w-4" />
                  Total Sleep
                </Label>
                <Input
                  id="total_sleep"
                  name="total_sleep"
                  type="number"
                  placeholder="Hours"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="restfulness"
                  className="flex items-center gap-2"
                >
                  <Activity className="h-4 w-4" />
                  Restfulness
                </Label>
                <Input
                  id="restfulness"
                  name="restfulness"
                  type="number"
                  placeholder="Scale 1-100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="efficiency" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  Sleep Efficiency
                </Label>
                <Input
                  id="efficiency"
                  name="efficiency"
                  type="number"
                  placeholder="Scale 1-100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timing" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Sleep Timing
                </Label>
                <Input
                  id="timing"
                  name="timing"
                  type="number"
                  placeholder="24-hour format"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="latency" className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Sleep Latency
                </Label>
                <Input
                  id="latency"
                  name="latency"
                  type="number"
                  placeholder="Minutes to fall asleep"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <SubmitButton />

            {results && (
              <div className="mt-6 grid gap-4 rounded-lg border p-4">
                <h3 className="font-semibold">Analysis Results</h3>
                <div className="grid gap-2">
                  {Object.entries(results).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="capitalize">
                        {key.replace("_", " ")}
                      </span>
                      {value.includes("Good") ? (
                        <span className="flex items-center text-green-600">
                          <Circle className="h-4 w-4 fill-current" />
                          <span className="ml-2">Good</span>
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <Circle className="h-4 w-4 fill-current" />
                          <span className="ml-2">Poor</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? "Analyzing..." : "Analyze Sleep Quality"}
    </Button>
  );
}
