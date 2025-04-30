// import { useEffect, useState } from "react";
// import API from "../../services/api";

// const ManagePickups = () => {
//   const [pickups, setPickups] = useState([]);

//   const fetchPickups = async () => {
//     const { data } = await API.get("/admin/pickups");
//     setPickups(data);
//   };

//   const markComplete = async (id) => {
//     await API.put(`/pickup/complete/${id}`);
//     fetchPickups();
//   };

//   useEffect(() => {
//     fetchPickups();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10">
//       <h2 className="text-2xl font-bold text-green-600 mb-6">Manage Pickups</h2>
//       <div className="overflow-x-auto bg-white rounded shadow">
//         <table className="min-w-full">
//           <thead>
//             <tr className="bg-green-100 text-left">
//               <th className="p-3">Waste</th>
//               <th className="p-3">Seller</th>
//               <th className="p-3">Buyer</th>
//               <th className="p-3">Quantity</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pickups.map((p) => (
//               <tr key={p._id} className="border-t">
//                 <td className="p-3">{p.wasteId?.title || "N/A"}</td>
//                 <td className="p-3">{p.wasteId?.postedBy?.name || "N/A"}</td>
//                 <td className="p-3">{p.recyclerId?.name || "N/A"}</td>

//                 <td className="p-3">{p.quantity} kg</td>
//                 <td className="p-3">{p.status}</td>
//                 <td className="p-3">
//                   {p.status === "scheduled" && (
//                     <button
//                       onClick={() => markComplete(p._id)}
//                       className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
//                     >
//                       Mark Completed
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//             {pickups.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="p-4 text-center text-gray-500">
//                   No pickups found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ManagePickups;
import { useEffect, useState } from "react";
import API from "../../services/api";

const ManagePickups = () => {
  const [pickups, setPickups] = useState([]);

  const fetchPickups = async () => {
    try {
      const { data } = await API.get("/admin/pickups");
      setPickups(data);
    } catch (err) {
      console.error("Error fetching pickups:", err);
    }
  };

  const deletePickup = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pickup?")) return;
    try {
      await API.delete(`/admin/pickups/${id}`);
      fetchPickups(); // Refresh
    } catch (err) {
      console.error("Failed to delete pickup", err);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Manage Pickups</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="p-3">Waste</th>
              <th className="p-3">Seller</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map((p) => (
              <tr key={p._id} className="border-t text-sm">
                <td className="p-3">{p.wasteId?.title || "N/A"}</td>
                <td className="p-3">{p.wasteId?.postedBy?.name || "N/A"}</td>
                <td className="p-3">{p.recyclerId?.name || "N/A"}</td>
                <td className="p-3">{p.quantity} kg</td>
                <td className="p-3 capitalize">{p.status}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => deletePickup(p._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {pickups.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 p-4">
                  No pickups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePickups;
