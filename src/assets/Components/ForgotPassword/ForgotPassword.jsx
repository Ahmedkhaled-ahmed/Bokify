import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    try {
      const response = await axios.post("https://boookify.runasp.net/api/Auth/forgot-password", {
        email,
      });
      setMessage("📩 Password reset link has been sent to your email.");
    } catch (error) {
      setErrorMsg("❌ Error: " + (error.response?.data || "Something went wrong"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f4df] font-[Kanit]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#8B3302]">Forgot Password</h2>
        <label className="block mb-2">Enter your email</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-4 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B3302]"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
        {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

        <button
          type="submit"
          className="bg-[#8B3302] text-white w-full py-2 rounded hover:bg-white hover:text-[#8B3302] border border-[#8B3302] transition"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
