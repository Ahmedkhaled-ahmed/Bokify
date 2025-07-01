import React, { useState } from "react";
import axios from "axios";
import bookimg from "../../Images/bookimg.gif"; // تأكد من وجود الصورة دي في المسار الصحيح

export default function UploadAndProcessBook({ onChaptersFetched }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const token =
    localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://boookify.runasp.net/api/Books/process-upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onChaptersFetched({
        bookID: res.data.bookID,
        title: res.data.title,
        chapters: res.data.chapters,
      });
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* ✅ Loader Overlay */}
      {uploading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <img src={bookimg} alt="loading"  />
          <p className="text-white text-xl animate-pulse">Uploading your book...</p>
        </div>
      )}

      <div className="min-h-[50vh] bg-[#F6F4DF] flex items-center justify-center py-10 px-4 rounded-3xl">
        <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md text-center border border-[#8B3302] transition-transform duration-300 hover:scale-105">
          <div className="mb-4">
            <div className="w-14 h-14 mx-auto mb-2 bg-[#8B3302] rounded-full flex items-center justify-center text-white text-2xl shadow-md">
              📚
            </div>
            <h2 className="text-xl font-bold text-[#8B3302] mb-2">
              Upload your Book
            </h2>
            <p className="text-sm text-gray-600">
              Upload a PDF to generate a summary and quiz per chapter.
            </p>
          </div>

          <label className="block mt-6 cursor-pointer bg-[#8B3302] hover:bg-[#A14A0A] text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow-md">
            Choose PDF File
            <input
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {error && (
            <p className="mt-4 text-sm text-red-600 animate-pulse">{error}</p>
          )}
        </div>
      </div>
    </>
  );
}
