import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from "react";



const SignIn = () => {
  const [rememberMe, setRememberMe] = useState(false);
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center py-12 sm:px-6 lg:px-8"
     style={{ backgroundImage: "url('/images/login-bg.jpg')" }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-amber-50">
        <div className="card bg-base-100 w-full shadow-xl border border-base-200 p-8 sm:p-10 flex flex-col items-center">
          
          <BookOpen className="w-10 h-10 text-primary mb-4" strokeWidth={2} color='blue' />
          
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-base-content tracking-tight mb-2">
            Sign in to your account
          </h2>
          <p className="text-center text-sm text-base-content/60 mb-8">
            Or{' '}
            <Link to="/signup" className="link link-primary font-medium  text-blue-800">
              create a new account
            </Link>
          </p>

          <form className="w-full space-y-4" action="#" method="POST">
            <label className="form-control w-full ">
              <div className="label" >
                <span className="label-text font-semibold">Email address</span>
              </div>
              <input 
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="jane@example.com"
                className="input input-bordered input-primary w-full w-full border-2 border-gray-300 rounded-lg px-4 py-2"
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
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="input input-bordered input-primary w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              />
            </label>

            <div className="flex items-center justify-between pt-2">
              <label className="label cursor-pointer justify-start gap-2 p-0 ">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-6 w-6 shrink-0 appearance-auto accent-blue-600"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="label-text text-blue-800">Remember me</span>
              </label>

              <a href="#" className="label-text-alt link link-primary font-medium text-blue-800">
                Forgot your password?
              </a>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;