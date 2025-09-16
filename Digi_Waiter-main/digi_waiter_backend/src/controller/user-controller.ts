import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import logger from "../utils/logger";
import { comparePassword, createUser, hashPassword } from "../model/User";
import { generateToken } from "../utils/generateToken";
import {
  userLoginValidation,
  userSchemaValidation,
} from "../validation/user-validation";

//user register
export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  logger.info("Registration endpoint hit with body: %o", req.body.name);
  try {
    //validate schema
    const { error } = userSchemaValidation.safeParse(req.body);

    if (error) {
      logger.warn("validation error", error.message);
      return res.status(400).json({ success: false, message: error.message });
    }

    const { name, email, password, image, role, companyId } = req.body;

    if (companyId) {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Invalid Company ID: Company not found",
        });
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      logger.warn("User already exists");
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await createUser(req.body);
    logger.info("User registered successfully", user.id);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    logger.error("Registration failed", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// user login
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  logger.info("Login endpoint hit...");
  try {
    const validationResult = userLoginValidation.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      logger.warn("Validation error", errors);
      return res.status(400).json({ success: false, errors });
    }

    const { email, password } = req.body;

    //User exist or not
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn("Invalid user");
      return res
        .status(400)
        .json({ success: false, message: "Invalide credentials" });
    }

    //Valid password or not
    const isValidPassword = await comparePassword(user.password, password);
    if (!isValidPassword) {
      logger.warn("Invalid password");
      return res
        .status(400)
        .json({ success: false, message: "Invalide password" });
    }

    const tokens = await generateToken(user);

    if (!tokens) {
      logger.warn("Failed to generate tokens");
      return res.status(500).json({
        success: false,
        message: "Could not generate authentication tokens",
      });
    }

    const { accessToken, refreshToken } = tokens;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/api/auth/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/api/auth/logout",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      userId: user.id,
      userName: user.name,
      email: user.email,
      role: user.role,
      company: user.companyId,
      accessToken,
    });
  } catch (error) {
    logger.error("Login failed", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//refresh token
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  logger.info(`Refresh token endpoint hit...`);
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      logger.warn(`Refresh token missing in cookies`);
      return res
        .status(400)
        .json({ success: false, message: "Refresh token missing" });
    }

    const storedToken = await prisma.refresh_token.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      logger.warn(`Invalid or expired refresh token`);
      // Clear cookie if refresh token expired or invalid
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/api/auth/refresh-token",
      });

      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user) {
      logger.warn(`User not found`);
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const tokens = await generateToken(user);

    if (!tokens) {
      logger.warn("Refresh token expired or invalid during token generation");
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/api/auth/refresh-token",
      });

      return res.status(401).json({
        success: false,
        message: "Refresh token expired, please login again",
      });
    }

    return res.json({
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    logger.error("Refresh token error occurred", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//logout
export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  logger.info(`Logout endpoint hit...`);
  try {
    const refreshToken = req.cookies?.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
      logger.warn(`Refresh token missing....`);
      return res
        .status(400)
        .json({ success: false, message: "Refresh token missing" });
    }

    await prisma.refresh_token.delete({
      where: { token: refreshToken },
    });

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/api/auth/logout",
    });

    logger.info(`Refresh token deleted for logout`);
    res.json({
      success: true,
      message: "Logged out sucessfully",
    });
  } catch (error) {
    logger.error("Logging out error  ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const editUser = async (req: Request, res: Response): Promise<any> => {
  logger.info("Edit user endpoint hit");

  try {
    const userId = req.params.id;

    const validation = userSchemaValidation.safeParse(req.body);
    if (!validation.success) {
      logger.warn("Validation failed", validation.error.issues);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { name, email, password, image, role, companyId } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      logger.warn(`User not found: ${userId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        logger.warn(`Email already in use: ${email}`);
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
    }

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password: hashedPassword,
        image,
        role,
        company: companyId ? { connect: { id: companyId } } : undefined,
        updatedAt: new Date(),
      },
    });

    logger.info("User updated successfully", updatedUser.id);

    return res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    logger.error("Error updating user", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
