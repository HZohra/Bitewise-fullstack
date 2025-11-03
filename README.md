# CP317 Group Project: BiteWise - A Dietary Restriction Meal Matcher Platform

## Project Type
**BiteWise** is a **full-stack web application** for **healthy meal planning and recipe tracking**.  
It helps users discover recipes, track nutritional information, and make healthier food choices.  

**Built with:** React + Vite + TailwindCSS (Frontend) | Node.js + Express (Backend)


## Project Structure 
- BiteWise/
- ├── backend/           # Backend server built with Node.js and Express
- ├── frontend/          # Frontend application developed using React and Vite
- ├── .gitignore         # Specifies files and folders to be ignored by Git
- ├── README.md          # Project overview, setup instructions, and documentation
- ├── package-lock.json  # Automatically generated file to lock dependency versions
- └── .vscode/           # VS Code workspace & configurations


## Core Functionality
- 🥗 Edamam API integration — connect to the Edamam API for recipe and nutrition data *(coming soon!)*
- 👤 User profiles and authentication - allow users to save preferences, dietary restrictions, and favorite recipes.
- 🔍 Recipe search and filtering — find recipes based on multiple restrictions and preparation time.
- 💾 Store User Info — save user details such as allergens, dietary restrictions, and meal preferences securely.
- ⚙️ Settings & Login/Sign Up Pages *(coming soon!)* — provide user account management and customization options.

---

##🍽️ Additional Features
- 🍴 **Restaurant Finder** *(coming soon!)* — connect with **Google** and **Yelp APIs** to help users locate nearby restaurants matching their dietary needs.  
- 🧑‍🍳 **Add Your Own Recipe** *(coming soon!)* — enable users to upload and share their favorite recipes with allergen tags and categories.  
- ❤️ **Favorite Recipes Page** *(coming soon!)* — allow users to save and view their favorite meals for quick access.  
- 🤖 **AI Chatbot** *(coming soon!)* — help users with quick recipe searches, allergen explanations, and personalized meal planning suggestions.  
- ✅ **Unit Tests and Automated Testing** — ensure consistent and reliable functionality across the app.
//======================================================

#1- chatbot improvements:
- 🧠 Core Intelligence Improvements
- Add context memory so the chatbot remembers past messages and can follow up naturally.
- Expand entity extraction (detect ingredients, cuisines, quantities, or sentiments).
- Support multiple languages for basic food queries.

#2- Functional Features to Add
- Implement Restaurant Finder (connect Google Places or Yelp API).
- Add Shopping List Generator (convert meal plans or recipes to grocery lists).
- Build User Profiles (store diets, allergens, cuisines, favorites).
- Enhance Allergen Explainer with icons and safe substitution suggestions.
- Introduce Meal Planner for multi-day suggestions.

#3- Response & Interaction Enhancements
- Improve response formatting (add images, buttons, recipe preview cards).
- Provide suggested prompts on fallback (“Try asking: …”).
- Add typing indicators and smooth animations for better UX.
- Use Markdown or rich text for recipe formatting (titles, links, emojis).

#4- Backend & Performance
- Add logging & analytics for user queries and API performance.
- Enable rate limiting to prevent Edamam API overuse.
- Implement retry logic for failed API calls.
- Add /health route and monitoring for backend uptime.

#5- Frontend UX & Features
- Add avatars for user and bot messages.
- Include recipe images and clickable cards.
- Create a chat history panel for past sessions.
- Add voice input (use Web Speech API).
- Allow bookmarking / saving / exporting recipes or shopping lists.

#6- Future Integrations
- Integrate nutrition breakdown (calories, macros) via Edamam Nutrition API.
- Connect Google Calendar API for meal scheduling.
- Implement recommendation system (suggest recipes based on user history).
- Upgrade to an AI-powered intent detector (OpenAI or Hugging Face model)

//================================================
Recipe Manager:
🍽️ Recipe Manager Module – Scope & Progress
#Current Scope (from proposal)
- Static, searchable recipe database labeled with dietary categories (vegan, gluten-free, etc.).
- Multi-restriction filtering so users can combine dietary filters for more inclusive results.
- Community “Add a Recipe” feature allowing uploads tagged with dietary restrictions.
- Nutrition information integration planned for later implementation.
- Clear allergy labelling on every recipe for transparency and safety.
- Edamam API connection for fetching recipe and nutrition data.
- Backend endpoints (e.g., /recipes) and chatbot integration for recipe search and allergen explanations.

# next steps
1- Add-a-Recipe form on frontend with upload, labeling, and validation.
2- Local recipe storage (MongoDB or SQLite) to hold user-submitted recipes.
3- Nutrition facts display beside each recipe (calories, macros from Edamam API).
4- User-facing “My Recipes” page to view and edit personal uploads.
5- Admin moderation or tagging tools for verifying dietary labels.
6- Enhanced filter UI (checkboxes/tags for diet types and allergens).
7- Usability testing for clarity of diet/allergy filters and recipe submission flow.