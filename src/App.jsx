import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Restaurants from "./pages/Restaurants";
import AddRecipe from "./pages/AddRecipe";
import Chatbot from "./pages/Chatbot";
import RecipeDetails from "./pages/RecipeDetails";
import MyRecipes from "./pages/MyRecipes"; 


function App() {
  return (
    <div className="min-h-screen bg-green-50 text-gray-900">
      <NavBar />

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
