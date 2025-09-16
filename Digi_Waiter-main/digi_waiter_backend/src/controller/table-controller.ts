import { Request, Response } from "express";
import { TableStatus } from "@prisma/client";
import { createTableSchema } from "../validation/table-validation";
import { prisma } from "../utils/prisma";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { uploadMediaToS3 } from "../utils/s3";
import logger from "../utils/logger";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

const frontendUrl = process.env.FRONTEND_URL;

export const createTable = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user?.companyId) {
      return res.status(403).json({ error: "Forbidden: No company assigned" });
    }
    // Validate request body
    const parsed = createTableSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ errors: parsed.error.flatten().fieldErrors });
    }

    const { name, status } = parsed.data;
    const companyId = user.companyId;
    //  Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }

    const normalizedName = name.trim().toLowerCase();

    //  Check for duplicate table name
    const existingTable = await prisma.table.findFirst({
      where: { name: normalizedName, companyId },
    });
    if (existingTable) {
      return res.status(409).json({
        error: "Table with this name already exists for the company.",
      });
    }

    const tempId = uuidv4();
    const qrPayload = `${frontendUrl}/table-${normalizedName}`;
    const qrBuffer = await QRCode.toBuffer(qrPayload, { type: "png" });

    // ✅ Create a mock Multer file object
    const mockFile: Express.Multer.File = {
      fieldname: "qr",
      originalname: `table-${tempId}-qr.png`,
      encoding: "7bit",
      mimetype: "image/png",
      size: qrBuffer.length,
      buffer: qrBuffer,
      destination: "",
      filename: "",
      path: "",
      stream: undefined as any,
    };

    // ✅ Upload QR code image
    const qrUploadResult = await uploadMediaToS3(mockFile);
    const qrUrl = qrUploadResult.url;

    if (!qrUrl) {
      throw new Error("QR upload failed");
    }

    const table = await prisma.table.create({
      data: {
        id: tempId,
        name: normalizedName,
        companyId,
        status: status ?? TableStatus.IN_ACTIVE,
        qr: qrUrl,
      },
    });

    return res.status(201).json(table);
  } catch (error) {
    logger.warn("Error activating table:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllTablesForCompany = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req.user;

  try {
    if (!user || !user.companyId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const tables = await prisma.table.findMany({
      where: user?.companyId
        ? { companyId: user?.companyId as string }
        : undefined,

      include: {
        company: true,
        TableAssign: {
          include: {
            TableSession: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllTablesForSuperAdmin = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req.user;

  if (!user || user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const tables = await prisma.table.findMany({
      include: {
        company: true,
        TableAssign: {
          include: {
            TableSession: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    console.error("Error fetching tables for SuperAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const scanTableByName = async (req: Request, res: Response) => {
  const { tableNameParam } = req.params;

  const prefix = "table-";

  if (!tableNameParam.startsWith(prefix)) {
    return res.status(400).json({ message: "Invalid table parameter" });
  }

  const tableName = tableNameParam.slice(prefix.length);

  try {
    // Find table by name
    const table = await prisma.table.findFirst({
      where: { name: tableName },
      include: {
        company: true,
        TableAssign: {
          include: { TableSession: true },
        },
      },
    });

    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    if (table.status !== "ACTIVE") {
      return res.status(403).json({
        message: "This table is not active. Please wait for staff.",
      });
    }

    const activeSession = table.TableAssign.find(
      (assign) =>
        assign.TableSession?.session_status === "ACTIVATED" &&
        !assign.TableSession?.end_time
    );

    if (!activeSession) {
      return res.status(403).json({
        message: "No active session found. Please wait for staff.",
      });
    }

    return res.status(200).json({
      table: {
        id: table.id,
        name: table.name,
      },
      company: {
        id: table.companyId,
        name: table.company?.name,
      },
      session: {
        id: activeSession.tableSessionId,
        start_time: activeSession.TableSession?.start_time,
        status: activeSession.TableSession?.session_status,
      },
    });
  } catch (error) {
    logger.warn("Error activating table:", error);

    return res.status(500).json({ message: "Internal server error." });
  }
};

export const activateTable = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req.user;
  const { tableName } = req.body;

  try {
    if (!tableName) {
      return res
        .status(400)
        .json({ success: false, message: "Table name is required" });
    }
    const existingCompany = await prisma.company.findUnique({
      where: { id: user?.companyId },
    });

    if (!existingCompany) {
      logger.warn("UnAuthorized access to company");
      return res
        .status(400)
        .json({ success: false, message: "UnAuthorized access to company" });
    }

    const table = await prisma.table.findFirst({
      where: {
        name: tableName,
        companyId: existingCompany.id,
      },
    });

    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    const activeAssign = await prisma.tableAssign.findFirst({
      where: {
        tableId: table.id,
        TableSession: {
          session_status: "ACTIVATED",
          end_time: null,
        },
      },
    });

    if (activeAssign) {
      return res.status(400).json({
        success: false,
        message: "Table already has an active ",
      });
    }

    if (table.status !== "ACTIVE") {
      await prisma.table.update({
        where: { id: table.id },
        data: { status: "ACTIVE" },
      });
    }

    const newSession = await prisma.tableSession.create({
      data: {
        companyId: existingCompany.id,
        session_status: "ACTIVATED",
        start_time: new Date(),
      },
    });

    const tableAssign = await prisma.tableAssign.create({
      data: {
        tableId: table.id,
        tableSessionId: newSession.id,
        companyId: existingCompany.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Table activated successfully",
      data: {
        table: {
          id: table.id,
          name: table.name,
        },
        session: {
          id: newSession.id,
          start_time: newSession.start_time,
          status: newSession.session_status,
        },
        tableAssign,
      },
    });
  } catch (error) {
    logger.warn("Error activating table:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const mergeTable = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  const { targetTableId, sessionId } = req.body;

  if (!user || !user.companyId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (!targetTableId || !sessionId) {
    return res
      .status(400)
      .json({ message: "targetTableId and sessionId are required" });
  }

  try {
    const companyId = user.companyId;

    // Validate session
    const session = await prisma.tableSession.findFirst({
      where: {
        id: sessionId,
        companyId,
        session_status: "ACTIVATED",
        end_time: null,
      },
    });

    if (!session) {
      return res.status(404).json({ message: "Active session not found" });
    }

    // Check if target table exists
    const table = await prisma.table.findFirst({
      where: { id: targetTableId, companyId },
    });

    if (!table) {
      return res.status(404).json({ message: "Target table not found" });
    }

    // Check if the table is already assigned to this session
    const existingAssign = await prisma.tableAssign.findFirst({
      where: {
        tableId: targetTableId,
        tableSessionId: sessionId,
      },
    });

    if (existingAssign) {
      return res.status(409).json({
        message: "Table is already assigned to this session",
      });
    }

    // Create new TableAssign entry
    const newAssign = await prisma.tableAssign.create({
      data: {
        tableId: targetTableId,
        tableSessionId: sessionId,
        companyId,
      },
    });

    await prisma.table.update({
      where: {
        id: targetTableId,
      },

      data: {
        status: "ACTIVE",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Table added to existing session",
      data: {
        tableId: targetTableId,
        sessionId,
        assignId: newAssign.id,
      },
    });
  } catch (error) {
    logger.error("Error adding table to session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTableAssigns = async (req: Request, res: Response) => {
  logger.info("Table Assign endpoint hit...");
  try {
    const tableAssigns = await prisma.tableAssign.findMany({
      include: {
        table: true,
        TableSession: true,
        company: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: tableAssigns.length,
      data: tableAssigns,
    });
  } catch (error) {
    console.error("Error fetching TableAssigns:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllTableAssignsForCompany = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req.user;

  try {
    if (!user || !user.companyId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const tableAssigns = await prisma.tableAssign.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        table: true,
        TableSession: true,
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tableAssigns.length,
      data: tableAssigns,
    });
  } catch (error) {
    console.error("Error fetching TableAssigns:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
