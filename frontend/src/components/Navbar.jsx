import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  // Smart link destination for "My Dashboard"
  //   const getDashboardLink = () => {
  //     if (!user) return "/login";
  //     if (user.role === "generator") return "/dashboard/generator";
  //     if (user.role === "recycler") return "/dashboard/recycler";
  //     return "/dashboard";
  //   };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          UpWaste
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/listings" className="hover:text-green-600">
            Browse Waste
          </Link>

          <Link to="/dashboard" className="hover:text-green-600">
            My Dashboard
          </Link>

          {user ? (
            <>
              <span className="text-gray-600">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-600">
                Login
              </Link>
              <Link to="/register" className="hover:text-green-600">
                Register
              </Link>

              <Link
                to="/admin-login"
                className="text-sm text-green-600 hover:underline"
              >
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
