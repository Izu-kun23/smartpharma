import React, { useState } from 'react';
import { addPharmacy } from '../../../../server/controllers/AdminController'; // adjust path

const AddPharmacy = () => {
  const [formData, setFormData] = useState({
    pharmacyName: '',
    address1: '',
    address2: '',
    town: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [imageFile, setImageFile] = useState(null); // optional for image upload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Call Firebase function
      const pharmacyId = await addPharmacy(formData, imageFile);
      setSuccessMsg(`Pharmacy added successfully with ID: ${pharmacyId}`);

      // Reset form if needed
      setFormData({
        pharmacyName: '',
        address1: '',
        address2: '',
        town: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      });
      setImageFile(null);
    } catch (err) {
      setError('Failed to add pharmacy. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add Pharmacy</h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {successMsg && <p className="mb-4 text-green-600">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pharmacy Name */}
        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="pharmacyName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pharmacy Name <span className="text-red-500">*</span>
          </label>
          <input
            id="pharmacyName"
            name="pharmacyName"
            type="text"
            required
            value={formData.pharmacyName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter pharmacy name"
          />
        </div>

        {/* Address 1 */}
        <div>
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
            Address 1 <span className="text-red-500">*</span>
          </label>
          <input
            id="address1"
            name="address1"
            type="text"
            required
            value={formData.address1}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Street address, P.O. box, company name, c/o"
          />
        </div>

        {/* Address 2 */}
        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
            Address 2
          </label>
          <input
            id="address2"
            name="address2"
            type="text"
            value={formData.address2}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Apartment, suite, unit, building, floor, etc."
          />
        </div>

        {/* Town */}
        <div>
          <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-1">
            Town <span className="text-red-500">*</span>
          </label>
          <input
            id="town"
            name="town"
            type="text"
            required
            value={formData.town}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Town or locality"
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="City"
          />
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            id="state"
            name="state"
            type="text"
            required
            value={formData.state}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="State / Province / Region"
          />
        </div>

        {/* Zip Code (Optional) */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code (Optional)
          </label>
          <input
            id="zipCode"
            name="zipCode"
            type="text"
            value={formData.zipCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Zip / Postal code"
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            value={formData.country}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Country"
          />
        </div>

        {/* Optional Image Upload */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">
            Pharmacy Image (Optional)
          </label>
          <input
            id="imageFile"
            name="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {/* Submit button spans full width */}
        <div className="col-span-1 md:col-span-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-40 bg-blue-600 text-white py-2 rounded-4xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Pharmacy'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPharmacy;