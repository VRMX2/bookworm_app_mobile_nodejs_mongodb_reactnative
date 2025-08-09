import express from "express";
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create book
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please provide title, caption, rating, and image" });
    }

    const uploadResponse = await cloudinary.uploader.upload(image);
    const newBook = await Book.create({
      title,
      caption,
      rating,
      image: uploadResponse.secure_url,
      user: req.user._id,
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all books with pagination
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "username profileImage").lean(),
      Book.countDocuments(),
    ]);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's books
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error("Get user books error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("user", "username email profileImage").lean();
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update book
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this book" });
    }

    if (image && image !== book.image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      book.image = uploadResponse.secure_url;
    }

    if (title) book.title = title;
    if (caption) book.caption = caption;
    if (rating) book.rating = rating;

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete book
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this book" });
    }

    if (book.image?.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Error deleting image from Cloudinary", err);
      }
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
