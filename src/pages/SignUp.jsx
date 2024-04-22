import { useState, useEffect } from "react";
import { supabase } from "../client";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // If user is already logged in, redirect to main page
    fetchUserData();
  });

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserData(user.id);

    if (userData) {
      window.location.href = "/";
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: username,
        },
      },
    });

    if (error) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    } else {
      alert(
        "Please check your email to verify your account before logging in!"
      );
      window.location.href = "/";
    }

    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="Username">Username</label>
          <input
            id="username"
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SignUp;
