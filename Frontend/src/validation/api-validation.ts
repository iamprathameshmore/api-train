// src/schemas/ApiFormSchema.ts
import { z } from "zod"

export const apiFormSchema = z.object({
  name: z.string().min(3, "API name is required"),
  status: z.enum(["active", "inactive"], { required_error: "Status is required" }),
})
