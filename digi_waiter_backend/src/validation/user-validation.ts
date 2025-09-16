import { z } from "zod";

// Enum for Role
const RoleEnum = z.enum(["SUPER_ADMIN", "ADMIN", "WAITER"]);

const userSchemaValidation = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .trim(),

  email: z.string().email("Invalid email format").trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),

  image: z.string().url("Image must be a valid URL").optional().nullable(),

  role: RoleEnum,

  companyId: z.string().cuid("Invalid company ID").optional().nullable(),
});

const userLoginValidation = z.object({
  email: z.string().email("Invalid email format").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password cannot be empty"),
});

export { userSchemaValidation, userLoginValidation };
