import express from 'express';
import cors from 'cors';
import recipesRouter from './routes/recipes.js';
import chatbotRouter from './routes/chatbot.js';
import dotenv from 'dotenv';
dotenv.config();
console.log('Loaded App ID:', process.env.EDAMAM_APP_ID);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/recipes', recipesRouter);
app.use('/chat', chatbotRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


