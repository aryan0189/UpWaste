import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { Users, Package, Truck, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    waste: 0,
    pickups: 0,
    revenue: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("upwaste-admin-token");
        const { data } = await API.get("/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      }
    };
  
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("upwaste-admin-token");
    navigate("/admin-login");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Top header with logout */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-green-700">🔐 Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-green-600">{stats.users}</p>
          </div>
          <Users className="text-green-500" />
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Waste</p>
            <p className="text-2xl font-bold text-green-600">{stats.waste}</p>
          </div>
          <Package className="text-green-500" />
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Pickups</p>
            <p className="text-2xl font-bold text-green-600">{stats.pickups}</p>
          </div>
          <Truck className="text-green-500" />
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{stats.revenue}</p>
          </div>
          <DollarSign className="text-green-500" />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-green-100 hover:bg-green-200 transition p-6 rounded-xl shadow text-center"
        >
          <h2 className="text-lg font-semibold text-green-800 mb-2">👥 Manage Users</h2>
          <p className="text-sm text-gray-600">View, block or delete sellers and buyers.</p>
        </Link>

        <Link
          to="/admin/waste"
          className="bg-green-100 hover:bg-green-200 transition p-6 rounded-xl shadow text-center"
        >
          <h2 className="text-lg font-semibold text-green-800 mb-2">🗑️ Manage Waste Listings</h2>
          <p className="text-sm text-gray-600">View and remove inappropriate listings.</p>
        </Link>

        <Link
          to="/admin/pickups"
          className="bg-green-100 hover:bg-green-200 transition p-6 rounded-xl shadow text-center"
        >
          <h2 className="text-lg font-semibold text-green-800 mb-2">🚚 Manage Pickups</h2>
          <p className="text-sm text-gray-600">Track, update, and complete pickups.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
