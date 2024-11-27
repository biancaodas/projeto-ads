import express from "express";
import { addUser, deleteUser, getUsers, updateUser } from "../controllers/user.js";

const router = express.Router()

// Backend - routes/user.js
router.get("/", getUsers);  // Rota para obter usuários, agora com suporte a busca por nome

router.post("/", addUser)

router.put("/:id", updateUser)

router.delete("/:id", deleteUser)

export default router