// src/components/PharmacistSettings.js
import React, { useState, useEffect } from "react";
import { fetchPharmacy, updatePharmacistInfo, changePharmacistPassword } from "../../../../server/controllers/PharmacistController";
import { User } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../server/firebaseConfig";

const PharmacistSettings = () => {
  const [pharmacistData, setPharmacistData] = useState(null);
  const [pharmacyData, setPharmacyData] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
  });
  const [pharmacyAddress, setPharmacyAddress] = useState({
    pharmacyName: "",
    address1: "",
    address2: "",
    town: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const storedPharmacist = localStorage.getItem("pharmacistUser");
    if (storedPharmacist) {
      const data = JSON.parse(storedPharmacist);
      setPharmacistData(data);

      setProfile({
        name: data.name || "",
        phone: data.phone || "",
        licenseNumber: data.licenseNumber || "",
      });

      if (data.pharmacyId) {
        fetchPharmacy(data.pharmacyId)
          .then((pharmacy) => {
            setPharmacyData(pharmacy);
            setPharmacyAddress({
              pharmacyName: pharmacy.pharmacyName || "",
              address1: pharmacy.address1 || "",
              address2: pharmacy.address2 || "",
              town: pharmacy.town || "",
              city: pharmacy.city || "",
              state: pharmacy.state || "",
              zipCode: pharmacy.zipCode || "",
              country: pharmacy.country || "",
            });
          })
          .catch((error) => console.error("Failed to fetch pharmacy:", error));
      }
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePharmacyAddressChange = (e) => {
    const { name, value } = e.target;
    setPharmacyAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!pharmacistData) return;

    try {
      // Use the controller helper to update pharmacist info
      const updatedData = await updatePharmacistInfo(pharmacistData.userId, {
        name: profile.name,
        phone: profile.phone,
        licenseNumber: profile.licenseNumber,
      });

      const updatedPharmacist = {
        ...pharmacistData,
        ...updatedData,
      };

      localStorage.setItem("pharmacistUser", JSON.stringify(updatedPharmacist));
      setPharmacistData(updatedPharmacist);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating pharmacist profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleSavePharmacyAddress = async () => {
    if (!pharmacyData || !pharmacistData?.pharmacyId) return;

    try {
      const pharmacyRef = doc(db, "pharmacies", pharmacistData.pharmacyId);
      await updateDoc(pharmacyRef, {
        pharmacyName: pharmacyAddress.pharmacyName,
        address1: pharmacyAddress.address1,
        address2: pharmacyAddress.address2,
        town: pharmacyAddress.town,
        city: pharmacyAddress.city,
        state: pharmacyAddress.state,
        zipCode: pharmacyAddress.zipCode,
        country: pharmacyAddress.country,
      });

      alert("Pharmacy address updated successfully!");
    } catch (error) {
      console.error("Error updating pharmacy address:", error);
      alert("Failed to update pharmacy address.");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (password.new !== password.confirm) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await changePharmacistPassword(password.current, password.new);
      alert("Password changed successfully!");
      setPassword({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.message || "Failed to change password.");
    }
  };

  if (!pharmacistData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Loading pharmacist data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Pharmacist Settings</h2>

      {/* Profile Image */}
      <section className="flex flex-col items-center bg-white rounded-lg shadow p-6">
        <div className="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center mb-4 text-green-700 font-bold text-6xl select-none">
  {pharmacistData.name ? pharmacistData.name.charAt(0).toUpperCase() : ""}
</div>
        <p className="text-xl font-semibold text-gray-700">{pharmacistData.name}</p>
        <p className="text-gray-600">{pharmacistData.email}</p>
      </section>

      {/* Profile Info */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email (readonly)</label>
            <input
              type="email"
              value={pharmacistData.email}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={profile.licenseNumber}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Save Profile
          </button>
        </div>
      </section>

      {/* Pharmacy Info */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Pharmacy Info</h3>
        {pharmacyData ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Pharmacy Name</label>
                <input
                  type="text"
                  name="pharmacyName"
                  value={pharmacyAddress.pharmacyName}
                  onChange={handlePharmacyAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Address Line 1</label>
                <input
                  type="text"
                  name="address1"
                  value={pharmacyAddress.address1}
                  onChange={handlePharmacyAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Address Line 2</label>
                <input
                  type="text"
                  name="address2"
                  value={pharmacyAddress.address2}
                  onChange={handlePharmacyAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Town</label>
                <input
                  type="text"
                  name="town"
                  value={pharmacyAddress.town}
                  onChange={handlePharmacyAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  value={pharmacyAddress.city}
                  onChange={handlePharmacyAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">State</label>
                <input
                  type="text"
                  name="state"
                  value={pharmacyAddress.state}
                  onChange={handlePharmacyAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={pharmacyAddress.zipCode}
                  onChange={handlePharmacyAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Country</label>
                <input
                  type="text"
                  name="country"
                  value={pharmacyAddress.country}
                  onChange={handlePharmacyAddressChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                onClick={handleSavePharmacyAddress}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Save Pharmacy Address
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Loading pharmacy details...</p>
        )}
      </section>

      {/* Password */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Current Password</label>
            <input
              type="password"
              name="current"
              value={password.current}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              name="new"
              value={password.new}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirm New Password</label>
            <input
              type="password"
              name="confirm"
              value={password.confirm}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Change Password
          </button>
        </div>
      </section>
    </div>
  );
};

export default PharmacistSettings;