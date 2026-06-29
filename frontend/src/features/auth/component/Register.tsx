import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaCheckCircle } from "react-icons/fa";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  contactNumber: string;
};

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      
      // Simulate backend register time
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const userExists = users.some((u: any) => u.email === data.email);
      
      if (userExists) {
        alert("This email is already registered. Redirecting to Login.");
        navigate("/login");
        return;
      }
      
      users.push({
        username: data.username,
        email: data.email,
        password: data.password,
        contactNumber: data.contactNumber,
      });
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      
      // Redirect to login page
      navigate("/login");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] w-full max-w-md">
        
        {/* Title */}
        <h2 className="text-3xl font-black mb-2 text-center text-slate-800 dark:text-white">
          Create Account
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold text-center mb-8 uppercase tracking-widest">
          Sign up to join our sports club
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter username"
                className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-800 dark:text-slate-200 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                  errors.username ? "border-red-500" : "border-slate-200 dark:border-slate-800"
                }`}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450">
                <FaUser />
              </div>
            </div>
            {errors.username && (
              <p className="text-red-500 text-[10px] mt-1 font-semibold pl-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@email.com"
                className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-800 dark:text-slate-200 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                  errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-800"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450">
                <FaEnvelope />
              </div>
            </div>
            {errors.email && (
              <p className="text-red-500 text-[10px] mt-1 font-semibold pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Contact Number
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="10-digit phone number"
                className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-800 dark:text-slate-200 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                  errors.contactNumber ? "border-red-500" : "border-slate-200 dark:border-slate-800"
                }`}
                {...register("contactNumber", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit number",
                  },
                })}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450">
                <FaPhoneAlt />
              </div>
            </div>
            {errors.contactNumber && (
              <p className="text-red-500 text-[10px] mt-1 font-semibold pl-1">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password"
                className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-800 dark:text-slate-200 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                  errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-800"
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
                    message: "Must contain uppercase, lowercase and a number",
                  },
                })}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450">
                <FaLock />
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[10px] mt-1 font-semibold pl-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-md mt-6 cursor-pointer ${
              !isValid || loading
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 shadow-none cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow-green-500/10"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-20"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-100"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                  />
                </svg>
                <span>Creating Account...</span>
              </div>
            ) : (
              <>
                <FaCheckCircle className="text-xs" />
                <span>Register</span>
              </>
            )}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-green-500 hover:underline font-bold"
            >
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;