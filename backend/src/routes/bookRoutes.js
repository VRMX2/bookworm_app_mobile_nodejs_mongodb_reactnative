import express from "express";
import { createBook, getAllBooks, getUserBooks, getBookById, updateBook, deleteBook } from "../controllers/book.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBook);
router.get("/", getAllBooks);
router.get("/user", authMiddleware, getUserBooks);
router.get("/:id", getBookById);
router.put("/:id", authMiddleware, updateBook);
router.delete("/:id", authMiddleware, deleteBook);

export default router;
