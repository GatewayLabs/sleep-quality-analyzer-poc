import { TrendingDown, TrendingUp } from "lucide-react";
import { AnalysisResult } from "../lib/types";

const getComparisonColor = (percentage: number) =>
  percentage >= 0 ? "text-green-600" : "text-red-600";

export function ResultPage({ results }: { results: AnalysisResult }) {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-semibold text-lg">Analysis Results</h3>
      <div className="grid gap-4">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium capitalize">
                {key.replace(/_/g, " ")}
              </span>
              <span className="text-gray-500">Average: {value.average}</span>
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
  );
}
