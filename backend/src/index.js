import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { connectDb } from './lib/db.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';

const port = process.env.PORT || 7500;
const app = express();

app.use(express.json({ limit: "10mb" })); // Increased limit for base64 images
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Connect DB first, then start server
connectDb().then(() => {
  app.listen(port, () => {
    console.log(`🌐 Server running on port ${port}`);
  });
});
