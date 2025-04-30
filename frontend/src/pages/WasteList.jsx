import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = ["All", "Plastic", "Metal", "Paper", "Glass"];

const WasteList = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [batch, setBatch] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [location, setLocation] = useState("");

  const filtersRef = useRef(null);
  const { ref: scrollRef, inView } = useInView({ triggerOnce: false });

  useEffect(() => {
    gsap.fromTo(
      filtersRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: filtersRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        duration: 0.6,
        ease: "power2.out",
      }
    );
  }, []);

  useEffect(() => {
    const fetchWaste = async () => {
      try {
        const { data } = await API.get("/waste");
        setWasteItems(data);
      } catch (err) {
        console.error("Error fetching waste:", err);
      }
    };

    fetchWaste();
  }, []);

  useEffect(() => {
    const itemsPerBatch = 6;
    let filtered = wasteItems;

    if (search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(item =>
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (location) {
      filtered = filtered.filter(item =>
        item.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    const paginated = filtered.slice(0, batch * itemsPerBatch);
    setVisibleItems(paginated);
  }, [search, selectedCategory, location, wasteItems, batch]);

  // Infinite scroll
  useEffect(() => {
    if (inView) {
      setBatch((prev) => prev + 1);
    }
  }, [inView]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.h1
        className="text-4xl font-bold text-green-600 mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ♻️ Explore Waste Listings
      </motion.h1>

      {/* Filters */}
      <div ref={filtersRef} className="grid md:grid-cols-3 gap-4 mb-10">
        <input
          type="text"
          placeholder="🔍 Search title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
        />

        <div className="flex flex-wrap gap-2 md:col-span-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-green-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="📍 Filter by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
        />
      </div>

      {/* Listings */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {visibleItems.length > 0 ? (
          visibleItems.map((item, index) => (
            <motion.div
              key={item._id}
              className="bg-white border border-gray-100 shadow-lg rounded-xl p-4 transition hover:scale-[1.02] hover:shadow-xl cursor-pointer"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <img
                src={item.image || "https://via.placeholder.com/300x200.png?text=No+Image"}
                alt={item.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h2 className="text-xl font-semibold text-green-700">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Location:</strong> {item.location || "N/A"}</p>
                <p><strong>Weight:</strong> {item.weight || "N/A"} kg</p>
                <p><strong>Price:</strong> ₹{item.price || "0"}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No results found.</p>
        )}
      </motion.div>

      {/* Infinite scroll trigger */}
      <div ref={scrollRef} className="h-12"></div>
    </div>
  );
};

export default WasteList;
