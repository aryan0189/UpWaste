// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import API from "../services/api";

// const GeneratorDashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState({
//     count: 0,
//     totalWeight: 0,
//     totalPrice: 0,
//   });

//   useEffect(() => {
//     const fetchMyWaste = async () => {
//       try {
//         const { data } = await API.get("/waste");
//         const myWaste = data.filter(item => item.postedBy === user._id);

//         const count = myWaste.length;
//         const totalWeight = myWaste.reduce((sum, item) => sum + (item.weight || 0), 0);
//         const totalPrice = myWaste.reduce((sum, item) => sum + (item.price || 0), 0);

//         setStats({ count, totalWeight, totalPrice });
//       } catch (err) {
//         console.error("Failed to load dashboard stats", err);
//       }
//     };

//     if (user?._id) fetchMyWaste();
//   }, [user]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-12">
//       <h1 className="text-3xl font-bold text-green-600 mb-2">Welcome, {user?.name} 👋</h1>
//       <p className="text-gray-600 mb-10">Manage your waste listings and track your impact.</p>

//       {/* Quick Links */}
//       <div className="grid gap-6 sm:grid-cols-2 mb-12">
//         <Link to="/post-waste" className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition">
//           <h2 className="text-xl font-semibold text-green-700 mb-2">➕ Post New Waste</h2>
//           <p className="text-gray-600 text-sm">Upload a new waste listing to help recyclers find it.</p>
//         </Link>

//         <Link to="/my-listings" className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition">
//           <h2 className="text-xl font-semibold text-green-700 mb-2">📦 My Listings</h2>
//           <p className="text-gray-600 text-sm">View and manage the waste items you’ve posted.</p>
//         </Link>
//       </div>

//       {/* Stats Section */}
//       <div className="grid sm:grid-cols-3 gap-6">
//         <div className="bg-green-50 p-6 rounded shadow text-center">
//           <p className="text-3xl font-bold text-green-600">{stats.count}</p>
//           <p className="text-sm text-gray-600">Total Listings</p>
//         </div>
//         <div className="bg-green-50 p-6 rounded shadow text-center">
//           <p className="text-3xl font-bold text-green-600">{stats.totalWeight} kg</p>
//           <p className="text-sm text-gray-600">Total Weight</p>
//         </div>
//         <div className="bg-green-50 p-6 rounded shadow text-center">
//           <p className="text-3xl font-bold text-green-600">₹ {stats.totalPrice}</p>
//           <p className="text-sm text-gray-600">Estimated Value</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GeneratorDashboard;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const GeneratorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    count: 0,
    totalWeight: 0,
    totalPrice: 0,
    moneyEarned: 0,
  });
  const [showEarnings, setShowEarnings] = useState(false);
  const [earnedList, setEarnedList] = useState([]);

  useEffect(() => {
    const fetchMyWaste = async () => {
      try {
        const [wasteRes, pickupRes] = await Promise.all([
          API.get("/waste"),
          API.get(`/pickup/from-generator/${user._id}`)
        ]);

        const myWaste = wasteRes.data.filter(
          (item) =>
            item.postedBy === user._id ||
            item.generatorId === user._id ||
            item.postedBy?._id === user._id ||
            item.generatorId?._id === user._id
        );

        const count = myWaste.length;
        const totalWeight = myWaste.reduce((sum, item) => sum + (item.weight || 0), 0);
        const totalPrice = myWaste.reduce((sum, item) => sum + (item.price || 0), 0);

        const completed = pickupRes.data.filter(p => p.status === "completed");

        let moneyEarned = 0;
        const soldItems = [];

        completed.forEach(pickup => {
          const unitPrice = pickup.wasteId?.price / pickup.wasteId?.weight || 0;
          const cost = Math.round(unitPrice * pickup.quantity);
          moneyEarned += cost;

          soldItems.push({
            title: pickup.wasteId?.title,
            quantity: pickup.quantity,
            price: cost,
            location: pickup.wasteId?.location,
            date: pickup.updatedAt
          });
        });

        setStats({ count, totalWeight, totalPrice, moneyEarned });
        setEarnedList(soldItems);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    if (user?._id) fetchMyWaste();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-600 mb-2">Welcome, {user?.name} 👋</h1>
      <p className="text-gray-600 mb-10">Manage your waste listings and track your impact.</p>

      {/* Quick Links */}
      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        <Link to="/post-waste" className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">➕ Post New Waste</h2>
          <p className="text-gray-600 text-sm">Upload a new waste listing to help recyclers find it.</p>
        </Link>

        <Link to="/my-listings" className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">📦 My Listings</h2>
          <p className="text-gray-600 text-sm">View and manage the waste items you’ve posted.</p>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid sm:grid-cols-4 gap-6">
        <div className="bg-green-50 p-6 rounded shadow text-center">
          <p className="text-3xl font-bold text-green-600">{stats.count}</p>
          <p className="text-sm text-gray-600">Total Listings</p>
        </div>
        <div className="bg-green-50 p-6 rounded shadow text-center">
          <p className="text-3xl font-bold text-green-600">{stats.totalWeight} kg</p>
          <p className="text-sm text-gray-600">Total Weight</p>
        </div>
        <div className="bg-green-50 p-6 rounded shadow text-center">
          <p className="text-3xl font-bold text-green-600">₹ {stats.totalPrice}</p>
          <p className="text-sm text-gray-600">Estimated Value</p>
        </div>
        <div
          onClick={() => setShowEarnings(true)}
          className="bg-green-50 p-6 rounded shadow text-center cursor-pointer hover:bg-green-100 transition"
        >
          <p className="text-3xl font-bold text-green-600">₹ {stats.moneyEarned}</p>
          <p className="text-sm text-gray-600">Money Earned</p>
        </div>
      </div>

      {/* Money Earned Modal */}
      {showEarnings && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-20 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button
              onClick={() => setShowEarnings(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-sm"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">💸 Money Earned Details</h2>

            {earnedList.length === 0 ? (
              <p className="text-sm text-gray-500">No completed pickups yet.</p>
            ) : (
              <ul className="divide-y text-sm max-h-[60vh] overflow-y-auto">
                {earnedList.map((item, idx) => (
                  <li key={idx} className="py-3">
                    <b>{item.title}</b> — {item.quantity} kg from {item.location}<br />
                    <span className="text-green-700 font-semibold">₹ {item.price}</span><br />
                    <span className="text-xs text-gray-500">{new Date(item.date).toLocaleString()}</span>
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

export default GeneratorDashboard;
