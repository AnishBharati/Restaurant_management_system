import { TableStatus } from "@prisma/client";
import z from "zod";

export const createTableSchema = z.object({
  name: z.string().min(1, "Name is required"),
  companyId: z.string().min(1, "Company ID is required"),
  status: z.nativeEnum(TableStatus).optional(),
});
