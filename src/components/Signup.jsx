import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

const Signup = () => {
  const navigate = useNavigate();

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target; // ✅ extract first

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (name === "password") {
      const strength = calculateStrength(value); // ✅ use value directly
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        formData,
        {
          withCredentials: true, // Send cookies automatically
        },
      );

      // Store token in localStorage for client-side auth checks
      // The httpOnly cookie is sent automatically by the browser
      if (res.data) {
        localStorage.setItem("accessToken", "authenticated");
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const calculateStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[@$!%*?&]/)) strength++;

    return strength;
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength === 2) return "Medium";
    if (passwordStrength >= 3) return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-24">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
            required
          />

          <select
            name="role"
            id="role"
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            {/* <option value="admin">Admin</option> */}
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full border px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
              required
            />

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Strength Bar */}
          <div className="mt-2 h-2 w-full bg-gray-200 rounded">
            <div
              className={`h-2 rounded ${getStrengthColor()}`}
              style={{ width: `${(passwordStrength / 4) * 100}%` }}
            ></div>
          </div>

          {/* Strength Text */}
          <p className="text-sm mt-1">
            Strength: <span className="font-medium">{getStrengthLabel()}</span>
          </p>

          {/* Rules */}
          <ul className="text-xs mt-2 text-gray-500 space-y-1">
            <li>• At least 6 characters</li>
            <li>• One uppercase letter</li>
            <li>• One number</li>
            <li>• One special character (@$!%*?&)</li>
          </ul>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
