import express, { Router } from "express";
import {
  createCompany,
  editCompany,
  getAllCompanies,
  getCompanyById,
} from "../controller/company-controller";
import { validToken } from "../middleware/authMiddleware";
import { checkSuperAdmin, companyAdminCheck } from "../middleware/checkRoles";

const companyRouter: Router = express.Router();

companyRouter.post(
  "/create-company",
  validToken,
  checkSuperAdmin,
  createCompany
);

companyRouter.get("/get-company", validToken, checkSuperAdmin, getAllCompanies);

companyRouter.get(
  "/get-company/:id",
  validToken,
  companyAdminCheck,
  getCompanyById
);

companyRouter.put(
  "/edit-company/:id",
  validToken,
  companyAdminCheck,
  editCompany
);

export default companyRouter;
