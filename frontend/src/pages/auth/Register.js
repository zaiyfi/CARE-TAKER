import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiErrorCircle } from "react-icons/bi";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cellNo, setCellNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setName("");
    setEmail("");
    setPassword("");
    setCellNo("");

    setError(null);

    const registerData = { name, email, cellNo, password };
    console.log(registerData);

    const response = await fetch("/api/auth/register", {
      body: JSON.stringify(registerData),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setName("");
      setEmail("");
      setPassword("");
    }
    if (response.ok) {
      navigate("/login");
    }
  };

  return (
    <div>
      {error && (
        <div className="error-backend flex border-2 border-red-500 bg-white p-2 rounded">
          <BiErrorCircle className=" text-red-500 mx-1 text-lg mt-0.5" />
          <p className="text-black">{error}</p>
        </div>
      )}
      <form className="form w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="">Register</h2>
        {/* Name and Email */}
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Name */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          {/* Email */}
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Email
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-primary"
              type="email"
              placeholder="example12@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        {/* Cell no Input*/}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Cell No
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="number"
              value={cellNo}
              onChange={(e) => setCellNo(e.target.value)}
              placeholder="+1 123 4321 98"
            />
          </div>
        </div>
        {/* Password Input */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Password
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-primary"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <input
          className="button border-slate-400"
          type="submit"
          value="Register"
        />
        <p className="m mt-2 text-center text-slate-700">
          Already have an account?{" "}
          <Link className="text-black underline font-semibold" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
