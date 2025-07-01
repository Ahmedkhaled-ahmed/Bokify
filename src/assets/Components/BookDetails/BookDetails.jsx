import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import BookCard from "../../SmallComponents/BookCard/BookCard";
import { motion } from "framer-motion";
import ChaptersList from "../../SmallComponents/ChaptersList/ChaptersList.jsx"
import SummaryViewer from "../../SmallComponents/SummaryViewer/SummaryViewer.jsx"
import ChapterQuiz from "../../SmallComponents/ChapterQuiz/ChapterQuiz.jsx"

// Icons
import { FaBookmark, FaBookOpen, FaGlobe, FaCalendarAlt, FaChartBar } from "react-icons/fa";





// 📚 Component لعرض كل عنصر من تفاصيل الكتاب
const BookInfoStat = ({ icon, label, value }) => (
  <div className="flex items-center text-sm text-gray-600">
    {icon}
    <span className="ml-2">{label}:</span>
    <span className="font-semibold ml-1">{value}</span>
  </div>
);





// ⭐ Component التوصيات
function ContentRecommendations({ bookID }) {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://boookify.runasp.net/api/Books/${bookID}/recommendations/content?topN=4`)
      .then((res) => {
        if (res.data && Array.isArray(res.data.recommendedBooks)) {
          setRecommendedBooks(res.data.recommendedBooks);
        } else {
          setRecommendedBooks([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching recommended books:", err);
        setRecommendedBooks([]);
      });
  }, [bookID]);

  if (!recommendedBooks.length) return null;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Similar Books</h2>
      <section className="mt-10 p-4 bg-[#F6F4DF] rounded-xl">
        <div className="overflow-x-auto">
          <div className="flex gap-6 overflow-x-auto pb-4">
            {recommendedBooks.map((book) => (
              <div key={book.bookID} className="min-w-[300px] max-w-[300px] flex-shrink-0">
                <BookCard
  bookID={book.bookID}
  title={book.title}
  author={book.author}
  image={book.coverImageUrl}
  onDetailsClick={() => navigate(`/BookDetails?q=${book.bookID}`)} // ✅
/>

              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


// ✅ Main Component
export default function BookDetails() {
  const [searchParams] = useSearchParams();
  const bookID = searchParams.get("q");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inLibrary, setInLibrary] = useState(false);
  const [loadingLibraryStatus, setLoadingLibraryStatus] = useState(true);
  const [showChapters, setShowChapters] = useState(false);
  const [chapterList, setChapterList] = useState([]);
  const [selectedChapterID, setSelectedChapterID] = useState(null);
  const [viewMode, setViewMode] = useState(null); // "summary" أو "quiz"


  const navigate = useNavigate();

  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  // 📘 تحميل بيانات الكتاب
  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ ده الإضافة
    axios
      .get(`https://boookify.runasp.net/api/Books/${bookID}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching book:", err);
        setLoading(false);
      });
  }, [bookID]);

  // ✅ فحص هل الكتاب موجود في المكتبة
  useEffect(() => {
    if (!token || !bookID) return;

    axios
      .get(`https://boookify.runasp.net/api/MyLibrary/books/${bookID}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setInLibrary(res.data.isInLibrary === true);
      })
      .catch((err) => {
        console.error("Library status check failed:", err);
      })
      .finally(() => setLoadingLibraryStatus(false));
  }, [bookID, token]);

  // ✅ تحميل تقدم القراءة


  // ➕ إضافة للمكتبة
  const handleAddToLibrary = () => {
    if (!token) return alert("Please log in first.");
    axios
      .post(`https://boookify.runasp.net/api/MyLibrary/books/${bookID}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setInLibrary(true))
      .catch((err) => {
        console.error("Add failed:", err);
        alert("Failed to add book.");
      });
  };

  // ❌ إزالة من المكتبة
  const handleRemoveFromLibrary = () => {
    if (!token) return alert("Please log in first.");
    axios
      .delete(`https://boookify.runasp.net/api/MyLibrary/books/${bookID}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setInLibrary(false))
      .catch((err) => {
        console.error("Remove failed:", err);
        alert("Failed to remove book.");
      });
  };

  if (loading) return <div className="text-center p-10 text-xl">Loading...</div>;
  if (!book) return <div className="text-center p-10 text-red-500">Book Not Found!</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
<div className="bg-white min-h-screen font-sans mt-32" dir="ltr">
      <div className="container mx-auto p-4 md:p-8 max-w-5xl">
        {/* 📘 Book Info */}
        <section className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img src={book.coverImageUrl} alt={book.title} className="w-48 h-auto rounded-lg shadow-lg" />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                <p className="text-md text-gray-500">{book.subTitle || ""}</p>
              </div>

              {loadingLibraryStatus ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-[#8B3302] rounded-full animate-spin mt-1" />
              ) : (
                <button
                  onClick={inLibrary ? handleRemoveFromLibrary : handleAddToLibrary}
                  className={`flex items-center gap-2 text-sm ${inLibrary ? "text-red-600 hover:text-red-800" : "text-gray-600 hover:text-indigo-600"}`}
                >
                  <FaBookmark className="w-5 h-5" />
                  <span>{inLibrary ? "Remove from Library" : "Add to Library"}</span>
                </button>
              )}
            </div>

            <p className="text-lg text-gray-700 mb-4">
              Author: <span className="font-semibold">{book.author}</span>
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
              <BookInfoStat icon={<FaBookOpen className="w-4 h-4 mr-1" />} label="Pages" value={book.totalPages || "N/A"} />
              <BookInfoStat icon={<FaGlobe className="w-4 h-4 mr-1" />} label="Language" value={book.language || "N/A"} />
              <BookInfoStat icon={<FaCalendarAlt className="w-4 h-4 mr-1" />} label="Published" value={book.releaseYear || "N/A"} />
            </div>



            <div className="mt-auto flex flex-col sm:flex-row gap-3">
<button
  onClick={() => navigate(`/read?q=${bookID}`)}
  className="flex-1 bg-[#F6F4DF] shadow-md hover:shadow-xl transition duration-200 font-semibold py-3 px-4 rounded-lg"
>
  Read The Book
</button>

  <button
  onClick={() => {
    setChapterList(book.chapters); // ✅ استغلال الـ chapters الموجودة
    setShowChapters(true);         // ✅ إظهار الكمبوننت
  }}
  className="flex-1 bg-[#F6F4DF] shadow-md hover:shadow-xl transition duration-200 font-semibold py-3 px-4 rounded-lg"
>
  Generate Summary OR Quiz
</button>

</div>

          </div>
        </section>

        {/* 📄 Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">BRIEF</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            {book.description || "No description available."}
          </p>
        </section>

        {/* 📚 Similar Books */}
        <ContentRecommendations bookID={bookID} />
      </div>
    </div>
    {showChapters && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-xl max-w-xl w-full shadow-lg relative">
      <button
        onClick={() => setShowChapters(false)}
        className="absolute top-3 right-3 text-white bg-[#8B3302] hover:bg-[#6b2401] px-3 py-1 rounded-md"
      >
        ✖
      </button>

      <ChaptersList
        bookID={book.bookID}
        chapters={chapterList}
        onSelect={(chapterID, mode) => {
  setSelectedChapterID(chapterID);
  setViewMode(mode);
  setShowChapters(false); // نقفل البانل بعد الاختيار
}}

      />
    </div>
  </div>
)}
    {selectedChapterID && viewMode === "summary" && (
  <SummaryViewer
    chapterID={selectedChapterID}
    onClose={() => {
      setSelectedChapterID(null);
      setViewMode(null);
    }}
  />
)}

{selectedChapterID && viewMode === "quiz" && (
  <ChapterQuiz
    chapterID={selectedChapterID}
    onClose={() => {
      setSelectedChapterID(null);
      setViewMode(null);
    }}
  />
)}

    </motion.div>
    
  );
}
