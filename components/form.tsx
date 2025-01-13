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
} from "lucide-react";
import { ResultPage } from "../components/results";
import { useState } from "react";
import { AnalysisResult, FormErrors } from "../lib/types";
import { validateField } from "../lib/utils";
import { analyzeSleep } from "../app/action";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "./ui/alert";

export function ManualForm({ isConnected }: { isConnected: boolean }) {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

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
  return (
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
            min="1"
            max="100"
            placeholder="Scale 1-100"
            onChange={handleInputChange}
            className={formErrors.rem_sleep ? "border-red-500" : ""}
            required
          />
          {formErrors.rem_sleep && (
            <p className="text-red-500 text-sm mt-1">{formErrors.rem_sleep}</p>
          )}
        </div>

        {/* Other form fields remain the same */}
        {/* Deep Sleep */}
        <div className="space-y-2">
          <Label htmlFor="deep_sleep" className="flex items-center gap-2">
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
            <p className="text-red-500 text-sm mt-1">{formErrors.deep_sleep}</p>
          )}
        </div>

        {/* Total Sleep */}
        <div className="space-y-2">
          <Label htmlFor="total_sleep" className="flex items-center gap-2">
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
          <Label htmlFor="restfulness" className="flex items-center gap-2">
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
          <Label htmlFor="efficiency" className="flex items-center gap-2">
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
            <p className="text-red-500 text-sm mt-1">{formErrors.efficiency}</p>
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
            <p className="text-red-500 text-sm mt-1">{formErrors.timing}</p>
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
            <p className="text-red-500 text-sm mt-1">{formErrors.latency}</p>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <SubmitButton />

      {results && <ResultPage results={results} />}
    </form>
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
