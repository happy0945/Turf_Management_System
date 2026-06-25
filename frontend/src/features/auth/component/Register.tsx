import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  contactNumber: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    console.log(data);
    // Call your backend API here
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
            />

            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Add contact number field */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                    Contact Number
                </label>
                <input
                    type="text"
                    placeholder="Enter your contact number"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
                    {...register("contactNumber", {
                        required: "Contact number is required",
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Enter a valid 10-digit contact number",
                        },
                    })}
                />
                {errors.contactNumber && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.contactNumber.message}
                    </p>
                )}
            </div>  


          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
                  message:
                    "Password must contain uppercase, lowercase and a number",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
              !isValid || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            }`}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-green-600 hover:underline"
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