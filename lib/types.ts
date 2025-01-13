export interface SleepMetric {
  average: number;
  percentage_difference: number;
}

export interface FormErrors {
  [key: string]: string;
}

export interface AnalysisResult {
  [key: string]: SleepMetric;
}


interface MetricComparison {
  average: number;
  percentage_difference: number;
}

interface StageSummary {
  sleep_cycle_count: MetricComparison;
  total_in_bed_time: MetricComparison;
  disturbance_count: MetricComparison;
}

interface SleepNeeded {
  need_from_sleep_debt: MetricComparison;
  baseline: MetricComparison;
}

export interface SleepAnalysisData {
  stage_summary: StageSummary;
  respiratory_rate: MetricComparison;
  sleep_needed: SleepNeeded;
  sleep_consistency_percentage: MetricComparison;
  sleep_performance_percentage: MetricComparison;
  sleep_efficiency_percentage: MetricComparison;
}