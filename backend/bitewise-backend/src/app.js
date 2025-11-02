// Main application setup for BiteWise backend using Express.js

import express from 'express'; // Web framework
import cors from 'cors';  // Enable Cross-Origin Resource Sharing (frontend can talk to backend)
import recipesRouter from './routes/recipes.js'; // Recipe search route
import chatbotRouter from './routes/chatbot.js'; // Chatbot interaction route
import dotenv from 'dotenv';  //loads secret keys and environment variables from your .env file (like your Edamam App ID and API key)
dotenv.config();
console.log('Loaded App ID:', process.env.EDAMAM_APP_ID);

const app = express(); //initialize the server
app.use(cors());  // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use('/recipes', recipesRouter); // Recipe search API route
app.use('/chat', chatbotRouter);  // Chatbot interaction API route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


