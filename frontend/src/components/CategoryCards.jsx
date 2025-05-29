import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchAllCategories } from "../../../server/fire";

const bgColors = [
  "bg-red-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-blue-100",
  "bg-pink-100",
  "bg-indigo-100",
];

const CategoryCards = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      const { success, categories, error } = await fetchAllCategories();
      if (success) {
        const categoriesWithBg = categories.map((cat, i) => ({
          ...cat,
          bg: bgColors[i % bgColors.length],
        }));
        setCategories(categoriesWithBg);
      } else {
        console.error("Error loading categories:", error);
      }
      setLoading(false);
    };

    getCategories();
  }, []);

  if (loading) return <div className="text-center py-4">Loading categories...</div>;

  const isCentered = categories.length <= 3;

  const MotionCard = ({ category }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center space-y-1 w-[180px]"
    >
      <div
        className={`w-[229px] h-37 rounded-lg shadow-sm flex items-center justify-center ${category.bg}`}
      >
        <img
          src={category.imageUrl || "https://via.placeholder.com/80"}
          alt={category.name}
          className="w-20 h-20 object-contain"
          loading="lazy"
        />
      </div>
      <h5 className="text-center text-slate-800 text-sm font-medium">
        {category.name}
      </h5>
    </motion.div>
  );

  return (
    <div className="w-full py-2">
      {isCentered ? (
        <div className="flex justify-center space-x-19">
          {/* ↓ space-x-2 for tighter spacing between centered items */}
          {categories.map((category) => (
            <MotionCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {/* ↓ gap-2 reduces row and column space between grid items */}
          {categories.map((category) => (
            <MotionCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCards;