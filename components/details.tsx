import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Moon, Activity, Heart, Bed } from "lucide-react";
import { FormattedSleepResponse } from "../lib/utils";

const SleepDashboard = ({
  sleepData,
}: {
  sleepData: FormattedSleepResponse;
}) => {
  const formatMillisToHours = (millis: number) => {
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Sleep Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sleep Score Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sleepData.score.sleep_performance_percentage.toFixed(2)}%
            </div>
            <Progress
              value={sleepData.score.sleep_performance_percentage}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consistency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sleepData.score.sleep_consistency_percentage.toFixed(2)}%
            </div>
            <Progress
              value={sleepData.score.sleep_consistency_percentage}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sleepData.score.sleep_efficiency_percentage.toFixed(2)}%
            </div>
            <Progress
              value={sleepData.score.sleep_efficiency_percentage}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Sleep Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time in Bed</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMillisToHours(
                sleepData.score.stage_summary.total_in_bed_time_milli
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseline needed:{" "}
              {formatMillisToHours(sleepData.score.sleep_needed.baseline_milli)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sleep Quality</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sleep Cycles</span>
                <span className="font-bold">
                  {sleepData.score.stage_summary.sleep_cycle_count}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Disturbances</span>
                <span className="font-bold">
                  {sleepData.score.stage_summary.disturbance_count}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Respiratory Rate
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sleepData.score.respiratory_rate.toFixed(2)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                bpm
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SleepDashboard;
