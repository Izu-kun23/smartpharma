import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../../../../server/controllers/PharmacistController"; // replace with the correct import

const PharmacistAddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Please enter a category name.");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    try {
      setLoading(true);
      await addCategory(categoryName, description, imageFile);

      // Reset form
      setCategoryName("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl(null);

      alert("Category added successfully!");
      navigate("/pharmacist/categories"); // adjust route as needed
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Add New Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category Name
          </label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter category name"
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter description"
            disabled={loading}
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            disabled={loading}
          />
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 object-contain rounded border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default PharmacistAddCategory;