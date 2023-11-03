import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    editUser,
    deleteUser
} from "../controllers/UserController.js";
import {
    Login,
    Logout
} from "../controllers/Auth.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

router.get("/api/users", verifyToken ,getUsers)
    .get("/api/user/:id",verifyToken, getUserById)
    .post("/api/users", createUser)
    .patch("/api/user/:id", editUser)
    .delete("/api/user/:id", deleteUser)
    .post("/login", Login)
    .delete("/logout", Logout)
    .get("/refresh-token", refreshToken)

export default router;