import React, { useEffect, useState } from 'react';
import logo from '../../Images/logo.png' 
import { NavLink } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Navbar() {
    
    const navigate = useNavigate();
    // حالة جديدة لتخزين رابط الصورة الشخصية
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const userToken = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

    // جلب بيانات المستخدم عند تحميل المكون
    useEffect(() => {
        // لا تقم بأي شيء إذا لم يكن هناك توكن
        if (userToken) {
            axios.get("https://boookify.runasp.net/api/Profile/me", {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            })
            .then(res => {
                // تحديث الحالة برابط الصورة الشخصية من الـ API
                if (res.data && res.data.userProfile) {
                    setProfilePictureUrl(res.data.userProfile.profilePictureFullUrl);
                }
            })
            .catch(err => {
                console.error("Failed to fetch profile for Navbar:", err);
                // في حالة الفشل، ستبقى الصورة هي الأيقونة الافتراضية
            });
        }
    }, [userToken]); // يتم تنفيذ هذا التأثير عند تغيير التوكن (مثل تسجيل الدخول/الخروج)


    function handleLogout() {
        localStorage.removeItem("userToken");
        sessionStorage.removeItem("userToken");
        // مسح الصورة عند تسجيل الخروج
        setProfilePictureUrl(null);
        navigate("/login");
    }

    
    return (
        <>
            <nav className="bg-[#F6F4DF] border-gray-200 fixed top-0 left-0 w-full z-50 shadow-[0_6px_8px_-1px_rgba(0,0,0,0.1)]">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={logo} className="h-12" alt="Bookify Logo" />
                    </NavLink>

                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        {userToken && (
                            <button
                                onClick={handleLogout}
                                className="bg-[#8B3302] text-white px-4 py-2 rounded hover:bg-white hover:text-[#8B3302] border border-[#8B3302] transition text-sm me-8"
                            >
                                Logout
                            </button>
                        )}
                        
                        {/* --- تم تعديل هذا الزر --- */}
                        <button
                            onClick={() => navigate("/Profile")}
                            className="rounded-full w-12 h-12 bg-gray-200 hover:bg-gray-300 flex items-center justify-center  focus:outline-none focus:ring-2 focus:ring-[#8B3302] focus:ring-opacity-50 transition-colors duration-200 overflow-hidden"
                        >
                            {/* عرض الصورة إذا كانت موجودة، وإلا عرض الأيقونة الافتراضية */}
                            {profilePictureUrl ? (
                                <img src={profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-6 w-6 text-gray-600" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                    />
                                </svg>
                            )}
                        </button>
                        
                        <button
                            data-collapse-toggle="navbar-user"
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M1 1h15M1 7h15M1 13h15"
                                />
                            </svg>
                        </button>
                    </div>

                    <div
                        className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                        id="navbar-user"
                    >
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-[#F6F4DF] md:space-x-12 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-[#F6F4DF]">
                            <li>
                                <NavLink to="/" className={({ isActive }) => `block py-2 px-3 md:p-0 text-black ${isActive ? "font-bold" : "hover:font-bold"}`}>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/My_library" className={({ isActive }) => `block py-2 px-3 md:p-0 text-black ${isActive ? "font-bold" : "hover:font-bold"}`}>
                                    My Library
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/summarizes" className={({ isActive }) => `block py-2 px-3 md:p-0 text-black ${isActive ? "font-bold" : "hover:font-bold"}`}>
                                    Summarizes
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/Exams" className={({ isActive }) => `block py-2 px-3 md:p-0 text-black ${isActive ? "font-bold" : "hover:font-bold"}`}>
                                    Exams
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}