import express, { Router } from "express";
import { validToken } from "../middleware/authMiddleware";
import {
  checkSuperAdmin,
  companyAdminCheck,
  companyAdminWaiterCheck,
} from "../middleware/checkRoles";
import {
  activateTable,
  createTable,
  getAllTableAssignsForCompany,
  getAllTablesForCompany,
  getAllTablesForSuperAdmin,
  mergeTable,
  scanTableByName,
} from "../controller/table-controller";

const tableRouter: Router = express.Router();

tableRouter.post("/create-table", validToken, companyAdminCheck, createTable);

tableRouter.get(
  "/get-table",
  validToken,
  companyAdminWaiterCheck,
  getAllTablesForCompany
);

tableRouter.get("/scan-table/:tableNameParam", scanTableByName);

tableRouter.post(
  "/activate-table",
  validToken,
  companyAdminWaiterCheck,
  activateTable
);

tableRouter.get(
  "/get-table-superAdmin",
  validToken,
  checkSuperAdmin,
  getAllTablesForSuperAdmin
);

tableRouter.post(
  "/merge-table",
  validToken,
  companyAdminWaiterCheck,
  mergeTable
);

tableRouter.get(
  "/get-table-assign",
  validToken,
  companyAdminWaiterCheck,
  getAllTableAssignsForCompany
);

export default tableRouter;
