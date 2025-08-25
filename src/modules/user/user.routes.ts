import { Router } from "express";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/check.auth";
// import { validationRequest } from "../../middlewares/validation.request";
// import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();


// router.post("/register", UserController.createUser, validationRequest(createUserZodSchema));
router.get("/all-users" , UserController.getAllUsers, checkAuth(Role.Admin, Role.SuperAdmin));
// router.patch("/:id", UserController.updateUser, checkAuth(...Object.values(Role)), validationRequest(updateUserZodSchema));
router.patch('/user-status/:id', checkAuth(Role.Admin, Role.SuperAdmin), UserController.UserStatus);

export const usersRoutes = router;