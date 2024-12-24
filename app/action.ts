"use server";

import { z } from "zod";

const SleepDataSchema = z.object({
  rem_sleep: z.number().min(1).max(100),
  deep_sleep: z.number().min(1).max(100),
  total_sleep: z.number().min(1).max(100),
  restfulness: z.number().min(1).max(100),
  efficiency: z.number().min(1).max(100),
  timing: z.number().min(1).max(100),
  latency: z.number().min(1).max(100),
});

export async function analyzeSleep(formData: FormData) {
  try {
    // Convert FormData to a regular object with number values
    const rawData = Object.fromEntries(formData.entries());
    const parsedData = Object.keys(rawData).reduce((acc, key) => {
      const value = Number(rawData[key]);
      if (isNaN(value)) {
        throw new Error(`Invalid number for ${key}`);
      }
      acc[key] = value;
      return acc;
    }, {} as Record<string, number>);

    // Validate the data against the schema
    const validatedData = SleepDataSchema.parse(parsedData);

    // Make the API call
    const response = await fetch(process.env.API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const results = await response.json();
    return { success: true, data: results };
  } catch (error) {
    console.error("Sleep analysis error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to analyze sleep data. Please try again.",
    };
  }
}
