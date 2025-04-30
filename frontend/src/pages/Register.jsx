import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "generator",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? "" : "Enter a valid email");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;

    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", form);
      localStorage.setItem("upwaste-user", JSON.stringify(data));
      alert("Registration successful!");

      // ✅ Redirect based on role
      if (data.role === "generator") {
        navigate("/dashboard/generator");
      } else if (data.role === "recycler") {
        navigate("/dashboard/recycler");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-green-600">
          Create your UpWaste account
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          value={form.name}
          required
          className="w-full border p-3 rounded"
        />

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            required
            className="w-full border p-3 rounded"
          />
          {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
            className="w-full border p-3 rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-500 hover:text-gray-800"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Role selection */}
        <div className="flex justify-between gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="generator"
              checked={form.role === "generator"}
              onChange={handleChange}
            />
            Generator
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="recycler"
              checked={form.role === "recycler"}
              onChange={handleChange}
            />
            Recycler
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || emailError}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
