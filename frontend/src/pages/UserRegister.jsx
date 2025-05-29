import React, { useState } from "react";
import { registerUser } from "../../../server/fire";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setProfilePhotoUrl(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Trim all inputs to avoid trailing spaces
    const trimmedForm = {
      ...form,
      fullName: form.fullName.trim(),
      gender: form.gender,
      dob: form.dob,
      address: form.address.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      postalCode: form.postalCode.trim(),
      phoneNumber: form.phoneNumber.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    if (trimmedForm.password !== trimmedForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await registerUser(
        trimmedForm.email,
        trimmedForm.password,
        trimmedForm.fullName,
        trimmedForm.phoneNumber,
        profilePhoto,
        trimmedForm.dob,
        trimmedForm.gender,
        {
          address: trimmedForm.address,
          city: trimmedForm.city,
          country: trimmedForm.country,
          postalCode: trimmedForm.postalCode,
        }
      );
      setSuccess(true);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Create an Account
        </h2>

        {success && (
          <p className="text-green-600 text-center mb-4">
            User registered successfully!
          </p>
        )}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-600 shadow-md bg-gray-100 flex items-center justify-center">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <svg
                  className="w-10 h-10 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.46 0 4.75.73 6.879 1.974M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </div>
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700 transition"
              title="Upload profile photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-1.5a2.5 2.5 0 013.536 3.536L7.5 21H3v-4.5l13.732-13.732z"
                />
              </svg>
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
        </div>

        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
        >
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />

          <div>
            <label className="block font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md text-black"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="nonbinary">Non-binary</option>
              <option value="preferNotToSay">Prefer not to say</option>
            </select>
          </div>

          <Input
            label="Date of Birth"
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          {/* Address */}
          <Input
            label="Address"
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <Input
            label="City"
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
          />

          <Input
            label="Country"
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
          />

          <Input
            label="Postal Code (Optional)"
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            toggle={() => setShowPassword(!showPassword)}
            showToggle={true}
            toggleLabel={showPassword ? "Hide" : "Show"}
          />

          <Input
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            toggle={() => setShowConfirm(!showConfirm)}
            showToggle={true}
            toggleLabel={showConfirm ? "Hide" : "Show"}
          />

          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-2 font-semibold rounded-md transition duration-300 text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          <div className="col-span-2 text-center mt-3 text-xs text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

// Reusable Input component with optional password toggle, smaller size
const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  toggle,
  showToggle = false,
  toggleLabel,
}) => (
  <div className="relative mb-1">
    <label className="block font-medium text-gray-700 text-sm">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md text-black text-sm"
      required={name !== "postalCode"} // postalCode is optional
    />
    {showToggle && (
      <button
        type="button"
        className="absolute right-2 top-[50%] transform -translate-y-1/2 text-xs text-gray-500"
        onClick={toggle}
      >
        {toggleLabel}
      </button>
    )}
  </div>
);