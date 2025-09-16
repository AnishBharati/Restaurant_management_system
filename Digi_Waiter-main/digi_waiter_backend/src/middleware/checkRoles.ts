import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import logger from "../utils/logger";

export const checkSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Only SUPER_ADMIN can access this resource",
    });
  }

  next();
};

export const companyAdminCheck = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const companyId = req.params.id || req.query.id || req.body.companyId;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // SUPER_ADMIN can bypass company check
    if (user.role === "SUPER_ADMIN") {
      return next();
    }

    // For ADMIN, check company ownership
    if (user.role === "ADMIN") {
      if (!user.companyId) {
        logger.warn(`ADMIN user ${user.id} has no companyId assigned`);
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: No company assigned" });
      }

      if (user.companyId !== companyId) {
        logger.warn(
          `Unauthorized ADMIN access attempt: userId=${user.id}, requestedCompanyId=${companyId}, userCompanyId=${user.companyId}`
        );
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: Not your company" });
      }

      // Authorized admin
      return next();
    }

    // Other roles denied
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Insufficient permissions" });
  } catch (error) {
    logger.error("Company admin check failed: %o", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const companyAdminWaiterCheck = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const companyId = req.params.id || req.query.id || req.body.companyId;

    if (!companyId) {
      logger.warn("companyId is missing in request");
      return res.status(400).json({
        success: false,
        message: "Missing companyId in request",
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (user.role === "SUPER_ADMIN") {
      return next();
    }

    if (user.role === "ADMIN" || user.role === "WAITER") {
      if (!user.companyId) {
        logger.warn(`${user.role} user ${user.id} has no companyId assigned`);
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: No company assigned" });
      }

      if (user.companyId !== companyId) {
        logger.warn(
          `Unauthorized ADMIN access attempt: userId=${user.id}, requestedCompanyId=${companyId}, userCompanyId=${user.companyId}`
        );
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: Not your company" });
      }

      return next();
    }

    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Insufficient permissions" });
  } catch (error) {
    logger.error("Company admin check failed: %o", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
