import * as z from "zod";

export const subcategorySchema = z.object({
  title: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
});
