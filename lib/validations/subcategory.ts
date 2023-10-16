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
        image: z
          .unknown()
          .refine((val) => {
            if (!Array.isArray(val)) return false
            if (val.some((file) => !(file instanceof File))) return false
            return true
          }, "Must be a File")
          .optional()
          .nullable()
          .default(null),
        printArea: z
          .unknown()
          .refine((val) => {
            if (!Array.isArray(val)) return false
            return val.every((item) => {
              if (item instanceof File) return true
              if (
                typeof item === "object" &&
                "w" in item &&
                "h" in item &&
                "x" in item &&
                "y" in item
              ) {
                return true
              }
              return false
            })
          }, "Must be an array of File or objects")
          .optional()
          .nullable()
          .default(null),
      })
    )
    .optional(),
})
