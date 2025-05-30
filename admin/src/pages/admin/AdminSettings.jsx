import React, { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../server/firebaseConfig";

const AdminSettings = () => {
  const auth = getAuth();

  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminDocRef = doc(db, "admins", user.uid);
        const adminDoc = await getDoc(adminDocRef);
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          setAdminUser({ uid: user.uid, email: user.email, ...data });
          setProfileData({
            name: data.name || "",
            email: user.email || "",
            phone: data.phone || "",
          });
        } else {
          await signOut(auth);
          setAdminUser(null);
          alert("You are not authorized as admin.");
        }
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Login form handlers
  const handleLoginChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
    } catch {
      setError("Invalid login credentials.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAdminUser(null);
  };

  // Profile change handlers
  const handleProfileChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      if (profileData.email !== user.email) {
        await updateEmail(user, profileData.email);
      }

      const adminDocRef = doc(db, "admins", user.uid);
      await updateDoc(adminDocRef, {
        name: profileData.name,
        phone: profileData.phone,
      });

      setSuccess("Profile updated successfully!");
      setAdminUser((prev) => ({
        ...prev,
        email: profileData.email,
        name: profileData.name,
        phone: profileData.phone,
      }));
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  // Password change handlers
  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    if (passwordData.new !== passwordData.confirm) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, passwordData.current);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.new);

      setSuccess("Password changed successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err) {
      setError(err.message || "Failed to change password.");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!adminUser) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-20">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleLoginSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
            className="w-full border px-3 py-2 mb-4 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Settings</h2>

      {/* Profile Image */}
      <section className="flex flex-col items-center bg-white rounded-lg shadow p-6">
        <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center mb-4 text-blue-700 font-bold text-6xl select-none">
          {profileData.name ? profileData.name.charAt(0).toUpperCase() : ""}
        </div>
        <p className="text-xl font-semibold text-gray-700">{profileData.name}</p>
        <p className="text-gray-600">{profileData.email}</p>
      </section>

      {/* Profile Info */}
      <section className="bg-white rounded-lg shadow p-6">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Profile</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
              updating ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </section>

      {/* Password Change */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Current Password</label>
            <input
              type="password"
              name="current"
              value={passwordData.current}
              onChange={handlePasswordChangeInput}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              name="new"
              value={passwordData.new}
              onChange={handlePasswordChangeInput}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirm New Password</label>
            <input
              type="password"
              name="confirm"
              value={passwordData.confirm}
              onChange={handlePasswordChangeInput}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </div>
      </section>

     
    </div>
  );
};

export default AdminSettings;