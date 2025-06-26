import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import BookBriefModal from "../BookBriefModal/BookBriefModal";
import axios from "axios";

export default function BookCard({
  image,
  title,
  author,
  bookID,
  description,
  onDetailsClick,
}) {
  const navigate = useNavigate();
  const [showBrief, setShowBrief] = useState(false);
  const [inLibrary, setInLibrary] = useState(false);
  const [loadingLibraryStatus, setLoadingLibraryStatus] = useState(true);

  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  useEffect(() => {
    if (!token || !bookID) return;

    axios
      .get(`https://boookify.runasp.net/api/MyLibrary/books/${Number(bookID)}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setInLibrary(res.data.isInLibrary === true);
      })
      .catch((err) => {
        console.error("Failed to check book status:", err);
      })
      .finally(() => setLoadingLibraryStatus(false));
  }, [bookID, token]);

  const toggleLibrary = () => {
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const url = `https://boookify.runasp.net/api/MyLibrary/books/${bookID}`;

    if (inLibrary) {
      axios
        .delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setInLibrary(false))
        .catch((err) => {
          console.error("Failed to remove book:", err);
          alert("Failed to remove book.");
        });
    } else {
      axios
        .post(url, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setInLibrary(true))
        .catch((err) => {
          console.error("Failed to add book:", err);
          alert("Failed to add book.");
        });
    }
  };

  const handleDetails = () => {
    if (typeof onDetailsClick === "function") {
      onDetailsClick();
    } else {
      navigate(`/BookDetails?q=${bookID}`);
    }
  };

  return (
    <>
      <div className="relative bg-white rounded-[12px] p-6 flex flex-col h-full shadow-[8px_0_15px_-5px_rgba(0,0,0,0.2)] border-l-[6px] border-[#8B3302] overflow-hidden hover:scale-[1.015] transition duration-300 ease-in-out">
        <span className="absolute top-0 left-0 w-[12px] h-full bg-gradient-to-r from-[#8B3302]/30 to-transparent pointer-events-none rounded-l-[12px]" />

        <img
          src={image}
          alt={title}
          className="w-full h-72 object-cover rounded-lg mb-2"
        />
        <h4 className="text-lg font-semibold line-clamp-2">{title}</h4>
        <h5 className="text-gray-500 text-sm line-clamp-1">{author}</h5>

        <div className="flex justify-between items-center mt-auto pt-2">
          <div className="flex gap-4">
            <button
              onClick={() => setShowBrief(true)}
              className="bg-[#F6F4DF] text-black px-6 py-2 rounded-md text-sm shadow-md hover:shadow-xl transition duration-200"
            >
              BRIEF
            </button>
            <button
              onClick={handleDetails}
              className="bg-[#F6F4DF] text-black px-6 py-2 rounded-md text-sm shadow-md hover:shadow-xl transition duration-200"
            >
              Details
            </button>
          </div>
          <div onClick={toggleLibrary} className="cursor-pointer">
            {loadingLibraryStatus ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-[#8B3302] rounded-full animate-spin" />
            ) : inLibrary ? (
              <FaBookmark className="text-[#8B3302] text-2xl" />
            ) : (
              <FaRegBookmark className="text-gray-400 text-2xl" />
            )}
          </div>
        </div>
      </div>

      {showBrief && bookID && (
        <BookBriefModal
          book={{ image, title, author, bookID, description }}
          onClose={() => setShowBrief(false)}
        />
      )}
    </>
  );
}
