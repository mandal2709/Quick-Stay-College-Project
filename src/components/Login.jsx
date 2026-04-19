import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData, {
        withCredentials: true,
      });

      if (res.data) {
        localStorage.setItem("accessToken", "authenticated");
        localStorage.setItem("user", JSON.stringify(res.data.user.role));
      }

      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-24">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Welcome Back
        </h2>

        {error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black py-2 text-white transition hover:bg-gray-800"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-black">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
