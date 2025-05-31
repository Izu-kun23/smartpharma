import React, { useEffect, useState } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCategoriesByPharmacy } from "../../../../server/controllers/PharmacistController";

const PharmacistCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedPharmacist = localStorage.getItem("pharmacistUser");
        if (!storedPharmacist) {
          setError("No authenticated pharmacist found.");
          setLoading(false);
          return;
        }

        const pharmacistData = JSON.parse(storedPharmacist);
        const { pharmacyId } = pharmacistData;

        if (!pharmacyId) {
          setError("No pharmacy ID found for this pharmacist.");
          setLoading(false);
          return;
        }

        const fetchedCategories = await fetchCategoriesByPharmacy(pharmacyId);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    console.log("Edit category with id:", id);
    // You can navigate to edit page if needed, e.g., navigate(`/pharmacist/edit-category/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete category with id:", id);
    // Implement delete logic here
  };

  const handleAddCategory = () => {
    navigate('/pharmacist/add-categories');
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center text-gray-700">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
        <button
          onClick={handleAddCategory}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-gray-600">
          No categories found.
        </div>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                S/N
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Product Count
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {categories.map((cat, index) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {cat.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-12 h-12 object-contain rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {cat.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {cat.productCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                  <button
                    onClick={() => handleEdit(cat.id)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PharmacistCategory;