import { useState } from "react";
import { Link } from "react-router-dom";
import { BiErrorCircle } from "react-icons/bi";
import { useLogin } from "../../hooks/useLogin";
import { useSelector } from "react-redux";
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
    <div>
      {error && (
        <div className="error-backend flex border-2 border-red-500 bg-white p-2 rounded">
          <BiErrorCircle className=" text-red-500 mx-1 text-lg mt-0.5" />
          <p className="text-black">{error}</p>
        </div>
      )}
      {/* 
      {loggedIn && (
        <div className="error-backend flex border-2 border-green-500 bg-white p-2 rounded">
          <GrStatusGood className=" text-green-500 mx-1 text-lg mt-0.5" />
          <p className="text-black">User Logged in Successfully</p>
        </div>
      )} */}
      <form className="form w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="text-primary">Login</h2>
        <div className="mb-2 flex justify-between">
          <div>
            <h3 className="font-bold text-base">Admin:</h3>
            <p>siraj12@gmail.com</p>
            <p>siraj12#G</p>
          </div>
          <div>
            <h3 className="font-bold text-base">User:</h3>
            <p>example12@gmail.com</p>
            <p>example12#G</p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Email
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white f"
              type="email"
              placeholder="example12@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Password
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white f"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <input
          className="button"
          disabled={loading}
          type="submit"
          value={loading ? "Loging in..." : "Login"}
        />
        <p className="m mt-2 text-center text-slate-700">
          Already have an account?{" "}
          <Link className="text-black underline font-semibold " to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
