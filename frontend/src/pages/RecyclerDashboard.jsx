// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import API from "../services/api";
// import { Truck, MapPin, X, ShoppingCart, Info, Package } from "lucide-react";

// const RecyclerDashboard = () => {
//   const { user } = useAuth();
//   const [wasteData, setWasteData] = useState([]);
//   const [stats, setStats] = useState({ totalSpent: 0, scheduled: 0, completed: 0 });
//   const [scheduledList, setScheduledList] = useState([]);
//   const [showScheduled, setShowScheduled] = useState(false);
//   const [filter, setFilter] = useState({ category: "", location: "" });
//   const [cart, setCart] = useState(() => {
//     const saved = localStorage.getItem("recycler-cart");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [selectedWaste, setSelectedWaste] = useState(null);
//   const [quantity, setQuantity] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [priceEstimate, setPriceEstimate] = useState(0);

//   useEffect(() => {
//     const fetchWaste = async () => {
//       const { data } = await API.get("/waste");
//       setWasteData(data);
//     };

//     const fetchStats = async () => {
//       const { data } = await API.get(`/pickup/stats/${user._id}`);
//       setStats(data);
//     };

//     const fetchScheduled = async () => {
//       const { data } = await API.get(`/pickup/scheduled/${user._id}`);
//       setScheduledList(data);
//     };

//     fetchWaste();
//     fetchStats();
//     fetchScheduled();
//   }, [user]);

//   const handleRequestClick = (item) => {
//     setSelectedWaste(item);
//     setQuantity("");
//     setPriceEstimate(0);
//     setShowModal(true);
//   };

//   const submitPickupRequest = async () => {
//     if (!quantity || quantity <= 0) return alert("Enter a valid quantity");

//     try {
//       await API.post("/pickup", {
//         wasteId: selectedWaste._id,
//         recyclerId: user._id,
//         quantity,
//       });

//       alert("Pickup requested successfully!");
//       setShowModal(false);
//       setQuantity("");
//     } catch (err) {
//       console.error("Pickup request failed:", err);
//       alert("Failed to request pickup");
//     }
//   };

//   const handleQuantityChange = (e) => {
//     const val = e.target.value;
//     setQuantity(val);
//     const unitPrice = selectedWaste?.price / selectedWaste?.weight || 0;
//     const total = Math.round(unitPrice * val);
//     setPriceEstimate(total);
//   };

//   const addToCart = (item) => {
//     const exists = cart.find((c) => c._id === item._id);
//     if (exists) return alert("Already in cart");

//     const updatedCart = [...cart, item];
//     setCart(updatedCart);
//     localStorage.setItem("recycler-cart", JSON.stringify(updatedCart));
//     alert("Added to cart");
//   };

//   const completePickup = async (id) => {
//     try {
//       await API.put(`/pickup/complete/${id}`);
//       alert("Marked as completed!");

//       const [statsRes, schedRes] = await Promise.all([
//         API.get(`/pickup/stats/${user._id}`),
//         API.get(`/pickup/scheduled/${user._id}`),
//       ]);
//       setStats(statsRes.data);
//       setScheduledList(schedRes.data);
//     } catch (err) {
//       console.error("Failed to complete pickup:", err);
//       alert("Something went wrong");
//     }
//   };

//   const filteredWaste = wasteData.filter(
//     (item) =>
//       (!filter.category || item.category === filter.category) &&
//       (!filter.location || item.location === filter.location)
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold text-green-600 mb-6">
//         Welcome, {user?.name || "Recycler"} 👋
//       </h1>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-4 rounded shadow border flex justify-between items-center">
//           <div>
//             <p className="text-sm text-gray-500">💰 Money Spent</p>
//             <p className="text-2xl font-bold text-green-600">₹{stats.totalSpent}</p>
//           </div>
//           <Info className="cursor-pointer" onClick={() => alert(`Total spent on all completed pickups: ₹${stats.totalSpent}`)} />
//         </div>
//         <div
//           onClick={() => setShowScheduled(true)}
//           className="bg-white p-4 rounded shadow border cursor-pointer hover:bg-blue-50 transition"
//         >
//           <p className="text-sm text-gray-500">📦 Scheduled Pickups</p>
//           <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow border">
//           <p className="text-sm text-gray-500">📜 Previous Orders</p>
//           <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <select
//           value={filter.category}
//           onChange={(e) => setFilter({ ...filter, category: e.target.value })}
//           className="border px-4 py-2 rounded"
//         >
//           <option value="">All Categories</option>
//           {[...new Set(wasteData.map((w) => w.category))].map((c) => (
//             <option key={c} value={c}>{c}</option>
//           ))}
//         </select>

//         <select
//           value={filter.location}
//           onChange={(e) => setFilter({ ...filter, location: e.target.value })}
//           className="border px-4 py-2 rounded"
//         >
//           <option value="">All Locations</option>
//           {[...new Set(wasteData.map((w) => w.location))].map((loc) => (
//             <option key={loc} value={loc}>{loc}</option>
//           ))}
//         </select>
//       </div>

//       {/* Waste Listings */}
//       <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
//         {filteredWaste.map((item) => (
//           <div key={item._id} className="bg-white border rounded-lg shadow p-4 flex flex-col">
//             <img
//               src={item.image || "https://dummyimage.com/300x200/eeeeee/aaa&text=No+Image"}
//               alt={item.title}
//               className="w-full h-48 object-cover rounded"
//             />
//             <h3 className="text-lg font-bold mt-3">{item.title}</h3>
//             <p className="text-sm text-gray-600">{item.description}</p>
//             <div className="text-sm text-gray-500 mt-2 space-y-1">
//               <p>Category: {item.category}</p>
//               <p>Weight: {item.weight} kg</p>
//               <p>Price: ₹{item.price}</p>
//               <p className="flex items-center gap-1">
//                 <MapPin size={16} /> {item.location}
//               </p>
//             </div>

//             <button
//               onClick={() => handleRequestClick(item)}
//               className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition"
//             >
//               <Truck size={16} /> Request Pickup
//             </button>

//             <button
//               onClick={() => addToCart(item)}
//               className="mt-2 flex items-center justify-center gap-2 bg-yellow-500 text-white text-sm py-2 rounded hover:bg-yellow-600 transition"
//             >
//               <ShoppingCart size={16} /> Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Request Modal */}
//       {showModal && selectedWaste && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
//             <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
//               <X />
//             </button>
//             <h2 className="text-xl font-bold mb-4">Request Pickup for <span className="text-green-600">{selectedWaste.title}</span></h2>
//             <input
//               type="number"
//               placeholder="Enter quantity (kg)"
//               value={quantity}
//               onChange={handleQuantityChange}
//               className="w-full border p-3 rounded mb-2"
//             />
//             <p className="text-sm text-gray-600 mb-4">Estimated Price: ₹{priceEstimate}</p>
//             <button
//               onClick={submitPickupRequest}
//               className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//             >
//               Confirm Request
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Scheduled Pickup Popup */}
//       {showScheduled && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-20 px-4">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
//             <button onClick={() => setShowScheduled(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
//               <X />
//             </button>
//             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//               <Package size={20} /> Scheduled Pickups
//             </h2>
//             {scheduledList.length === 0 ? (
//               <p className="text-sm text-gray-500">No pickups scheduled yet.</p>
//             ) : (
//               <ul className="divide-y">
//                 {scheduledList.map((pickup) => (
//                   <li key={pickup._id} className="py-3 text-sm flex justify-between items-center">
//                     <div>
//                       {pickup.quantity} kg of <b>{pickup.wasteId?.title}</b> from <span className="text-gray-600">{pickup.wasteId?.location}</span>
//                     </div>
//                     <button
//                       onClick={() => completePickup(pickup._id)}
//                       className="text-green-600 hover:underline text-xs"
//                     >
//                       Mark as Completed
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecyclerDashboard;
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import {
  Truck,
  MapPin,
  X,
  ShoppingCart,
  Info,
  Package,
  CheckCircle,
  ReceiptText,
} from "lucide-react";

const RecyclerDashboard = () => {
  const { user } = useAuth();
  const [wasteData, setWasteData] = useState([]);
  const [stats, setStats] = useState({ totalSpent: 0, scheduled: 0, completed: 0 });
  const [scheduledList, setScheduledList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [showScheduled, setShowScheduled] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showSpent, setShowSpent] = useState(false);
  const [filter, setFilter] = useState({ category: "", location: "" });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("recycler-cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedWaste, setSelectedWaste] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [priceEstimate, setPriceEstimate] = useState(0);

  useEffect(() => {
    const fetchWaste = async () => {
      const { data } = await API.get("/waste");
      setWasteData(data);
    };

    const fetchStats = async () => {
      const { data } = await API.get(`/pickup/stats/${user._id}`);
      setStats(data);
    };

    const fetchScheduled = async () => {
      const { data } = await API.get(`/pickup/scheduled/${user._id}`);
      setScheduledList(data);
    };

    const fetchCompleted = async () => {
      const { data } = await API.get(`/pickup/completed/${user._id}`);
      setCompletedList(data);
    };

    fetchWaste();
    fetchStats();
    fetchScheduled();
    fetchCompleted();
  }, [user]);

  const handleRequestClick = (item) => {
    setSelectedWaste(item);
    setQuantity("");
    setPriceEstimate(0);
    setShowModal(true);
  };

  const submitPickupRequest = async () => {
    if (!quantity || quantity <= 0) return alert("Enter a valid quantity");
    try {
      await API.post("/pickup", {
        wasteId: selectedWaste._id,
        recyclerId: user._id,
        quantity,
      });
      alert("Pickup requested successfully!");
      setShowModal(false);
      setQuantity("");
    } catch (err) {
      console.error("Pickup request failed:", err);
      alert("Failed to request pickup");
    }
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    setQuantity(val);
    const unitPrice = selectedWaste?.price / selectedWaste?.weight || 0;
    const total = Math.round(unitPrice * val);
    setPriceEstimate(total);
  };

  const addToCart = (item) => {
    const exists = cart.find((c) => c._id === item._id);
    if (exists) return alert("Already in cart");
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    localStorage.setItem("recycler-cart", JSON.stringify(updatedCart));
    alert("Added to cart");
  };

  const completePickup = async (id) => {
    try {
      await API.put(`/pickup/complete/${id}`);
      alert("Marked as completed!");
      const [statsRes, schedRes, completedRes] = await Promise.all([
        API.get(`/pickup/stats/${user._id}`),
        API.get(`/pickup/scheduled/${user._id}`),
        API.get(`/pickup/completed/${user._id}`),
      ]);
      setStats(statsRes.data);
      setScheduledList(schedRes.data);
      setCompletedList(completedRes.data);
    } catch (err) {
      console.error("Failed to complete pickup:", err);
      alert("Something went wrong");
    }
  };

  const filteredWaste = wasteData.filter(
    (item) =>
      (!filter.category || item.category === filter.category) &&
      (!filter.location || item.location === filter.location)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Welcome, {user?.name || "Recycler"} 👋
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          onClick={() => setShowSpent(true)}
          className="bg-white p-4 rounded shadow border flex justify-between items-center cursor-pointer hover:bg-green-50"
        >
          <div>
            <p className="text-sm text-gray-500">💰 Money Spent</p>
            <p className="text-2xl font-bold text-green-600">₹{stats.totalSpent}</p>
          </div>
          <ReceiptText />
        </div>
        <div
          onClick={() => setShowScheduled(true)}
          className="bg-white p-4 rounded shadow border cursor-pointer hover:bg-blue-50 transition"
        >
          <p className="text-sm text-gray-500">📦 Scheduled Pickups</p>
          <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
        </div>
        <div
          onClick={() => setShowCompleted(true)}
          className="bg-white p-4 rounded shadow border cursor-pointer hover:bg-gray-50"
        >
          <p className="text-sm text-gray-500">📜 Previous Orders</p>
          <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
        </div>
      </div>

      {/* Previous Orders Modal */}
      {showCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-20 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button onClick={() => setShowCompleted(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4"><CheckCircle size={20} className="inline" /> Previous Completed Orders</h2>
            {completedList.length === 0 ? (
              <p className="text-sm text-gray-500">No completed pickups yet.</p>
            ) : (
              <ul className="divide-y text-sm">
                {completedList.map((pickup) => (
                  <li key={pickup._id} className="py-3">
                    ✅ {pickup.quantity} kg of <b>{pickup.wasteId?.title}</b> from <i>{pickup.wasteId?.location}</i><br />
                    <span className="text-gray-500 text-xs">{new Date(pickup.updatedAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Money Spent Modal */}
      {showSpent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-20 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button onClick={() => setShowSpent(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4"><ReceiptText size={20} className="inline" /> Money Spent Details</h2>
            {completedList.length === 0 ? (
              <p className="text-sm text-gray-500">No completed pickups to show.</p>
            ) : (
              <ul className="divide-y text-sm">
                {completedList.map((pickup) => {
                  const unitPrice = pickup.wasteId?.price / pickup.wasteId?.weight || 0;
                  const cost = Math.round(unitPrice * pickup.quantity);
                  return (
                    <li key={pickup._id} className="py-3">
                      ₹{cost} — <b>{pickup.quantity} kg of {pickup.wasteId?.title}</b><br />
                      <span className="text-gray-500 text-xs">{new Date(pickup.updatedAt).toLocaleString()}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Scheduled Pickup Modal remains unchanged */}
      {/* Request Modal remains unchanged */}
      {/* Waste Listings remain unchanged */}
      

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Categories</option>
          {[...new Set(wasteData.map((w) => w.category))].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filter.location}
          onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Locations</option>
          {[...new Set(wasteData.map((w) => w.location))].map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Waste Listings */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredWaste.map((item) => (
          <div key={item._id} className="bg-white border rounded-lg shadow p-4 flex flex-col">
            <img
              src={item.image || "https://dummyimage.com/300x200/eeeeee/aaa&text=No+Image"}
              alt={item.title}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-lg font-bold mt-3">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="text-sm text-gray-500 mt-2 space-y-1">
              <p>Category: {item.category}</p>
              <p>Weight: {item.weight} kg</p>
              <p>Price: ₹{item.price}</p>
              <p className="flex items-center gap-1">
                <MapPin size={16} /> {item.location}
              </p>
            </div>

            <button
              onClick={() => handleRequestClick(item)}
              className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition"
            >
              <Truck size={16} /> Request Pickup
            </button>

            <button
              onClick={() => addToCart(item)}
              className="mt-2 flex items-center justify-center gap-2 bg-yellow-500 text-white text-sm py-2 rounded hover:bg-yellow-600 transition"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Request Modal */}
      {showModal && selectedWaste && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Request Pickup for <span className="text-green-600">{selectedWaste.title}</span></h2>
            <input
              type="number"
              placeholder="Enter quantity (kg)"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full border p-3 rounded mb-2"
            />
            <p className="text-sm text-gray-600 mb-4">Estimated Price: ₹{priceEstimate}</p>
            <button
              onClick={submitPickupRequest}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Confirm Request
            </button>
          </div>
        </div>
      )}

      {/* Scheduled Pickup Popup */}
      {showScheduled && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-20 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button onClick={() => setShowScheduled(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package size={20} /> Scheduled Pickups
            </h2>
            {scheduledList.length === 0 ? (
              <p className="text-sm text-gray-500">No pickups scheduled yet.</p>
            ) : (
              <ul className="divide-y">
                {scheduledList.map((pickup) => (
                  <li key={pickup._id} className="py-3 text-sm flex justify-between items-center">
                    <div>
                      {pickup.quantity} kg of <b>{pickup.wasteId?.title}</b> from <span className="text-gray-600">{pickup.wasteId?.location}</span>
                    </div>
                    <button
                      onClick={() => completePickup(pickup._id)}
                      className="text-green-600 hover:underline text-xs"
                    >
                      Mark as Completed
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclerDashboard;

