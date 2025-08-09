import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiErrorCircle } from "react-icons/bi";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+92");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cellNo, setCellNo] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (countryCode === "+92" && cellNo.length !== 10) {
      const errMsg = "Pakistan numbers must be exactly 10 digits.";
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    const registerData = {
      name,
      email,
      cellNo: `${countryCode}${cellNo}`,
      password,
      role,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || "Registration failed");
        toast.error(json.error || "Registration failed");
        return;
      }

      // ✅ Success
      toast.success("Registration successful! You can now log in.");
      setName("");
      setEmail("");
      setPassword("");
      setCellNo("");
      setRole("");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const fallback = "An error occurred. Please try again.";
      setError(fallback);
      toast.error(fallback);
    }
  };

  return (
    <div className="flex items-center justify-center h-full px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl  p-8 my-8">
        {error && (
          <div className="flex items-start bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <BiErrorCircle className="text-xl mt-0.5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Create an Account
          </h2>

          {/* Name and Email */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example12@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Cell No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cell No
            </label>
            <div className="flex gap-2">
              {/* Country Code Dropdown */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="+92">+92</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                {/* Add more if needed */}
              </select>

              {/* Mobile Number Input */}
              <input
                type="text"
                value={cellNo}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only digits
                  if (/^\d*$/.test(value)) {
                    setCellNo(value);
                  }
                }}
                maxLength={10}
                placeholder="3001234567"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {/* Optional: Validation Message */}
            {cellNo.length > 0 && cellNo.length !== 10 && (
              <p className="text-red-500 text-sm mt-1">
                Number must be 10 digits
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select your role</option>
              <option value="Client">Service Seeker (Client)</option>
              <option value="Caregiver">Service Provider (Caregiver)</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-lightPrimary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition duration-200"
          >
            Register
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
