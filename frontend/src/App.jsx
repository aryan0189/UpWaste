import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WasteList from "./pages/WasteList";
import PostWaste from "./pages/PostWaste";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import GeneratorDashboard from "./pages/GeneratorDashboard";
import RecyclerDashboard from "./pages/RecyclerDashboard";
import MyListings from "./pages/MyListings";
import EditWaste from "./pages/EditWaste";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageWaste from "./pages/admin/ManageWaste";
import ManagePickups from "./pages/admin/ManagePickups";
import AdminLogin from "./pages/auth/AdminLogin";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/waste"
          element={
            <AdminRoute>
              <ManageWaste />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/pickups"
          element={
            <AdminRoute>
              <ManagePickups />
            </AdminRoute>
          }
        />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/generator"
          element={
            <ProtectedRoute>
              <GeneratorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-waste/:id"
          element={
            <ProtectedRoute>
              <EditWaste />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/recycler"
          element={
            <ProtectedRoute>
              <RecyclerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<WasteList />} />
        <Route
          path="/post-waste"
          element={
            <ProtectedRoute>
              <PostWaste />
            </ProtectedRoute>
          }
        />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/waste" element={<ManageWaste />} />
        <Route path="/admin/pickups" element={<ManagePickups />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
