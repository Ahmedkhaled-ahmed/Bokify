import React from "react";
import { useNavigate } from "react-router-dom";

export default function LibraryBookCard({ book }) {
  const progress = book.progress || 0;
  const navigate = useNavigate();

  const handleReadClick = () => {
    navigate(`/read?q=${book.bookID}`);
  };

  const handleDetailsClick = () => {
    navigate(`/BookDetails?q=${book.bookID}`);
  };

  return (
    <div className="w-full mx-auto bg-white p-4 rounded-2xl shadow-[1px_2px_8px_rgba(0,0,0,0.2)] flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-1/3 flex justify-center flex-shrink-0">
        <img
          src={book.coverImageUrl}
          alt={`Cover of ${book.title}`}
          className="rounded-lg w-32 h-auto object-cover shadow-md"
        />
      </div>

      <div className="w-full sm:w-2/3 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 break-words">{book.title}</h3>
            <h5 className="text-md text-gray-500">{book.author}</h5>
          </div>

          <div>
            <h6 className="text-sm font-semibold mb-1">Progress</h6>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-[#3FCE4F] h-4 flex items-center justify-center text-white font-bold text-xs"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && `${progress}%`}
              </div>
            </div>
          </div>
          {progress === 100 && (
            <p className="text-sm text-gray-500">Completed 100%</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-3 gap-2 sm:gap-0">
          <p className="text-xs text-gray-500 mb-2 sm:mb-0">
            Start from {book.startDate || "N/A"}
          </p>

          <div className="flex gap-2">
            <button
              className="bg-[#F6F4DF] text-black px-6 py-2 rounded-full text-sm shadow-md hover:shadow-xl transition duration-200 "
              onClick={handleReadClick}
            >
              Read The Book
            </button>
            <button
              className="bg-[#F6F4DF] text-black px-6 py-2 rounded-full text-sm shadow-md hover:shadow-xl transition duration-200 "
              onClick={handleDetailsClick}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
