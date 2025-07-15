import React from "react";
import { useState } from "react";

const Login = () => {
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle Submit
  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
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

        <input
          type="submit"
          value="Login"
          disabled={IsSubmitting}
          className={`btn text-white bg-primary cursor-pointer ${
            IsSubmitting && "cursor-wait"
          }`}
        />
        <span>Don't have an account? Then Signup!</span>
      </form>
    </div>
  );
};

export default Login;
