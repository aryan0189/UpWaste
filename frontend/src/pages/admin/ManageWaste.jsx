import { useEffect, useState } from "react";
import API from "../../services/api";

const ManageWaste = () => {
  const [waste, setWaste] = useState([]);

  const fetchWaste = async () => {
    const { data } = await API.get("/waste");
    setWaste(data);
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    await API.delete(`/waste/${id}`);
    fetchWaste();
  };

  useEffect(() => {
    fetchWaste();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-green-600 mb-6">Manage Waste Listings</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {waste.map((item) => (
          <div key={item._id} className="bg-white border p-4 rounded shadow">
            <img src={item.image || "https://via.placeholder.com/300x200"} className="h-40 w-full object-cover rounded" />
            <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-sm text-gray-500 mt-1">Location: {item.location}</p>
            <button
              onClick={() => deleteListing(item._id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageWaste;
