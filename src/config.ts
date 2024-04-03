import { z } from "zod";

export const config = z
  .object({
    FF_API_BASE_URL: z.string(),
    MAP_URL: z.string(),
  })
  .parse({
    FF_API_BASE_URL: process.env.EXPO_PUBLIC_FF_API_BASE_URL,
    MAP_URL: process.env.EXPO_PUBLIC_MAP_URL,
  });
