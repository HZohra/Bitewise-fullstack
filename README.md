# CP317 Group Project: BiteWise - A Dietary Restriction Meal Matcher Platform

## Project Type
**BiteWise** is a **full-stack web application** for **healthy meal planning and recipe tracking**.  
It helps users discover recipes, track nutritional information, and make healthier food choices based on dietary restrictions and allergens.

**Built with:** React + Vite + TailwindCSS (Frontend) | Node.js + Express + MongoDB (Backend)

---

## Project Structure 
```
CP317_Group2_FinalProject/
├── backend/
│   └── bitewise-backend/
│       ├── src/
│       │   ├── app.js                      # Main Express server
│       │   ├── config/                     # Database & API configurations
│       │   ├── middleware/                 # Auth middleware
│       │   ├── models/                     # MongoDB schemas (User, Recipe, ChatHistory)
│       │   ├── routes/                     # API endpoints
│       │   ├── services/                   # Business logic & chatbot
│       │   └── utils/                      # Helper functions
│       └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/                          # React pages/views
│   │   ├── components/                     # Reusable components
│   │   ├── context/                        # Auth & Chat context providers
│   │   ├── api/                            # API client functions
│   │   └── services/                       # Frontend utilities
│   └── package.json
└── README.md
```

---

## ✅ Implemented Features

### 🔐 User Authentication & Profiles
- **Complete user registration and login system** with JWT authentication
- **Password reset functionality** via email with secure token-based reset
- **User profile management** with dietary preferences, allergens, and cooking time limits
- **Account settings page** for managing profile information, phone, and birth date
- **Protected routes** requiring authentication for personalized features
- **MongoDB storage** for secure user data persistence

### 🥗 Recipe Management
- **Edamam API integration** — fetch recipes with nutrition data and diet/health labels
- **Multi-filter recipe search** — combine dietary restrictions (vegan, gluten-free, etc.) with search queries
- **User-created recipes** — full CRUD operations for personal recipe collection
- **Recipe details page** with ingredients, instructions, nutrition info, and diet labels
- **Hybrid recipe database** — combines Edamam API results with user-submitted recipes
- **My Recipes page** — view, edit, and delete personal recipes

### 🤖 AI-Powered Chatbot
- **Intent detection** for recipe search, restaurant finding, allergen explanations, and meal planning
- **Entity extraction** for ingredients, dietary restrictions, and cooking preferences
- **Recipe search via natural language** — "show me quick vegan dinner ideas"
- **Multi-day meal planning** — generate meal plans based on user preferences
- **Allergen substitution suggestions** using curated data
- **Context-aware responses** with formatted recipe recommendations
- **Chatbot UI** with message history and typing indicators

### 🍴 Restaurant Finder
- **OpenStreetMap/Overpass API integration** for nearby restaurant discovery
- **Location-based search** using latitude/longitude coordinates
- **Radius-based filtering** to find restaurants within specified distance
- **Restaurant details** including name, address, and cuisine type

### 📱 Frontend Pages (Fully Implemented)
- **Home** — Landing page with app overview
- **Login/Register** — User authentication flows
- **Forgot/Reset Password** — Password recovery system
- **Recipes** — Browse and search recipes with filters
- **Recipe Details** — View full recipe information
- **Add Recipe** — Create new personal recipes
- **My Recipes** — Manage user-created recipes
- **Chatbot** — Interactive AI assistant
- **Restaurants** — Find nearby dining options
- **Account Overview/Settings** — Manage profile and preferences
- **My Allergies/Diets** — Set dietary restrictions and allergens
- **Favorites** — Save preferred recipes *(UI complete, backend pending)*

---

## 🚧 In Progress / Planned Enhancements

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



//
how should we use MongoDB
1.Stores User Profile + Allergies
2.Store User Search history or Fav ingredients
3.create Dynamic filtering engine ()
