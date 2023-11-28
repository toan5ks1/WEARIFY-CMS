import { sides } from "@/db/schema"
import * as z from "zod"

import { AreaType } from "../const"

export const subcategorySchema = z.object({
  title: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  slug: z.string().optional(),
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
        description: z.string().nullable(),
        subcategoryId: z.number().optional().nullable().default(null),
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
        areaType: z.enum(AreaType).default(sides.areaType.enumValues[0]),
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
            z
              .object({
                w: z.number().nullable().default(0),
                h: z.number().nullable().default(0),
                x: z.number().nullable().default(0),
                y: z.number().nullable().default(0),
              })
              .refine(
                (val) => (!val.w || val.w >= 0) && (!val.h || val.h >= 0),
                "Width & height must be greater than or equal to 0"
              )
          )
          .optional()
          .nullable()
          .default(null),
      })
    )
    .optional()
    .nullable()
    .default(null),
})
