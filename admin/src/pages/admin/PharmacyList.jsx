import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchPharmacies } from '../../../../server/controllers/AdminController'; // Adjust path accordingly

const PharmacyList = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const navigate = useNavigate();

  useEffect(() => {
    const loadPharmacies = async () => {
      try {
        setLoading(true);
        const data = await fetchPharmacies();
        setPharmacies(data);
      } catch (err) {
        setError('Failed to fetch pharmacies.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPharmacies();
  }, []);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentPharmacies = pharmacies.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(pharmacies.length / itemsPerPage);

  const handleEdit = (id) => {
    console.log('Edit pharmacy', id);
  };

  const handleDelete = (id) => {
    console.log('Delete pharmacy', id);
  };

  const handleAddNew = () => {
    navigate('/admin/add-pharmacy');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Loading pharmacies...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Pharmacies</h2>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-4 py-3 text-gray-600 font-medium">S/N</th>
            <th className="text-left px-4 py-3 text-gray-600 font-medium">Pharmacy Name</th>
            <th className="text-left px-4 py-3 text-gray-600 font-medium">Address</th>
            <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentPharmacies.map((pharmacy, index) => (
            <tr key={pharmacy.pharmacyId} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-4 py-3">{firstIndex + index + 1}</td>
              <td className="px-4 py-3">{pharmacy.pharmacyName || pharmacy.name}</td>
              <td className="px-4 py-3">
                {pharmacy.address1
                  ? `${pharmacy.address1}, ${pharmacy.town || ''} ${pharmacy.city || ''}`.trim()
                  : pharmacy.address}
              </td>
              <td className="px-4 py-3 flex space-x-4">
                <button
                  onClick={() => handleEdit(pharmacy.pharmacyId)}
                  title="Edit Pharmacy"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(pharmacy.pharmacyId)}
                  title="Delete Pharmacy"
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {currentPharmacies.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No pharmacies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Pharmacy
        </button>
      </div>
    </div>
  );
};

export default PharmacyList;