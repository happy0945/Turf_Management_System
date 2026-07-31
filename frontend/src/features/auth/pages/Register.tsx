import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

type RegisterFormData = {
  fullName: string;
  emailId: string;
  password: string;
  contactNumber: string;
};

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setFormError(null);
    setLoading(true);
    try {
      await registerUser({
        fullName: data.fullName,
        emailId: data.emailId,
        password: data.password,
        contactNumber: data.contactNumber,
      });
      // After registration, user is auto-logged in, redirect to turfs
      navigate("/turfs");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
      setFormError(msg);
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

        {formError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-xs py-3 px-4 rounded-xl mb-4 text-center">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your full name"
                className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-800 dark:text-slate-200 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                  errors.fullName ? "border-red-500" : "border-slate-200 dark:border-slate-800"
                }`}
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <FaUser />
              </div>
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-[10px] mt-1 font-semibold pl-1">
                {errors.fullName.message}
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
                  errors.emailId ? "border-red-500" : "border-slate-200 dark:border-slate-800"
                }`}
                {...register("emailId", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <FaEnvelope />
              </div>
            </div>
            {errors.emailId && (
              <p className="text-red-500 text-[10px] mt-1 font-semibold pl-1">
                {errors.emailId.message}
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
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
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
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <FaLock />
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[10px] mt-1 font-semibold pl-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Info note */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/5 border border-green-500/20 rounded-xl p-3"
            >
              <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold">
                🎉 You'll be automatically logged in after registration. To become a Turf Owner, contact an admin after registering.
              </p>
            </motion.div>
          </AnimatePresence>

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