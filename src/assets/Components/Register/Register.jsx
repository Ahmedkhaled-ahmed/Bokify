import { useFormik } from 'formik'
import axios from 'axios'
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { motion } from "framer-motion";


export default function Register() {

    const navigate = useNavigate();
    // FIX 1: Separated state for each password field for independent control
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // FIX 2: Added loading and error/success states instead of using alert()
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [apiSuccess, setApiSuccess] = useState(null);


    function handleRegister(formValues) {
        setIsLoading(true);
        setApiError(null);
        setApiSuccess(null);

        axios.post("https://boookify.runasp.net/api/Auth/register", formValues)
            .then(response => {
                setApiSuccess("An email has been sent to your email address to confirm your account.");
                registerform.resetForm();
            })
            .catch(error => {
                // Handle potential error structures
                const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
                setApiError(errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username must be at most 20 characters")
            .required("Username is required"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[@$!%*?&\-_]/, "Password must contain at least one special character"),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm Password is required"),
        age: Yup.number()
            .required("Age is required")
            .min(12, "Minimum age is 12")
            .max(100, "Maximum age is 100"),
        specialization: Yup.string()
            .required("Specialization is required"),
        level: Yup.string()
            .required("Level is required"),
        interest: Yup.string()
            .min(2, "Interest must be at least 2 characters")
            .required("Interest is required"),
    });

    let registerform = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            age: "",
            specialization: "",
            level: "",
            interest: ""
        },
        validationSchema: validationSchema,
        onSubmit: handleRegister
    })

    return (
        <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
<div className="bg-[#F6F4DF] font-sans min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 m-4 border border-[#8B3302]/20">
                <h1 className="text-4xl font-bold text-center text-[#8B3302] mb-2">Create Your Account</h1>
                <p className="text-center text-[#8B3302]/80 mb-8">Join Our Community Of Learners and Readers.</p>

                <form onSubmit={registerform.handleSubmit} className="space-y-6">
                    
                    {/* API Message Display */}
                    {apiError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{apiError}</div>}
                    {apiSuccess && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">{apiSuccess}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username Input */}
                        <div>
                            <div className="relative">
                                <input
                                    name='username'
                                    value={registerform.values.username}
                                    onChange={registerform.handleChange}
                                    onBlur={registerform.handleBlur}
                                    type="text"
                                    id="username"
                                    className="block w-full px-4 py-3 text-md text-[#8B3302] bg-transparent rounded-lg border-2 border-[#8B3302]/50 focus:outline-none focus:ring-0 focus:border-[#8B3302] peer"
                                    placeholder=" "
                                />
                                <label htmlFor="username" className="absolute text-md text-[#8B3302]/70 duration-300 transform -translate-y-4 scale-75 top-4 start-2.5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Username</label>
                            </div>
                            {registerform.touched.username && registerform.errors.username && (
                                <div className="text-red-600 text-sm mt-1">{registerform.errors.username}</div>
                            )}
                        </div>

                        {/* Email Input */}
                        <div>
                            <div className="relative">
                                <input
                                    name='email'
                                    value={registerform.values.email}
                                    onChange={registerform.handleChange}
                                    onBlur={registerform.handleBlur}
                                    type="email"
                                    id="email"
                                    className="block w-full px-4 py-3 text-md text-[#8B3302] bg-transparent rounded-lg border-2 border-[#8B3302]/50 focus:outline-none focus:ring-0 focus:border-[#8B3302] peer"
                                    placeholder=" "
                                />
                                <label htmlFor="email" className="absolute text-md text-[#8B3302]/70 duration-300 transform -translate-y-4 scale-75 top-4 start-2.5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Email Address</label>
                            </div>
                            {registerform.touched.email && registerform.errors.email && (
                                <div className="text-red-600 text-sm mt-1">{registerform.errors.email}</div>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            {/* FIX 3: Added a new relative div to wrap only the input and the icon */}
                            <div className="relative">
                                <input
                                    name='password'
                                    value={registerform.values.password}
                                    onChange={registerform.handleChange}
                                    onBlur={registerform.handleBlur}
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="block w-full px-4 py-3 text-md text-[#8B3302] bg-transparent rounded-lg border-2 border-[#8B3302]/50 focus:outline-none focus:ring-0 focus:border-[#8B3302] peer"
                                    placeholder=" "
                                />
                                <i
                                    className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[#8B3302]/70`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                                <label htmlFor="password" className="absolute text-md text-[#8B3302]/70 duration-300 transform -translate-y-4 scale-75 top-4 start-2.5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Password</label>
                            </div>
                            {registerform.touched.password && registerform.errors.password && (
                                <div className="text-red-600 text-sm mt-1">{registerform.errors.password}</div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <div className="relative">
                                <input
                                    name='confirmPassword'
                                    value={registerform.values.confirmPassword}
                                    onChange={registerform.handleChange}
                                    onBlur={registerform.handleBlur}
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    className="block w-full px-4 py-3 text-md text-[#8B3302] bg-transparent rounded-lg border-2 border-[#8B3302]/50 focus:outline-none focus:ring-0 focus:border-[#8B3302] peer"
                                    placeholder=" "
                                />
                                <i
                                    className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"} absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[#8B3302]/70`}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                ></i>
                                <label htmlFor="confirmPassword" className="absolute text-md text-[#8B3302]/70 duration-300 transform -translate-y-4 scale-75 top-4 start-2.5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Confirm Password</label>
                            </div>
                            {registerform.touched.confirmPassword && registerform.errors.confirmPassword && (
                                <div className="text-red-600 text-sm mt-1">{registerform.errors.confirmPassword}</div>
                            )}
                        </div>
                        
                        {/* Age */}
                        <div>
                            <div className="relative">
                                <input
                                    name='age'
                                    value={registerform.values.age}
                                    onChange={registerform.handleChange}
                                    onBlur={registerform.handleBlur}
                                    type="number"
                                    id="age"
                                    className="block w-full px-4 py-3 text-md text-[#8B3302] bg-transparent rounded-lg border-2 border-[#8B3302]/50 focus:outline-none focus:ring-0 focus:border-[#8B3302] peer"
                                    placeholder=" "
                                />
                                <label htmlFor="age" className="absolute text-md text-[#8B3302]/70 duration-300 transform -translate-y-4 scale-75 top-4 start-2.5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Age</label>
                            </div>
                            {registerform.touched.age && registerform.errors.age && (
                                <div className="text-red-600 text-sm mt-1">{registerform.errors.age}</div>
                            )}
                        </div>

                        {/* Specialization */}
                        <div>
                            <div className="relative">
                                <select
                                    name='specialization'
                                    value={registerform.values.specialization}
                                    onChange={registerform.handleChange}
                                    onBlur={registerform.handleBlur}
                                    id="specialization"
                                    className="block w-full px-4 py-3 text-md text-[#8B3302] bg-transparent rounded-lg border-2 border-[#8B3302]/50 focus:outline-none focus:ring-0 focus:border-[#8B3302] appearance-none"
                                >
                                    <option value="" disabled>Select specialization</option>
                                    <option value="medical">Medical</option>
                                    <option value="law">Law</option>
                                    <option value="history">History</option>
                                    <option value="economics & finance">Economics & Finance</option>
                                    <option value="psychology">Psychology</option>
                                    <option value="computer science">Computer Science</option>
                                </select>
                            </div>
                            {registerform.touched.specialization && registerform.errors.specialization && (
                                <div className="text-red-600 text-sm mt-1">{registerform.errors.specialization}</div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Level */}
                        <div>
                            <div className="relative">
                                <select
                                    name='level'
                                    value={registerform.values.level}
                                    onChange={registerform.handleChange}
                                    onBlur={registerform.handleBlur}
                                    id="level"
                                    className="block w-full px-4 py-3 text-md text-[#8B3302] bg-transparent rounded-lg border-2 border-[#8B3302]/50 focus:outline-none focus:ring-0 focus:border-[#8B3302] appearance-none"
                                >
                                    <option value="" disabled>Level</option>
                                    <option value="beginner">Junior</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            {registerform.touched.level && registerform.errors.level && (
                                <div className="text-red-600 text-sm mt-1">{registerform.errors.level}</div>
                            )}
                        </div>

                        {/* Interest */}
                        <div>
                            <div className="relative">
                                <input
                                    name='interest'
                                    value={registerform.values.interest}
                                    onChange={registerform.handleChange}
                                    onBlur={registerform.handleBlur}
                                    type="text"
                                    id="interest"
                                    className="block w-full px-4 py-3 text-md text-[#8B3302] bg-transparent rounded-lg border-2 border-[#8B3302]/50 focus:outline-none focus:ring-0 focus:border-[#8B3302] peer"
                                    placeholder=" "
                                />
                                <label htmlFor="interest" className="absolute text-md text-[#8B3302]/70 duration-300 transform -translate-y-4 scale-75 top-4 start-2.5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Interest</label>
                            </div>
                            {registerform.touched.interest && registerform.errors.interest && (
                                <div className="text-red-600 text-sm mt-1">{registerform.errors.interest}</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#8B3302] text-white rounded-xl py-3 font-bold tracking-wider hover:bg-white hover:text-[#8B3302] border border-[#8B3302] transition w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-white"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                        <p className="mt-6 text-center text-black">
                            Already have an account?
                            <span
                                className="text-[#8B3302] cursor-pointer hover:underline ml-1"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>    
        </motion.div>
        
    )
}
