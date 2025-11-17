// Main application setup for BiteWise backend using Express.js


//loads .env before anything else, so all routes and configs can access it.
import dotenv from 'dotenv';  //loads secret keys and environment variables from your .env file (like your Edamam App ID and API key)
dotenv.config();

//import core packages
import express from 'express'; // Web framework
import cors from 'cors';  // Enable Cross-Origin Resource Sharing (frontend can talk to backend)

//Routers
import { connectDB } from "./config/db.js"; // Database connection
import recipesRouter from './routes/recipes.js'; // Recipe search route
import chatbotRouter from './routes/chatbot.js'; // Chatbot interaction route
import authRouter from './routes/auth.js';
//import resturant as well here later when available

console.log('Loaded App ID:', process.env.EDAMAM_APP_ID);

const app = express(); //initialize the server

//Global middlewares
app.use(cors());  // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

app.use('/auth', authRouter); // Authentication routes
app.use('/recipes', recipesRouter); // Recipe search API route
app.use('/chat', chatbotRouter);  // Chatbot interaction API route
//add resturant route here later when available

// Handle 404 for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
});