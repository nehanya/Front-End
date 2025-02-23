"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authService } from "@/app/services/auth-service";
import { setAuth, setLoggedInUser } from "@/app/redux/slices/session.slice";
import { AppDispatch } from "@/app/redux/store";
import { _Object } from "@/app/utils/interface";

const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { username: "", password: "", expiresInMins: 30 },
    validationSchema,
    onSubmit: async (values: _Object) => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.login(values);
        console.log("data>>", data);

        setLoading(false);

        if (data?.message || data?.errors) {
          setError("Invalid username or password");
        } else {
          dispatch(setAuth(data));
          dispatch(setLoggedInUser());
          router.push("/dashboard/todos");
        }
      } catch (err) {
        setLoading(false);
        setError("An unexpected error occurred. Please try again.");
        console.error("Login error:", err);
      }
    },
  });

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && (
            <div className="text-red-500 text-sm text-center mb-4">{error}</div>
          )}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-lg"
              />
              {formik.touched.username &&
                formik.errors.username &&
                typeof formik.errors.username === "string" && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.username}
                  </div>
                )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-lg"
              />
              {formik.touched.password &&
                formik.errors.password &&
                typeof formik.errors.password === "string" && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.password}
                  </div>
                )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-sm mt-4">
              If you&apos;re not registered, please{" "}
              <a href="/auth/signup" className="text-blue-500 hover:underline">
                Register here
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
