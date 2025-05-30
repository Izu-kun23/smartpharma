import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const PharmacistCategory = () => {
  // Sample categories data
  const categories = [
    {
      id: 1,
      createdAt: "2025-05-28T12:56:03.679Z",
      description: "For Pain",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/smartpharma-45bb5.firebasestorage.app/o/categoryImages%2F1748436962739-heart.png?alt=media&token=53a7e392-2ac9-46fc-b3a1-b59cdd79a8fc",
      name: "Pain Relief",
      pharmacyId: "pharmacy-1748434345380",
      productCount: 1,
      updatedAt: "2025-05-28T17:32:25.940Z",
    },
    // Add more categories here...
  ];

  const handleEdit = (id) => {
    console.log("Edit category with id:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete category with id:", id);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Categories</h2>

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
    </div>
  );
};

export default PharmacistCategory;