import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Trash2, Pencil } from "lucide-react"; // ✅ Lucide icons

const MyListings = () => {
  const { user } = useAuth();
  const [myWaste, setMyWaste] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyWaste = async () => {
      try {
        const { data } = await API.get("/waste");
        const userWaste = data.filter((item) => item.postedBy === user._id);
        setMyWaste(userWaste);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    if (user) fetchMyWaste();
  }, [user]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this listing?");
    if (!confirm) return;

    try {
      await API.delete(`/waste/${id}`);
      setMyWaste((prev) => prev.filter((item) => item._id !== id));
      alert("Listing deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete listing");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-waste/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-green-600">My Waste Listings</h1>

      {myWaste.length === 0 ? (
        <p className="text-gray-500">You haven’t posted any waste yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {myWaste.map((item) => (
            <div key={item._id} className="bg-white shadow rounded-lg border p-4">
              <img
                src={item.image || "https://via.placeholder.com/300x200.png?text=No+Image"}
                alt={item.title}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-3">{item.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="text-sm text-gray-500 mb-2">
                <p>Category: {item.category}</p>
                <p>Weight: {item.weight || "N/A"} kg</p>
                <p>Price: ₹{item.price || "0"}</p>
                <p>Location: {item.location || "N/A"}</p>
              </div>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleEdit(item._id)}
                  className="flex items-center gap-1 text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex items-center gap-1 text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
