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
import restaurantRouter from "./routes/restaurant.js";

console.log("Loaded App ID:", process.env.EDAMAM_APP_ID);

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));
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
const PORT = process.env.PORT || 5002;

// Start server - MongoDB connection is optional for some endpoints
// Try to connect to MongoDB, but don't block server startup
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.warn("⚠️  MongoDB connection failed:", err.message);
    console.warn("⚠️  Server will start anyway, but auth endpoints may not work");
  })
  .finally(() => {
    // Start server regardless of MongoDB connection status
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Endpoints available:`);
      console.log(`   - GET  /recipes`);
      console.log(`   - POST /chat/ask`);
      console.log(`   - GET  /restaurants/nearby`);
      console.log(`   - POST /auth/register (requires MongoDB)`);
      console.log(`   - POST /auth/login (requires MongoDB)`);
    });
  });
