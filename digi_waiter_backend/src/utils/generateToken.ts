import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../utils/prisma";

interface User {
  id: string;
  image?: string | null;
  name: string;
  email: string;
  password: string;
  companyId: string | null;
  role: string;
}

export const generateToken = async (user: User) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      username: user.name,
      companyId: user.companyId,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  let refreshToken: string;

  // Find existing refresh token
  const existingToken = await prisma.refresh_token.findFirst({
    where: { userId: user.id },
  });

  if (existingToken) {
    if (existingToken.expiresAt > new Date()) {
      refreshToken = existingToken.token;
    } else {
      // Expired - delete and create new one
      await prisma.refresh_token.delete({
        where: { token: existingToken.token },
      });
      return null;
    }
  } else {
    //  No token exists - create new one
    refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refresh_token.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });
  }

  return { accessToken, refreshToken };
};
