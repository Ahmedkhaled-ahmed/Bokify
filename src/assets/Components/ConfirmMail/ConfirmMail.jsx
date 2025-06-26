import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const hash = window.location.hash; 
    const queryString = hash.split("?")[1];

    if (!queryString) {
      setStatus("error");
      return;
    }

    const params = new URLSearchParams(queryString);
    const userId = params.get("userId");
    const encodedToken = params.get("token");

    if (!userId || !encodedToken) {
      console.error("❌ Missing userId or token from URL");
      setStatus("error");
      return;
    }

    const token = decodeURIComponent(encodedToken);

    console.log("🔍 Confirming email...");
    console.log("👤 userId:", userId);
    console.log("🧾 token:", token);

    axios
      .get(`https://boookify.runasp.net/api/Auth/confirm-email`, {
        params: {
          userId: userId,
          token: token,
        },
      })
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/"), 5000);
      })
      .catch((err) => {
        console.error("❌ Confirmation error:", err.response?.data || err.message);
        setStatus("error");
      });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[90%] max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Confirming your email...</h2>
            <p className="text-gray-500">Please wait while we confirm your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-5xl mb-2">✅</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Email Confirmed!</h2>
            <p className="text-gray-500">Your email has been successfully confirmed.</p>
            <button
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-5xl mb-2">❌</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Confirmation Failed</h2>
            <p className="text-gray-500">The link may have expired or is invalid.</p>
            <button
              className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
