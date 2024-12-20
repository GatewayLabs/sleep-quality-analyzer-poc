"use server";

import { z } from "zod";

const SleepDataSchema = z.object({
  rem_sleep: z.number(),
  deep_sleep: z.number(),
  total_sleep: z.number(),
  restfulness: z.number(),
  efficiency: z.number(),
  timing: z.number(),
  latency: z.number(),
});

export async function analyzeSleep(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const parsedData = Object.keys(rawData).reduce((acc, key) => {
    acc[key] = Number(rawData[key]);
    return acc;
  }, {} as Record<string, number>);

  try {
    const validatedData = SleepDataSchema.parse(parsedData);

    const response = await fetch(process.env.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze sleep data");
    }

    const results = await response.json();
    return { success: true, data: results };
  } catch (error) {
    console.error("Sleep analysis error:", error);
    return {
      success: false,
      error: "Failed to analyze sleep data. Please try again.",
    };
  }
}
