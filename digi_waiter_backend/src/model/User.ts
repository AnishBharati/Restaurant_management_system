import { PrismaClient, Role } from "@prisma/client";
import * as argon2 from "argon2";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const PEPPER = process.env.JWT_SECRETE || "";

const ARGON_CONFIG = {
  type: argon2.argon2id,
  memoryCost: 4096, // Reduced from default for better performance
  timeCost: 2, // Reduced from default 3
  parallelism: 1,
  hashLength: 32,
};

interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  image?: string;
  role: Role;
  companyId?: string;
}

export const createUser = async ({
  name,
  email,
  password,
  image,
  role,
  companyId,
}: UserCreateInput) => {
  const hashedPassword = await argon2.hash(PEPPER + password, ARGON_CONFIG);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      image,
      role,
      ...(companyId ? { company: { connect: { id: companyId } } } : {}),
    },
  });
};

export function comparePassword(
  hashedPassword: string,
  inputPassword: string
): Promise<boolean> {
  return argon2.verify(hashedPassword, PEPPER + inputPassword);
}

export async function hashPassword(rawPassword: string): Promise<string> {
  return argon2.hash(PEPPER + rawPassword, ARGON_CONFIG);
}
