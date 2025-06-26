import React, { useEffect, useState } from "react";
import axios from "axios";
import LibraryBookCard from "../../SmallComponents/LibraryBookCard/LibraryBookCard.jsx";
import { motion } from "framer-motion";

export default function My_Library() {
  const [books, setBooks] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  useEffect(() => {
    if (!token) return;

    const fetchLibrary = async () => {
      try {
        const [booksRes, progressRes] = await Promise.all([
          axios.get("https://boookify.runasp.net/api/MyLibrary/books?pageNumber=1&pageSize=20", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://boookify.runasp.net/api/Progress/my/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const booksData = booksRes.data;
        const progressData = progressRes.data;

        // Build map: bookID => percentage
        const progressMap = {};
        progressData.forEach((item) => {
          progressMap[item.bookID] = item.completionPercentage || 0;
        });

        setProgressMap(progressMap);
        setBooks(booksData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [token]);

  if (!token)
    return (
      <div className="text-center mt-32 text-xl text-red-500">
        ⚠️ Please log in to access your library.
      </div>
    );

  if (loading)
    return (
      <div className="text-center mt-32 text-xl">Loading your library...</div>
    );

  if (books.length === 0)
    return (
      <div className="text-center mt-32 text-xl text-gray-500">
        Your library is empty.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
<main className="pt-24 bg-[#FFFEF0] min-h-screen">
      <div className="container mx-auto max-w-7xl p-4 sm:p-5">
        <h2 className="text-3xl font-bold text-center mb-10">📚 My Library</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {books.map((book) => (
            <LibraryBookCard
              key={book.bookID}
              book={{
                ...book,
                progress: progressMap[book.bookID] || 0,
              }}
            />
          ))}
        </div>
      </div>
    </main>
    </motion.div>
    
  );
}
