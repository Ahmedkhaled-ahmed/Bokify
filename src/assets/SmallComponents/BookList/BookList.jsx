import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function BookList() {
  const [topRated, setTopRated] = useState([]);
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [minViews, setMinViews] = useState("");
  const [minRating, setMinRating] = useState("");
  const [recentYears, setRecentYears] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("top");
  const pageSize = 8;

  const categories = [
    "Economics",
    "Finance",
    "History",
    "Law",
    "Medicine",
    "Psychology",
    "Technology"
  ];

  useEffect(() => {
    axios
      .get("https://boookify.runasp.net/api/Books/recommendations/top-ranked?topN=8")
      .then((res) => setTopRated(res.data))
      .catch((err) => console.error("Error loading top rated books:", err));
  }, []);

  useEffect(() => {
    if (activeTab === "all" || activeTab === "category") {
      let endpoint = "https://boookify.runasp.net/api/Books";

      if (activeTab === "category") {
        endpoint = `https://boookify.runasp.net/api/Books/recommendations/filter?PageNumber=${pageNumber}&PageSize=${pageSize}`;
        if (category) endpoint += `&Category=${category}`;
        if (author) endpoint += `&Author=${author}`;
        if (language) endpoint += `&Language=${language}`;
        if (difficulty) endpoint += `&Difficulty=${difficulty}`;
        if (minViews) endpoint += `&MinViews=${minViews}`;
        if (minRating) endpoint += `&MinRating=${minRating}`;
        if (recentYears) endpoint += `&RecentYears=${recentYears}`;
      } else {
        endpoint += `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      }

      axios
        .get(endpoint)
        .then((res) => {
          setBooks(res.data.books || res.data);
          const total = res.data.totalPages || Math.ceil(res.data.totalCount / pageSize) || 1;
          setTotalPages(total);
        })
        .catch((err) => console.error("Error loading books:", err));
    }
  }, [category, author, language, difficulty, minViews, minRating, recentYears, pageNumber, activeTab]);

  return (
    <div className="bg-white min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          <button onClick={() => setActiveTab("top")} className={`px-5 py-2 rounded-full text-sm font-bold transition ${activeTab === "top" ? "bg-[#8B3302] text-white" : "bg-[#F6F4DF] text-[#8B3302] hover:bg-[#EAE5CB]"}`}>
            Top Rated
          </button>
          <button onClick={() => { setActiveTab("all"); setCategory(""); setPageNumber(1); }} className={`px-5 py-2 rounded-full text-sm font-bold transition ${activeTab === "all" ? "bg-[#8B3302] text-white" : "bg-[#F6F4DF] text-[#8B3302] hover:bg-[#EAE5CB]"}`}>
            All Books
          </button>
          <button onClick={() => { setActiveTab("category"); setPageNumber(1); }} className={`px-5 py-2 rounded-full text-sm font-bold transition ${activeTab === "category" ? "bg-[#8B3302] text-white" : "bg-[#F6F4DF] text-[#8B3302] hover:bg-[#EAE5CB]"}`}>
            Suggested Books
          </button>
          
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "top" && (
            <motion.div
              key="top"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold text-[#8B3302] mb-6 text-center">Top Rated Books</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {topRated.map((book) => (
                  <BookCard key={book.bookID} image={book.coverImageUrl} title={book.title} author={book.author} bookID={book.bookID} showBookmark={true} brief={book.description} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "category" && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <select value={category} onChange={(e) => { setCategory(e.target.value); setPageNumber(1); }} className="border px-3 py-2 rounded-md text-sm">
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} className="border px-3 py-2 rounded-md text-sm" />
                <input type="text" placeholder="Language" value={language} onChange={(e) => setLanguage(e.target.value)} className="border px-3 py-2 rounded-md text-sm" />
                <input type="text" placeholder="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="border px-3 py-2 rounded-md text-sm" />
                <input type="number" placeholder="Min Views" value={minViews} onChange={(e) => setMinViews(e.target.value)} className="border px-3 py-2 rounded-md text-sm" />
                <input type="number" placeholder="Min Rating" value={minRating} onChange={(e) => setMinRating(e.target.value)} className="border px-3 py-2 rounded-md text-sm" />
                <input type="number" placeholder="Recent Years" value={recentYears} onChange={(e) => setRecentYears(e.target.value)} className="border px-3 py-2 rounded-md text-sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {books.map((book) => (
                  <BookCard key={book.bookID} image={book.coverImageUrl} title={book.title} author={book.author} bookID={book.bookID} brief={book.description} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "all" && (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold text-[#8B3302] mb-6 text-center">All Books</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {books.map((book) => (
                  <BookCard key={book.bookID} image={book.coverImageUrl} title={book.title} author={book.author} bookID={book.bookID} brief={book.description} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(activeTab === "all" || activeTab === "category") && (
          <div className="flex justify-center mt-10 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index} onClick={() => setPageNumber(index + 1)} className={`px-4 py-2 rounded-full text-sm ${pageNumber === index + 1 ? "bg-[#8B3302] text-white" : "bg-[#F6F4DF] text-[#8B3302] hover:bg-[#e8e4ca]"}`}>
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
