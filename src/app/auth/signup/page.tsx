"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobile: Yup.string()
        .matches(/^\d{10}$/, "Invalid mobile number")
        .required("Mobile number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Signup values:", values);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg relative">

        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input type="text" name="firstName" placeholder="First Name" {...formik.getFieldProps("firstName")} className="w-full p-2 border rounded-lg" />
          {formik.touched.firstName && formik.errors.firstName && <div className="text-red-500 text-sm">{formik.errors.firstName}</div>}

          <input type="text" name="lastName" placeholder="Last Name" {...formik.getFieldProps("lastName")} className="w-full p-2 border rounded-lg" />
          {formik.touched.lastName && formik.errors.lastName && <div className="text-red-500 text-sm">{formik.errors.lastName}</div>}

          <input type="email" name="email" placeholder="Email" {...formik.getFieldProps("email")} className="w-full p-2 border rounded-lg" />
          {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}

          <input type="text" name="mobile" placeholder="Mobile Number" {...formik.getFieldProps("mobile")} className="w-full p-2 border rounded-lg" />
          {formik.touched.mobile && formik.errors.mobile && <div className="text-red-500 text-sm">{formik.errors.mobile}</div>}

          <input type="password" name="password" placeholder="Password" {...formik.getFieldProps("password")} className="w-full p-2 border rounded-lg" />
          {formik.touched.password && formik.errors.password && <div className="text-red-500 text-sm">{formik.errors.password}</div>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Back to Login Button */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="text-blue-500 hover:underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

