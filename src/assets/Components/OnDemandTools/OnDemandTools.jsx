import React, { useState } from "react";
import UploadAndProcessBook from "../../SmallComponents/UploadAndProcessBook/UploadAndProcessBook.jsx";
import ChaptersList from "../../SmallComponents/ChaptersList/ChaptersList.jsx";
import SummaryViewer from "../../SmallComponents/SummaryViewer/SummaryViewer.jsx";
import ChapterQuiz from "../../SmallComponents/ChapterQuiz/ChapterQuiz.jsx";

export default function OnDemandTools() {
  const [book, setBook] = useState(null);
  const [selectedChapterID, setSelectedChapterID] = useState(null);
  const [viewMode, setViewMode] = useState(""); // "summary" or "quiz"

  const handleChaptersFetched = (bookData) => {
    setBook(bookData);
    setSelectedChapterID(null);
    setViewMode("");
  };

  const handleSelect = (chapterID, mode) => {
    setSelectedChapterID(chapterID);
    setViewMode(mode);
  };

  const handleCloseViewer = () => {
    setSelectedChapterID(null);
    setViewMode(""); // 👈 لازم تصفر المود كمان عشان السامري ميرجعش
  };

  return (
    <div className="p-26">
      <UploadAndProcessBook onChaptersFetched={handleChaptersFetched} />

      {book && (
        <ChaptersList
          bookID={book.bookID}
          chapters={book.chapters}
          onSelect={handleSelect}
        />
      )}

      {selectedChapterID && viewMode === "summary" && (
        <SummaryViewer
          chapterID={selectedChapterID}
          onClose={handleCloseViewer}
        />
      )}

      {selectedChapterID && viewMode === "quiz" && (
  <ChapterQuiz
    chapterID={selectedChapterID}
    onClose={() => {
      setSelectedChapterID(null);
      setViewMode("");
    }}
  />
)}

    </div>
  );
}
