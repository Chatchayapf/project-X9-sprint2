import { BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      await register(payload);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-amber-50">
        <div className="card bg-base-100 w-full shadow-xl border border-base-200 p-8 sm:p-10 flex flex-col items-center ">
          <BookOpen
            className="w-10 h-10 text-primary mb-4"
            strokeWidth={2}
            color="blue"
          />

          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-base-content tracking-tight mb-2">
            Create an account
          </h2>
          <p className="text-center text-sm text-base-content/60 mb-8">
            Or{" "}
            <Link
              to="/signin"
              className="link link-primary font-medium text-blue-800"
            >
              Sign in to your account
            </Link>
          </p>

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">First Name</span>
                </div>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  placeholder="Jane"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="input input-bordered input-primary w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </div>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                  placeholder="Doe"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="input input-bordered input-primary w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                />
              </label>
            </div>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold">Email address</span>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered input-primary w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold">Username</span>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="janedoe"
                value={formData.username}
                onChange={handleChange}
                className="input input-bordered input-primary w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold">Password</span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered input-primary w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold">
                  Confirm Password
                </span>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input input-bordered input-primary w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              />
            </label>

            {error && (
              <div className="alert alert-error py-2 text-sm">
                <span>{error}</span>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="btn btn-primary w-full bg-amber-300"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
