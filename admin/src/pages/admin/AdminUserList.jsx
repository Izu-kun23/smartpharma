import React, { useState, useEffect } from "react";
import { User, ShieldCheck, Stethoscope, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchAdmins,
  fetchPharmacists,
  fetchPharmacies,
  addAdmin,
  addPharmacist,
} from "../../../../server/controllers/AdminController";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    pharmacyId: "",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const [admins, pharmacists] = await Promise.all([
          fetchAdmins(),
          fetchPharmacists(),
        ]);

        const fetchedUsers = [...admins, ...pharmacists];

        const normalizedUsers = fetchedUsers.map((u) => ({
          id: u.id || u._id || u.userId || "",
          name: u.name,
          email: u.email,
          role: u.role,
          pharmacy: u.pharmacy || null,
        }));

        setUsers(normalizedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const loadPharmacies = async () => {
      try {
        const pharms = await fetchPharmacies();

        const normalizedPharms = pharms.map((p) => ({
          pharmacyId: p.pharmacyId || p.id || p._id || "",
          pharmacyName: p.pharmacyName || p.name || "Unnamed Pharmacy",
          address1: p.address1 || "",
          address2: p.address2 || "",
          city: p.city || "",
          town: p.town || "",
          state: p.state || "",
          zipCode: p.zipCode || "",
          country: p.country || "",
        }));

        setPharmacies(normalizedPharms);
      } catch (error) {
        console.error("Failed to fetch pharmacies:", error);
      }
    };
    loadPharmacies();
  }, []);

  const formatAddress = (pharmacy) => {
    if (!pharmacy) return "No address available";

    const parts = [
      pharmacy.address1,
      pharmacy.address2,
      pharmacy.city,
      pharmacy.town,
      pharmacy.state,
      pharmacy.zipCode,
      pharmacy.country,
    ].filter(Boolean);

    return parts.join(", ");
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill all required fields");
      return;
    }

    if (newUser.role === "pharmacist" && !newUser.pharmacyId) {
      alert("Please select a pharmacy");
      return;
    }

    setLoading(true);
    try {
      let uid;
      if (newUser.role === "admin") {
        uid = await addAdmin({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        });
      } else if (newUser.role === "pharmacist") {
        uid = await addPharmacist({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          pharmacyId: newUser.pharmacyId,
        });
      }

      const addedPharmacy =
        newUser.role === "pharmacist"
          ? pharmacies.find(
              (p) => String(p.pharmacyId) === String(newUser.pharmacyId)
            )
          : null;

      setUsers((prev) => [
        ...prev,
        {
          id: uid,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          ...(newUser.role === "pharmacist" && { pharmacy: addedPharmacy }),
        },
      ]);

      setShowModal(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "admin",
        pharmacyId: "",
      });
    } catch (error) {
      alert("Failed to add user: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const admins = users.filter((user) => user.role === "admin");
  const pharmacists = users.filter((user) => user.role === "pharmacist");

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">System Users</h2>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Admins Section */}
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Admins
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {admins.length > 0 ? (
            admins.map((admin) => (
              <div
                key={admin.id}
                className="border border-gray-200 rounded-md p-4 flex items-center gap-4 hover:shadow transition"
              >
                <User className="w-8 h-8 text-gray-500" />
                <div>
                  <div className="font-semibold">{admin.name}</div>
                  <div className="text-sm text-gray-600">{admin.email}</div>
                  <div className="text-xs text-blue-600 font-medium">{admin.role}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No admins found.</p>
          )}
        </div>
      </div>

      {/* Pharmacists Section */}
      <div>
        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-green-600" />
          Pharmacists
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pharmacists.length > 0 ? (
            pharmacists.map((pharmacist) => {
              const pharmacyName = pharmacist.pharmacy?.pharmacyName || "Unnamed Pharmacy";
              const address = formatAddress(pharmacist.pharmacy);

              return (
                <div
                  key={pharmacist.id}
                  className="border border-gray-200 rounded-md p-4 flex items-center gap-4 hover:shadow transition"
                >
                  <User className="w-8 h-8 text-gray-500" />
                  <div>
                    <div className="font-semibold">{pharmacist.name}</div>
                    <div className="text-sm text-gray-600">{pharmacist.email}</div>
                    <div className="text-xs text-green-600 font-medium">
                      {pharmacist.role} • {pharmacyName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{address}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No pharmacists found.</p>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white p-6 rounded-md w-96 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Add New User</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-8 border"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-8 border"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-8 border"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value, pharmacyId: "" })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-8 border"
                    disabled={loading}
                  >
                    <option value="admin">Admin</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>
                </div>

                {newUser.role === "pharmacist" && (
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="pharmacy"
                    >
                      Pharmacy
                    </label>
                    <select
                      id="pharmacy"
                      value={newUser.pharmacyId}
                      onChange={(e) => setNewUser({ ...newUser, pharmacyId: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-8 border"
                      required={newUser.role === "pharmacist"}
                      disabled={loading}
                    >
                      <option value="">Select a Pharmacy</option>
                      {pharmacies.map((pharmacy) => (
                        <option key={pharmacy.pharmacyId} value={pharmacy.pharmacyId}>
                          {pharmacy.pharmacyName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUserList;