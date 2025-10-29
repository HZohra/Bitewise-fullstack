import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-teal-500 text-white flex justify-around items-center py-3 shadow-md">
      <h1 className="text-lg font-bold">BiteWise</h1>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-orange-300">Home</Link>
        <Link to="/recipes" className="hover:text-orange-300">Recipes</Link>
        <Link to="/restaurants" className="hover:text-orange-300">Restaurants</Link>
        <Link to="/add" className="hover:text-orange-300">Add Recipe</Link>
        <Link to="/chatbot" className="hover:text-orange-300">Chatbot</Link>
      </div>
    </nav>
  );
}
