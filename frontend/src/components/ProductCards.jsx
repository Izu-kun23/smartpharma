import React, { useEffect, useState } from "react";
import { fetchAllCategories, fetchProducts } from "../../../server/fire"; // adjust path
import { motion } from "framer-motion";

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const catResponse = await fetchAllCategories();
        const prodResponse = await fetchProducts();

        if (!catResponse.success) throw new Error(catResponse.error || "Failed to load categories");
        if (!prodResponse.success) throw new Error(prodResponse.error || "Failed to load products");

        setCategories(catResponse.categories);
        setProducts(prodResponse.products);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    };

    loadAllData();
  }, []);

  if (loading) return <p className="text-center py-12">Loading products...</p>;
  if (error) return <p className="text-center py-12 text-red-600">{error}</p>;

  // Map categoryId (from category object) to categoryName for lookup
  const categoryMap = categories.reduce((map, cat) => {
    map[cat.categoryId || cat.id] = cat.categoryName || cat.name || "Unknown";
    return map;
  }, {});

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => {
          const {
            id,
            name,
            title,
            imageUrl,
            price,
            categoryId,
            categories: productCategoryIds = [],
          } = product;

          const productName = name || title || "Unnamed Product";

          let categoryNames = "Uncategorized";
          if (categoryId) {
            categoryNames = categoryMap[categoryId] || "Unknown";
          } else if (productCategoryIds.length > 0) {
            categoryNames = productCategoryIds
              .map((catId) => categoryMap[catId] || "Unknown")
              .join(", ");
          }

          return (
            <motion.div
              key={id}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col cursor-pointer h-80"
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="bg-white rounded-t-lg overflow-hidden flex justify-center items-center" style={{ height: "177px" }}>
                <img
                  src={imageUrl || "https://via.placeholder.com/300x180?text=No+Image"}
                  alt={productName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-3 flex flex-col flex-grow rounded-t-none rounded-b-lg -mt-2 bg-white shadow-md">
                <h3 className="text-lg font-medium mb-1 truncate">{productName}</h3>

                <p className="text-xs text-gray-500 mb-2 italic truncate">{categoryNames}</p>

                <div className="text-base font-bold text-gray-900 mb-2">${price}</div>

                <button
                  type="button"
                  className="bg-blue-500 text-white text-sm font-bold py-1.5 rounded-full hover:bg-blue-600 transition w-29"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductCards;