import "dotenv/config";

import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler";
import { dbConnection } from "./utils/prisma";
import userRouter from "./routes/userRoutes";
import companyRouter from "./routes/companyRoutes";
import tableRouter from "./routes/tableRoutes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 6001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Received body, ${req.body}`);
  next();
});

app.use("/api/auth", userRouter);
app.use("/api", companyRouter);
app.use("/api", tableRouter);

app.use(errorHandler);

async function startServer() {
  try {
    await dbConnection();

    app.listen(PORT, () => {
      logger.info(`🚀 API Gateway is running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("❌ Server failed to start", err);
    process.exit(1);
  }
}

startServer();
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
