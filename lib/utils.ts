import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SleepResponse } from "./whoop";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateField = (name: string, value: number): string => {
  if (isNaN(value)) return "Please enter a valid number";
  if (value < 1 || value > 100) return "Value must be between 1 and 100";
  return "";
};

export interface FormattedSleepResponse {
  score: {
    stage_summary: {
      total_in_bed_time_milli: number;
      sleep_cycle_count: number;
      disturbance_count: number;
    };
    sleep_needed: {
      baseline_milli: number;
      need_from_sleep_debt_milli: number;
    };
    respiratory_rate: number;
    sleep_performance_percentage: number;
    sleep_consistency_percentage: number;
    sleep_efficiency_percentage: number;
  };
}

export function formatSleepData(data: SleepResponse): FormattedSleepResponse {
  const record = data.records[0];
  return {
    score: {
      stage_summary: {
        total_in_bed_time_milli:
          record.score.stage_summary.total_in_bed_time_milli,
        sleep_cycle_count: record.score.stage_summary.sleep_cycle_count,
        disturbance_count: record.score.stage_summary.disturbance_count,
      },
      sleep_needed: {
        baseline_milli: record.score.sleep_needed.baseline_milli,
        need_from_sleep_debt_milli:
          record.score.sleep_needed.need_from_sleep_debt_milli,
      },
      respiratory_rate: record.score.respiratory_rate,
      sleep_performance_percentage: record.score.sleep_performance_percentage,
      sleep_consistency_percentage: record.score.sleep_consistency_percentage,
      sleep_efficiency_percentage: record.score.sleep_efficiency_percentage,
    },
  };
}
