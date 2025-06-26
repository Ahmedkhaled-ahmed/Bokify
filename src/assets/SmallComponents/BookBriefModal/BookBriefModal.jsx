import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function BookBriefModal({ book, onClose }) {
  const [inLibrary, setInLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [description, setDescription] = useState("");

  const token =
    localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  useEffect(() => {
    if (!token || !book?.bookID) return;

    // Get description from main book API
    axios
      .get(`https://boookify.runasp.net/api/Books/${book.bookID}`)
      .then((res) => {
        setDescription(res.data.description);
      })
      .catch((err) => {
        console.error("Failed to load book description:", err);
        setDescription("No description available.");
      });

    // Get library status
    axios
      .get(`https://boookify.runasp.net/api/MyLibrary/books/${book.bookID}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setInLibrary(res.data.isInLibrary === true);
      })
      .catch((err) => console.error("Status error:", err))
      .finally(() => setLoading(false));
  }, [book?.bookID, token]);

  const handleToggleLibrary = () => {
    if (!token || !book?.bookID) {
      alert("Please log in first.");
      return;
    }

    setProcessing(true);

    const url = `https://boookify.runasp.net/api/MyLibrary/books/${book.bookID}`;

    const request = inLibrary
      ? axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(
          url,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

    request
      .then(() => {
        setInLibrary(!inLibrary);
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong!");
      })
      .finally(() => setProcessing(false));
  };

  if (!book) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white max-w-4xl w-[50%] md:w-[50%] rounded-lg shadow-lg p-6 relative z-50 flex flex-col md:flex-row gap-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>

        {/* Book Cover */}
        <img
          src={book.image}
          alt={book.title}
          className="w-40 h-[250px] object-cover rounded-md shadow-md self-center md:self-start"
        />

        {/* Book Info */}
        <div className="flex flex-col gap-3 text-left">
          <h2 className="text-lg font-bold text-[#1a1a1a]">{book.title}</h2>
          <h4 className="text-sm text-gray-500">{book.author}</h4>
          <p className="text-sm text-gray-700 max-h-60 overflow-y-auto pr-1 leading-relaxed">
            {description || "No description provided for this book."}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <button className="bg-[#8B3302] text-white px-4 py-2 rounded-md hover:bg-[#6b2600] transition text-sm">
              Get Summarize
            </button>

            <button
              onClick={handleToggleLibrary}
              disabled={loading || processing}
              className={`px-4 py-2 rounded-md text-sm border transition ${
                inLibrary
                  ? "bg-red-100 text-red-700 border-red-600 hover:bg-red-200"
                  : "bg-[#F6F4DF] text-[#8B3302] border-[#8B3302] hover:bg-[#e8e4ca]"
              }`}
            >
              {loading
                ? "Loading..."
                : processing
                ? "Processing..."
                : inLibrary
                ? "Remove from Library"
                : "Add to Library"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
