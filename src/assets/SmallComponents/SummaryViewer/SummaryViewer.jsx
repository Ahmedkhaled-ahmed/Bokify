import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import bookimg from "../../Images/bookimg.gif"
import axios from "axios";

export default function SummaryBookModal({ chapterID, onClose }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  useEffect(() => {
    if (!chapterID) return;

    setLoading(true);
    axios
      .get(
        `https://boookify.runasp.net/api/Summaries/chapters/${chapterID}/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setSummary(res.data.content);
      })
      .catch((err) => {
        console.error("Error fetching summary:", err);
        setSummary(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [chapterID]);

  if (loading) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <img src={bookimg} alt="loading"  />
            <p className="text-white text-xl animate-pulse">Generate Summary...</p>
        </div>
    );
  }

  if (!summary) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-30">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <p className="text-red-600 text-lg">
            ❌ No summary found for this chapter.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-[#8B3302] text-white rounded hover:bg-[#6b2401]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const wordsPerPage = 1200;
  const pages = [];
  for (let i = 0; i < summary.length; i += wordsPerPage) {
    pages.push(summary.slice(i, i + wordsPerPage));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50 p-4">
      {/* زر الخروج */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white bg-[#8B3302] hover:bg-[#6b2401] px-4 py-1 rounded-md z-50"
      >
        ✖ Close
      </button>

      {/* الكتاب */}
      <HTMLFlipBook
          width={400}
          height={550}
          size="stretch"
          minWidth={315}
          maxWidth={500}
          minHeight={400}
          maxHeight={650}
          showCover={true}
          className="shadow-2xl"
          mobileScrollSupport={true}
        >
          {/* --- START: Cover Page with New Flip Instruction --- */}
          <div className="relative flex flex-col items-center justify-center bg-[#8B3302] text-white font-bold text-xl p-6 h-full overflow-hidden">
            {/* Main Cover Content */}
            <div className="flex-grow flex flex-col items-center justify-center">
                <span className="text-4xl mb-3">📖</span>
                <p>Chapter Summary</p>
            </div>

            {/* Flip Indicator Tab on the Right Edge */}
            <div className="absolute top-1/2 right-[-1px] -translate-y-1/2 flex items-center justify-center animate-pulse">
                <div className="bg-white/20 hover:bg-white/30 rounded-l-lg pl-1 pr-2 py-4 flex items-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
          </div>
          {/* --- END: Cover Page with New Flip Instruction --- */}

          {/* Content Pages */}
          {pages.map((page, index) => (
            <div
              key={index}
              className="p-8 bg-[#F6F4DF] text-[#8B3302] leading-relaxed"
              style={{ lineHeight: "1.9", fontSize: '16px' }}
            >
              <p style={{ whiteSpace: "pre-line" }}>{page}</p>
            </div>
          ))}

          {/* Back Cover */}
          <div className="flex items-center justify-center bg-[#8B3302] text-white font-bold text-lg p-6">
            🔚 End of Summary
          </div>
        </HTMLFlipBook>
    </div>
  );
}
