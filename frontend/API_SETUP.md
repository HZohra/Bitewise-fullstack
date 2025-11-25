# Frontend-Backend API Integration Guide

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:5002
```

**Note:** The default is `http://localhost:5002` if not specified.

### 2. Start Backend Server

```bash
cd backend/bitewise-backend
npm start
```

Backend should run on port 5002.

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on port 5173 (or next available port).

---

## 📁 API Service Files

All API calls are centralized in the `src/api/` directory:

### **`config.js`** - Centralized Configuration
- Base URL configuration
- Authentication helper
- Error handling

### **`auth.js`** - Authentication
- `registerUser()` - User registration
- `loginUser()` - User login
- `fetchMe()` - Get current user
- `forgotPassword()` - Request password reset
- `resetPassword()` - Reset password

### **`recipes.js`** - Recipe Operations
- `searchRecipes(query, filters)` - Search recipes
- `getRecipeDetails(recipeId)` - Get recipe details

### **`chatbot.js`** - Chatbot
- `sendChatMessage(text, profile)` - Send message to chatbot
- `getUserProfile()` - Get user profile for context

### **`myRecipes.js`** - User Recipes
- `getMyRecipes()` - Get user's saved recipes
- `addRecipe(recipeData)` - Add new recipe
- `updateRecipe(recipeId, recipeData)` - Update recipe
- `deleteRecipe(recipeId)` - Delete recipe

### **`user.js`** - User Management
- `getUserProfile()` - Get user profile
- `updateUserProfile(profileData)` - Update profile
- `updateUserPreferences(preferences)` - Update preferences
- `changePassword(currentPassword, newPassword)` - Change password

### **`restaurants.js`** - Restaurant Search
- `searchRestaurants(query, location)` - Search restaurants

---

## 💡 Usage Examples

### Example 1: Search Recipes

```javascript
import { searchRecipes } from '../api/recipes.js';

const handleSearch = async () => {
  try {
    const results = await searchRecipes('pasta', ['vegan', 'gluten-free']);
    console.log(results);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Example 2: Send Chatbot Message

```javascript
import { sendChatMessage } from '../api/chatbot.js';

const handleChat = async () => {
  try {
    const response = await sendChatMessage('Show me vegan recipes', {
      diets: ['vegan'],
      allergens: ['dairy']
    });
    console.log(response.response);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Example 3: Authenticated Request

```javascript
import { getUserProfile } from '../api/user.js';

// Token is automatically included from localStorage
const getProfile = async () => {
  try {
    const profile = await getUserProfile();
    console.log(profile);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

---

## 🔐 Authentication

### How It Works

1. **Login/Register** - Returns a JWT token
2. **Store Token** - Save token in `localStorage`
3. **Automatic Inclusion** - All API requests automatically include token in headers

### Example:

```javascript
import { loginUser } from '../api/auth.js';

const handleLogin = async (email, password) => {
  try {
    const { user, token } = await loginUser({ email, password });
    localStorage.setItem('token', token);
    // Token is now automatically included in all future requests
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

---

## 🛠️ Updating Existing Components

### Before (Hardcoded URL):
```javascript
const response = await fetch('http://localhost:5002/recipes?q=pasta');
```

### After (Using API Service):
```javascript
import { searchRecipes } from '../api/recipes.js';
const results = await searchRecipes('pasta');
```

---

## ✅ Benefits

1. **Centralized Configuration** - Change backend URL in one place
2. **Automatic Authentication** - Tokens included automatically
3. **Error Handling** - Consistent error handling across all requests
4. **Type Safety** - Clear function signatures
5. **Maintainability** - Easy to update and maintain

---

## 🔧 Troubleshooting

### Backend Not Connecting?
1. Check if backend is running: `lsof -i :5002`
2. Verify CORS is enabled in backend
3. Check `.env` file has correct `VITE_BACKEND_URL`

### Authentication Errors?
1. Check if token exists: `localStorage.getItem('token')`
2. Verify token is valid
3. Check backend authentication middleware

### API Errors?
1. Check browser console for error messages
2. Verify backend endpoints are correct
3. Check network tab in browser dev tools

---

## 📝 Next Steps

1. Update all components to use the new API services
2. Remove hardcoded URLs from components
3. Add error handling UI
4. Add loading states
5. Test all API endpoints

