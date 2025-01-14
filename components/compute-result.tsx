import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Moon,
  Clock,
  Heart,
  Bed,
  AlertCircle,
  Gauge,
} from "lucide-react";
import { SleepAnalysisData } from "../lib/types";
import { FormattedSleepResponse } from "@/lib/utils";

const SleepAnalysis = ({
  data,
  sleepData,
}: {
  data: SleepAnalysisData;
  sleepData: FormattedSleepResponse;
}) => {
  const formatChange = (value: number) => {
    const rounded = value.toFixed(1);
    const isPositive = value > 0;
    return (
      <span
        className={`flex items-center ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? "↑" : "↓"} {Math.abs(Number(rounded))}%
      </span>
    );
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMillisToHours = (millis: number) => {
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const ComparisonText = ({
    difference,
    comparing,
    percentageDiff,
  }: {
    difference: number;
    comparing: number;
    percentageDiff: number;
  }) => {
    const isAbove = Math.abs(difference) > comparing;
    const isEqual = Math.abs(difference) === comparing;

    let comparisonWord;
    if (isEqual || percentageDiff === 0) {
      comparisonWord = <span className="text-green-500">ABOVE</span>;
    } else if (isAbove) {
      comparisonWord = <span className="text-green-500">ABOVE</span>;
    } else {
      comparisonWord = <span className="text-red-500">BELOW</span>;
    }

    return (
      <div className="text-sm text-muted-foreground space-y-1">
        <div>You're: {Math.abs(percentageDiff).toFixed(2)}%</div>
        <div>{comparisonWord}</div>
        <div>the average</div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Sleep Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sleep Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Sleep Performance
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {sleepData.score.sleep_performance_percentage.toFixed(2)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Average: {data.sleep_performance_percentage.average.toFixed(2)}%
            </div>
            <ComparisonText
              difference={sleepData.score.sleep_performance_percentage}
              comparing={data.sleep_performance_percentage.average}
              percentageDiff={
                data.sleep_performance_percentage.percentage_difference
              }
            />
          </CardContent>
        </Card>

        {/* Sleep Efficiency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Sleep Efficiency
            </CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {sleepData.score.sleep_efficiency_percentage.toFixed(2)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Average: {data.sleep_efficiency_percentage.average.toFixed(2)}%
            </div>
            <ComparisonText
              difference={sleepData.score.sleep_efficiency_percentage}
              comparing={data.sleep_efficiency_percentage.average}
              percentageDiff={
                data.sleep_efficiency_percentage.percentage_difference
              }
            />
          </CardContent>
        </Card>

        {/* Sleep Consistency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Sleep Consistency
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {sleepData.score.sleep_consistency_percentage.toFixed(2)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Average: {data.sleep_consistency_percentage.average.toFixed(2)}%
            </div>
            <ComparisonText
              difference={sleepData.score.sleep_consistency_percentage}
              comparing={data.sleep_consistency_percentage.average}
              percentageDiff={
                data.sleep_consistency_percentage.percentage_difference
              }
            />
          </CardContent>
        </Card>

        {/* Sleep Cycles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sleep Cycles</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {sleepData.score.stage_summary.sleep_cycle_count}
            </div>
            <div className="text-sm text-muted-foreground">
              Average: {data.stage_summary.sleep_cycle_count.average}
            </div>
            <ComparisonText
              difference={sleepData.score.stage_summary.sleep_cycle_count}
              comparing={data.stage_summary.sleep_cycle_count.average}
              percentageDiff={
                data.stage_summary.sleep_cycle_count.percentage_difference
              }
            />
          </CardContent>
        </Card>

        {/* Time in Bed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time in Bed</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {formatMillisToHours(
                sleepData.score.stage_summary.total_in_bed_time_milli
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Average:{" "}
              {formatTime(data.stage_summary.total_in_bed_time.average)}
            </div>
            <ComparisonText
              difference={sleepData.score.stage_summary.total_in_bed_time_milli}
              comparing={data.stage_summary.total_in_bed_time.average}
              percentageDiff={
                data.stage_summary.total_in_bed_time.percentage_difference
              }
            />
          </CardContent>
        </Card>

        {/* Disturbances */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disturbances</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {sleepData.score.stage_summary.disturbance_count}
            </div>
            <div className="text-sm text-muted-foreground">
              Average: {data.stage_summary.disturbance_count.average}
            </div>
            <ComparisonText
              difference={sleepData.score.stage_summary.disturbance_count}
              comparing={data.stage_summary.disturbance_count.average}
              percentageDiff={
                data.stage_summary.disturbance_count.percentage_difference
              }
            />
          </CardContent>
        </Card>

        {/* Respiratory Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Respiratory Rate
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {sleepData.score.respiratory_rate.toFixed(2)} bpm
            </div>
            <div className="text-sm text-muted-foreground">
              Average: {data.respiratory_rate.average.toFixed(2)}
            </div>
            <ComparisonText
              difference={sleepData.score.respiratory_rate}
              comparing={data.respiratory_rate.average}
              percentageDiff={data.respiratory_rate.percentage_difference}
            />
          </CardContent>
        </Card>

        {/* Sleep Need */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sleep Need</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {formatMillisToHours(sleepData.score.sleep_needed.baseline_milli)}
            </div>
            <div className="text-sm text-muted-foreground">
              Average: {formatTime(data.sleep_needed.baseline.average)}
            </div>

            <ComparisonText
              difference={sleepData.score.sleep_needed.baseline_milli}
              comparing={data.sleep_needed.baseline.average}
              percentageDiff={data.sleep_needed.baseline.percentage_difference}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SleepAnalysis;
