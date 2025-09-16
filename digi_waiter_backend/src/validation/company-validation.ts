import { z } from "zod";

const companySchemaValidation = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .trim(),

  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(50, "Description must be at most 50 characters")
    .trim(),

  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(50, "Location must be at most 50 characters")
    .trim(),

  number: z
    .string()
    .min(3, "Number must be at least 3 characters")
    .max(20, "Number must be at most 20 characters")
    .trim(),

  allowed_discount: z
    .string()
    .optional()
    .nullable(),

  logo: z.string().url("Logo must be a valid URL").optional().nullable(),
});

export { companySchemaValidation };
