import * as z from "zod"

export const categorySchema = z.object({
  title: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
})
