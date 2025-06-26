import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.split("?")[1];
    const params = new URLSearchParams(queryString);

    const emailFromURL = params.get("email") || "";
    const tokenFromURL = params.get("token") || "";

    setEmail(emailFromURL);
    setToken(decodeURIComponent(tokenFromURL));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    try {
      const response = await axios.post("https://boookify.runasp.net/api/Auth/reset-password", {
        email,
        token,
        newPassword: password,
      });

      setMessage("✅ Password has been reset successfully.");
      setPassword(""); 
    } catch (error) {
      setErrorMsg("❌ Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f4df] font-[Kanit]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#8B3302]">Reset Password</h2>

        <label className="block mb-2">New Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B3302]"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-600`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}

        <button
          type="submit"
          className="mt-4 bg-[#8B3302] text-white w-full py-2 rounded hover:bg-white hover:text-[#8B3302] border border-[#8B3302] transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
