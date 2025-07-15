import React from "react";
import { useState } from "react";

const Signup = () => {
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [pic, setPic] = useState("");

  // Handle Submit
  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("pic", pic);

    const response = await fetch(`/api/auth/signup`, {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    if (!response.ok) {
      console.log(json.error);
      setIsSubmitting(false);
    }
    if (response.ok) {
      console.log(json);
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name..."
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email..."
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your Password..."
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Choose any option</option>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
        </select>
        <input type="file" onChange={(e) => setPic(e.target.files[0])} />
        <input
          type="submit"
          disabled={IsSubmitting}
          className={`btn text-primary cursor-pointer ${
            IsSubmitting && "cursor-wait"
          }`}
        />
        <span>Already have an account? Then Login!</span>
      </form>
    </div>
  );
};

export default Signup;
