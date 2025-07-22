import React, { useState } from "react";

const Signup = () => {
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [pic, setPic] = useState("");

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("pic", pic);

    try {
      const response = await fetch(`/api/auth/signup`, {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.error);
      } else {
        console.log("Signup success:", json);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name..."
          className="border rounded-md px-4 py-2"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email..."
          className="border rounded-md px-4 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your Password..."
          className="border rounded-md px-4 py-2"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="">Choose your role</option>
          <option value="Client">Service Seeker (Client)</option>
          <option value="Caregiver">Service Provider (Caregiver)</option>
        </select>

        <input
          type="file"
          onChange={(e) => setPic(e.target.files[0])}
          className="border rounded-md px-4 py-2"
        />

        <button
          type="submit"
          disabled={IsSubmitting}
          className={`bg-primary text-white px-4 py-2 rounded-md ${
            IsSubmitting
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-secondary"
          }`}
        >
          {IsSubmitting ? "Submitting..." : "Sign Up"}
        </button>

        <span className="text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login here
          </a>
        </span>
      </form>
    </div>
  );
};

export default Signup;
