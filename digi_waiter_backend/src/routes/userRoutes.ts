import express, { Router } from "express";
import {
  editUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controller/user-controller";

const userRouter: Router = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh-token", refreshToken);
userRouter.post("/logout", logoutUser);
userRouter.put("/user/:id", editUser);

export default userRouter;
