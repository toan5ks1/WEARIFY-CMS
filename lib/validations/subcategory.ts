import { sides } from "@/db/schema"
import * as z from "zod"

export const subcategorySchema = z.object({
  title: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
  sides: z
    .array(
      z.object({
        title: z.string().min(1, {
          message: "Must be at least 1 character",
        }),
        description: z.string().optional(),
        mockup: z
          .unknown()
          .refine((val) => {
            if (!Array.isArray(val)) return false
            if (val.some((file) => !(file instanceof File))) return false
            return true
          }, "Must be a File")
          .optional()
          .nullable()
          .default(null),
        areaType: z.string().default(sides.areaType.enumValues[0]),
        areaImage: z
          .unknown()
          .refine((val) => {
            if (!Array.isArray(val)) return false
            if (val.some((file) => !(file instanceof File))) return false
            return true
          }, "Must be a File")
          .optional()
          .nullable()
          .default(null),
        dimension: z
          .array(
            z.object({
              w: z
                .number()
                .min(0, {
                  message: ">= 0",
                })
                .default(0),
              h: z
                .number()
                .min(0, {
                  message: ">= 0",
                })
                .default(0),
              x: z.number().default(0),
              y: z.number().default(0),
            })
          )
          .optional()
          .nullable()
          .default(null),
      })
    )
    .optional(),
})
