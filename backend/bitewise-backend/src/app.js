// Load .env before anything else
import dotenv from "dotenv";
dotenv.config();

// Packages
import express from "express";
import cors from "cors";

// DB + Routers
import { connectDB } from "./config/db.js";
import recipesRouter from "./routes/recipes.js";
import chatbotRouter from "./routes/chatbot.js";
import authRouter from "./routes/auth.js";
import myRecipesRouter from "./routes/my_recipes.js";
import restaurantRouter from "./routes/resturant.js";

console.log("Loaded App ID:", process.env.EDAMAM_APP_ID);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/recipes", recipesRouter);
app.use("/chat", chatbotRouter);
app.use("/my-recipes", myRecipesRouter);
app.use("/restaurants", restaurantRouter);

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// 🔥 FIX: Define PORT BEFORE using it
const PORT = process.env.PORT || 5000;

// Start server AFTER MongoDB connects
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
