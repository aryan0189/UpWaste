import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { LoaderCircle, Save } from "lucide-react";

const EditWaste = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    weight: "",
    price: "",
    location: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWaste = async () => {
      try {
        const { data } = await API.get(`/waste/${id}`);
        setForm(data);
      } catch (err) {
        alert("Failed to load listing for editing.");
        navigate("/my-listings");
      }
    };

    fetchWaste();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/waste/${id}`, form);
      alert("Listing updated successfully!");
      navigate("/my-listings");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Edit Waste Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow border">

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border p-3 rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Weight (kg)"
            className="w-full border p-3 rounded"
          />

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (₹)"
            className="w-full border p-3 rounded"
          />
        </div>

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          {loading ? (
            <>
              <LoaderCircle className="animate-spin w-5 h-5" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditWaste;
