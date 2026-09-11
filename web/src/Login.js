// src/Login.js
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const auth = getAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    const action = isRegistering
      ? createUserWithEmailAndPassword
      : signInWithEmailAndPassword;

    action(auth, email, password)
      .then((userCredential) => {
        onLogin(userCredential.user); // pass user to App
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container">
      <h2>{isRegistering ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">{isRegistering ? "Create Account" : "Log In"}</button>
      </form>

      <p style={{ color: "red" }}>{error}</p>

      <button
        onClick={() => {
          setIsRegistering(!isRegistering);
          setError("");
        }}
      >
        {isRegistering ? "Have an account? Log In" : "No account? Sign Up"}
      </button>
    </div>
  );
}

export default Login;
