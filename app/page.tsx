"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
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
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { analyzeSleep } from "./action";
import { useFormStatus } from "react-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface SleepMetric {
  average: number;
  percentage_difference: number;
}

interface AnalysisResult {
  [key: string]: SleepMetric;
}

interface FormErrors {
  [key: string]: string;
}

export default function SleepAnalyzer() {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { isConnected } = useAccount();

  const validateField = (name: string, value: number): string => {
    if (isNaN(value)) return "Please enter a valid number";
    if (value < 1 || value > 100) return "Value must be between 1 and 100";
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = Number(value);
    const error = validateField(name, numberValue);

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  async function handleSubmit(formData: FormData) {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setError(null);
    const fields = [
      "rem_sleep",
      "deep_sleep",
      "total_sleep",
      "restfulness",
      "efficiency",
      "timing",
      "latency",
    ];
    const newErrors: FormErrors = {};

    fields.forEach((field) => {
      const value = Number(formData.get(field));
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    try {
      const result = await analyzeSleep(formData);
      if (result.success) {
        setResults(result.data);
        setError(null);
      } else {
        setError(result.error as string);
        setResults(null);
      }
    } catch {
      setError("Failed to analyze sleep data. Please try again.");
      setResults(null);
    }
  }

  const getComparisonColor = (percentage: number) =>
    percentage >= 0 ? "text-green-600" : "text-red-600";

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
          <CardContent className="mt-4 mx-auto">
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
            <form action={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="rem_sleep"
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    REM Sleep
                  </Label>
                  <Input
                    id="rem_sleep"
                    name="rem_sleep"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Scale 1-100"
                    onChange={handleInputChange}
                    className={formErrors.rem_sleep ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.rem_sleep && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.rem_sleep}
                    </p>
                  )}
                </div>

                {/* Other form fields remain the same */}
                {/* Deep Sleep */}
                <div className="space-y-2">
                  <Label
                    htmlFor="deep_sleep"
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Deep Sleep
                  </Label>
                  <Input
                    id="deep_sleep"
                    name="deep_sleep"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Scale 1-100"
                    onChange={handleInputChange}
                    className={formErrors.deep_sleep ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.deep_sleep && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.deep_sleep}
                    </p>
                  )}
                </div>

                {/* Total Sleep */}
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
                    min="1"
                    max="100"
                    placeholder="Scale 1-100"
                    onChange={handleInputChange}
                    className={formErrors.total_sleep ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.total_sleep && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.total_sleep}
                    </p>
                  )}
                </div>

                {/* Restfulness */}
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
                    min="1"
                    max="100"
                    placeholder="Scale 1-100"
                    onChange={handleInputChange}
                    className={formErrors.restfulness ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.restfulness && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.restfulness}
                    </p>
                  )}
                </div>

                {/* Efficiency */}
                <div className="space-y-2">
                  <Label
                    htmlFor="efficiency"
                    className="flex items-center gap-2"
                  >
                    <BarChart className="h-4 w-4" />
                    Sleep Efficiency
                  </Label>
                  <Input
                    id="efficiency"
                    name="efficiency"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Scale 1-100"
                    onChange={handleInputChange}
                    className={formErrors.efficiency ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.efficiency && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.efficiency}
                    </p>
                  )}
                </div>

                {/* Timing */}
                <div className="space-y-2">
                  <Label htmlFor="timing" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Sleep Timing
                  </Label>
                  <Input
                    id="timing"
                    name="timing"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Scale 1-100"
                    onChange={handleInputChange}
                    className={formErrors.timing ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.timing && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.timing}
                    </p>
                  )}
                </div>

                {/* Latency */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="latency" className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Sleep Latency
                  </Label>
                  <Input
                    id="latency"
                    name="latency"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Scale 1-100"
                    onChange={handleInputChange}
                    className={formErrors.latency ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.latency && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.latency}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <SubmitButton />

              {results && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Analysis Results</h3>
                  <div className="grid gap-4">
                    {Object.entries(results).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg border p-4 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-gray-500">
                            Average: {value.average}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Comparison to Average
                          </span>
                          <span
                            className={`flex items-center gap-1 ${getComparisonColor(
                              value.percentage_difference
                            )}`}
                          >
                            {value.percentage_difference >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {value.percentage_difference.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}
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
