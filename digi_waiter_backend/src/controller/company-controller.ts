import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import logger from "../utils/logger";

import { companySchemaValidation } from "../validation/company-validation";

export const createCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    logger.info("Company endpoint hit with body: %o", req.body.name);

    //validate schema
    const { error } = companySchemaValidation.safeParse(req.body);
    if (error) {
      logger.warn("validation error", error.message);
      return res.status(400).json({ success: false, message: error.message });
    }

    const { name, description, location, number, allowed_discount, logo } =
      req.body;

    const existingCompany = await prisma.company.findUnique({
      where: { name },
    });

    if (existingCompany) {
      logger.warn("Company name already exists");
      return res
        .status(400)
        .json({ success: false, message: "Company already exists" });
    }

    const newCompany = await prisma.company.create({
      data: {
        name,
        description,
        location,
        number,
        allowed_discount,
        logo,
      },
    });

    logger.info("Company created successfully", newCompany.id);

    res.status(201).json({
      success: true,
      message: "Company created successfully!",
      company: newCompany,
    });
  } catch (error) {
    logger.error("Company creation failed", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET All Companies
export const getAllCompanies = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    logger.info("Fetching all companies");

    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Companies fetched successfully",
      companies,
    });
  } catch (error) {
    logger.error("Fetching companies failed: %o", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET Company by ID
export const getCompanyById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const companyId = req.params.id;
    logger.info("Fetching company by ID: %s", companyId);

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      logger.warn("Company not found: %s", companyId);
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    res.status(200).json({
      success: true,
      message: "Company fetched successfully",
      company,
    });
  } catch (error) {
    logger.error("Fetching company by ID failed: %o", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Edit Company
export const editCompany = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const companyId = req.params.id;
    logger.info(
      "Edit company endpoint hit for ID: %s with body: %o",
      companyId,
      req.body
    );

    // Validate request body
    const { error } = companySchemaValidation.safeParse(req.body);
    if (error) {
      logger.warn("Validation error on editCompany: %s", error.message);
      return res.status(400).json({ success: false, message: error.message });
    }

    const { name, description, location, number, allowed_discount, logo } =
      req.body;

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!existingCompany) {
      logger.warn("Company not found for update: %s", companyId);
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // If the name is changing, make sure no other company has the new name
    if (name && name !== existingCompany.name) {
      const companyWithSameName = await prisma.company.findUnique({
        where: { name },
      });

      if (companyWithSameName) {
        logger.warn("Company name already exists: %s", name);
        return res
          .status(400)
          .json({ success: false, message: "Company name already exists" });
      }
    }

    // Update company
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name,
        description,
        location,
        number,
        allowed_discount,
        logo,
      },
    });

    logger.info("Company updated successfully: %s", companyId);

    res.status(200).json({
      success: true,
      message: "Company updated successfully!",
      company: updatedCompany,
    });
  } catch (error) {
    logger.error("Company update failed: %o", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
