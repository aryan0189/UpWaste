import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { PlusCircle, LoaderCircle } from "lucide-react";

const PostWaste = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    weight: "",
    price: "",
    location: "",
    image: "",
    postedBy: JSON.parse(localStorage.getItem("upwaste-user"))?._id || "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/waste", form);
      alert("Waste listed successfully!");
      navigate("/my-listings");
    } catch (err) {
      console.error(err);
      alert("Failed to post waste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Post Waste</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow border">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          {loading ? (
            <>
              <LoaderCircle className="animate-spin w-5 h-5" /> Posting...
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" /> Post Waste
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PostWaste;
