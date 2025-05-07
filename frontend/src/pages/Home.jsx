// import { useEffect, useState } from "react";
// import API from "../services/api";
// import { Link } from "react-router-dom";

// const Home = () => {
//   const [latestWaste, setLatestWaste] = useState([]);

//   useEffect(() => {
//     const fetchWaste = async () => {
//       try {
//         const { data } = await API.get("/waste");
//         const latest = data.slice(0, 6); // get first 6 items
//         setLatestWaste(latest);
//       } catch (err) {
//         console.error("Error fetching waste:", err);
//       }
//     };

//     fetchWaste();
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-12">
//       <h1 className="text-4xl font-bold text-green-600 text-center mb-8">
//         Welcome to UpWaste ♻️
//       </h1>

//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         Latest Waste Listings
//       </h2>

//       <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
//         {latestWaste.map((item) => (
//           <div key={item._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-100">
//             <img
//               src={item.image || "https://via.placeholder.com/300x200.png?text=No+Image"}
//               alt={item.title}
//               className="w-full h-48 object-cover rounded"
//             />
//             <h2 className="text-xl font-semibold mt-4">{item.title}</h2>
//             <p className="text-sm text-gray-600">{item.description}</p>
//             <div className="mt-2 text-sm text-gray-500">
//               <span>Category: {item.category}</span><br />
//               <span>Location: {item.location || "N/A"}</span><br />
//               <span>Weight: {item.weight || "N/A"} kg</span><br />
//               <span>Price: ₹{item.price || "0"}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="text-center mt-10">
//         <Link to="/listings" className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
//           View All Listings
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Home;
import { Link } from "react-router-dom";
import { Leaf, ArrowRight, Recycle } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";


// Scroll reveal animation variants
const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 text-gray-800">
      {/* Hero Section with Framer Motion */}
      <section className="py-20 px-6 md:px-12 lg:px-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-green-700 leading-tight mb-4"
        >
          Turn Trash into Treasure with <span className="text-black">UpWaste</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl mx-auto text-lg text-gray-600 mb-8"
        >
          A smart waste resale platform connecting waste generators with recyclers for a cleaner, circular future.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link
            to="/post-waste"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg text-lg transition"
          >
            Get Started
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="bg-white py-16 px-6 md:px-12 lg:px-20 border-y border-gray-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reveal}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">📊 Our Impact So Far</h2>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="bg-green-50 rounded-xl p-6 shadow">
            <p className="text-4xl font-extrabold text-green-600">
              <CountUp end={12450} duration={2} separator="," />
            </p>
            <p className="text-sm text-gray-600">kg Waste Recycled</p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 shadow">
            <p className="text-4xl font-extrabold text-green-600">
              <CountUp end={1230} duration={2} separator="," />
            </p>
            <p className="text-sm text-gray-600">Recyclers Onboarded</p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 shadow">
            <p className="text-4xl font-extrabold text-green-600">
              <CountUp end={8700} duration={2} separator="," />
            </p>
            <p className="text-sm text-gray-600">Pickups Completed</p>
          </div>
        </div>
      </motion.section>

      {/* Our Vision */}
      <motion.section
        className="bg-white py-16 px-6 md:px-12 lg:px-20 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reveal}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🌍 Our Vision</h2>
        <p className="max-w-3xl mx-auto text-gray-600 text-lg">
          At UpWaste, we believe that every scrap has a story — and a second chance. We’re on a mission to empower communities,
          reduce environmental impact, and build a transparent circular economy where nothing goes to waste.
        </p>
      </motion.section>

      {/* Why Waste Management Matters */}
      <motion.section
        className="bg-green-100 py-16 px-6 md:px-12 lg:px-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reveal}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-green-800 mb-10">♻️ Why Waste Management Matters</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            whileHover={{ scale: 1.03 }}
          >
            <Recycle size={36} className="mx-auto text-green-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Environmental Protection</h3>
            <p className="text-gray-600 text-sm">
              Proper waste disposal reduces pollution, protects biodiversity, and slows climate change.
            </p>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            whileHover={{ scale: 1.03 }}
          >
            <Leaf size={36} className="mx-auto text-green-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Resource Conservation</h3>
            <p className="text-gray-600 text-sm">
              Recycling reduces demand for raw materials and saves water, energy, and ecosystems.
            </p>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            whileHover={{ scale: 1.03 }}
          >
{/*             <img
              src={cmlogo}
              alt="community"
              className="w-10 mx-auto mb-4"
            /> */}
            <h3 className="font-semibold text-lg mb-2">Empowered Communities</h3>
            <p className="text-gray-600 text-sm">
              Connecting waste generators with recyclers creates economic opportunities and community impact.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
