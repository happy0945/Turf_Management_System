import { useState } from "react";
<<<<<<< HEAD
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
=======
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = yup.InferType<typeof schema>;

const Login = () => {
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
<<<<<<< HEAD
=======
    setFormError(null);
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
    try {
      setLoading(true);

      // Simulate API call
<<<<<<< HEAD
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(data);
=======
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const matchedUser = users.find((u: any) => u.email === data.email);

      if (!matchedUser) {
        setFormError("Account does not exist. Please register first.");
        return;
      }

      if (matchedUser.password !== data.password) {
        setFormError("Incorrect password. Please try again.");
        return;
      }

      localStorage.setItem("userToken", "mock-session-jwt-token-12345");
      localStorage.setItem("userEmail", matchedUser.email);
      localStorage.setItem("userName", matchedUser.username);

      // Redirect to catalog page
      navigate("/book-turf");
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
              {...register("email")}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
=======
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] w-full max-w-md">
        
        {/* Title */}
        <h2 className="text-3xl font-black mb-2 text-center text-slate-800 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold text-center mb-8 uppercase tracking-widest">
          Login to reserve sports turfs
        </p>

        {formError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-xs py-3 px-4 rounded-xl mb-4 text-center">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@email.com"
                className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-800 dark:text-slate-200 py-3.5 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-200 dark:border-slate-800 focus:ring-green-500"
                }`}
                {...register("email")}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-455">
                <FaEnvelope />
              </div>
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-semibold pl-1">
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
<<<<<<< HEAD
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
              {...register("password")}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
=======
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password"
                className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-800 dark:text-slate-200 py-3.5 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-200 dark:border-slate-800 focus:ring-green-500"
                }`}
                {...register("password")}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-455">
                <FaLock />
              </div>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-semibold pl-1">
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
                {errors.password.message}
              </p>
            )}
          </div>

<<<<<<< HEAD
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
              !isValid || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
=======
          {/* Action button */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer ${
              !isValid || loading
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 shadow-none cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow-green-500/10"
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
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
<<<<<<< HEAD

=======
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
                  <path
                    className="opacity-100"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                  />
                </svg>
<<<<<<< HEAD

                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <NavLink
              to="/register"
              className="text-green-600 hover:underline"
=======
                <span>Logging in...</span>
              </div>
            ) : (
              <>
                <FaCheckCircle className="text-xs" />
                <span>Login</span>
              </>
            )}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            Don't have an account?{" "}
            <NavLink
              to="/register"
              className="text-green-500 hover:underline font-bold"
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
            >
              Register
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;