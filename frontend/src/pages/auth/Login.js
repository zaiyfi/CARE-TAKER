import { useState } from "react";
import { Link } from "react-router-dom";
import { BiErrorCircle } from "react-icons/bi";
import { useLogin } from "../../hooks/useLogin";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Login = () => {
  const { loading } = useSelector((state) => state.loader);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginHook, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail("");
    setPassword("");

    await loginHook(email, password);
  };

  return (
    <div className="flex items-center justify-center h-full px-4 my-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl">
        {/* Error Message */}
        {error && (
          <div className="flex items-start bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <BiErrorCircle className="text-xl mr-2 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-primary mb-4">
          Login
        </h2>

        {/* Dummy Credentials */}
        <div className="mb-6 text-sm text-gray-700 grid grid-cols-3 gap-2">
          <div className="bg-gray-50 p-2 rounded border">
            <h3 className="font-semibold">Admin:</h3>
            <p className="text-xs">huzaifatayyab12@gmail.com</p>
            <p className="text-xs">huzaifa12#G</p>
          </div>
          <div className="bg-gray-50 p-2 rounded border">
            <h3 className="font-semibold">Caregiver:</h3>
            <p className="text-xs">example12@gmail.com</p>
            <p className="text-xs">example12#G</p>
          </div>
          <div className="bg-gray-50 p-2 rounded border">
            <h3 className="font-semibold">Client:</h3>
            <p className="text-xs">asdf1234@gmail.com</p>
            <p className="text-xs">asdf1234#G</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="example12@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-lightPrimary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition duration-200 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
