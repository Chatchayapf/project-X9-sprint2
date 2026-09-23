import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const SignUp = () => {
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

          <form className="w-full space-y-4" action="#" method="POST">
            <div className="grid grid-cols-2 gap-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">First Name</span>
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Jane"
                  className="input input-bordered input-primary w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Doe"
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
                className="input input-bordered input-primary w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              />
            </label>

            <div className="pt-4">
              <button
                type="submit"
                className="btn btn-primary w-full bg-amber-300"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
