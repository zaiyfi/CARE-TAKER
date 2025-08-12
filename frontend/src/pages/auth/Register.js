import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email verification, 2: Full form
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [cellNo, setCellNo] = useState("");
  const [countryCode, setCountryCode] = useState("+92");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // Step 1: Send OTP
  const sendOtp = async () => {
    if (!email) {
      toast.error("Enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      toast.success("OTP sent to your email");
      setIsOtpSent(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      toast.success("Email verified!");
      setStep(2);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit registration
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          cellNo: `${countryCode}${cellNo}`,
          password,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-3"
          />

          {!isOtpSent ? (
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-lightPrimary hover:bg-primary text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded mb-3 mt-3"
              />
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                onClick={sendOtp}
                disabled={loading}
                className="mt-2 w-full text-sm text-blue-500 underline"
              >
                Resend OTP
              </button>
            </>
          )}
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold">Complete Registration</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-3 py-2 border rounded bg-white"
            >
              <option value="+92">+92</option>
              <option value="+1">+1</option>
            </select>
            <input
              type="text"
              placeholder="3001234567"
              value={cellNo}
              onChange={(e) =>
                /^\d*$/.test(e.target.value) && setCellNo(e.target.value)
              }
              className="flex-1 px-4 py-2 border rounded"
            />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-white"
          >
            <option value="">Select your role</option>
            <option value="Client">Service Seeker (Client)</option>
            <option value="Caregiver">Service Provider (Caregiver)</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-lightPrimary text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
