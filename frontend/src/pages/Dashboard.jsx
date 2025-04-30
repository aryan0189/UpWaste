import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "generator") {
      navigate("/dashboard/generator");
    } else if (user.role === "recycler") {
      navigate("/dashboard/recycler");
    } else {
      navigate("/"); // fallback
    }
  }, [user, navigate]);

  return null; // nothing is shown; it just redirects
};

export default Dashboard;
