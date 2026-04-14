import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icons/logo.png";
import { loginUser } from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // 🔥 NEW

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      if (!res.success) {
        setError(res.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      navigate("/dashboard");
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-blue-600 text-white p-12">
          <img src={logo} className="h-14 mb-6" />
          <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
          <p className="text-blue-100 text-center">
            Login to manage hospital operations securely.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-center p-10">
          <h1 className="text-2xl font-bold mb-2">Login</h1>
          <p className="text-gray-500 mb-6">Enter your credentials</p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USERNAME */}
            <input
              type="text"
              name="username"
              required
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* 🔥 PASSWORD WITH SHOW/HIDE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg pr-10
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;