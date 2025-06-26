import React, { useState } from 'react';
import Style from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import logo from "../../Images/logo.png";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setErrorMsg("");
      try {
        const response = await axios.post(
          "https://boookify.runasp.net/api/Auth/login",
          values
        );

        const token = response.data.token;

        if (rememberMe) {
          localStorage.setItem("userToken", token);
        } else {
          sessionStorage.setItem("userToken", token);
        }

        navigate("/");
      } catch (error) {
        console.error("❌ Login failed:", error.response?.data || error.message);
        setErrorMsg("Invalid email or password");
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
<div className="bg-[#f6f4df] min-h-screen flex items-center justify-center px-4 font-[Kanit]">
      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row items-center w-fit max-w-5xl p-6 md:p-10">
        {/* Logo */}
        <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
          <img src={logo} alt="Bookify Logo" className="w-3/4" />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 px-4 md:px-8">
          <h4 className="text-lg">Welcome to</h4>
          <h2 className="text-3xl font-bold text-[#8B3302] mb-4">Bookify</h2>

          {/* Divider */}
          <div className="flex items-center gap-2 my-5">
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Formik Form */}
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B3302]"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B3302]"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                <i
                  className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-600`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
            <span
                onClick={() => navigate("/forgot-password")}
                className="text-blue-500 hover:underline cursor-pointer"
            >
                Forgot password?
            </span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="text-red-500 text-sm text-center">{errorMsg}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="bg-[#8B3302] text-white rounded-xl py-3 font-bold tracking-wider hover:bg-white hover:text-[#8B3302] border border-[#8B3302] transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-black">
            Don’t have an account?{" "}
            <span
              className="text-[#8B3302] cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>    
    </motion.div>
    
  );
}
