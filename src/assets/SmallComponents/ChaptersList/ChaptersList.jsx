import React, { useState } from 'react';

export default function ChaptersList({ bookID, chapters, onSelect }) {
  // State for the currently selected chapter ID
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  // State for displaying an error message instead of an alert
  const [error, setError] = useState(null);

  // Handles selecting a chapter from the list
  const handleChapterSelect = (chapterId) => {
    setSelectedChapterId(chapterId);
    // Clear any existing error message when a selection is made
    if (error) {
      setError(null);
    }
  };

  // Handles clicks on the "Summary" or "Quiz" buttons
  const handleActionClick = (actionType) => {
    if (selectedChapterId) {
      onSelect(selectedChapterId, actionType);
    } else {
      // Set an error message if no chapter is selected
      setError("Please select a chapter first.");
      // The message will automatically disappear after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Color theme definition for consistency
  const colors = {
      bg: 'bg-[#F6F4DF]',
      text: 'text-[#8B3302]',
      border: 'border-[#8B3302]',
      buttonBg: 'bg-[#8B3302]',
      buttonText: 'text-[#F6F4DF]',
      selectedBg: 'bg-[#8B3302]/20',
      hoverBg: 'hover:bg-[#8B3302]/10',
      disabledButton: 'bg-[#8B3302]/50 cursor-not-allowed'
  };

  return (
    <div className={`max-w-3xl mx-auto p-6 ${colors.bg} rounded-xl shadow-lg mt-4`}>
      <h3 className={`text-xl font-bold ${colors.text} mb-4`}>Select a Chapter:</h3>
      
      {/* Scrollable list of selectable chapters with numbering */}
      <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
        {chapters.map((ch, index) => (
          <div 
            key={ch.chapterID} 
            onClick={() => handleChapterSelect(ch.chapterID)}
            className={`
              p-4 rounded-lg shadow-sm flex justify-between items-center cursor-pointer 
              transition-all duration-200 border-2 
              ${selectedChapterId === ch.chapterID 
                ? `${colors.border} ${colors.selectedBg}` // Style for selected chapter
                : `border-transparent ${colors.hoverBg}` // Style for non-selected chapters
              }`
            }
          >
            <div className="flex items-center">
              {/* Chapter number */}
              <span className={`${colors.text} font-bold w-6 text-left mr-3`}>{index + 1}.</span>
              <span className={`${colors.text} font-medium`}>{ch.title}</span>
            </div>
            {/* Checkmark icon for the selected chapter */}
            {selectedChapterId === ch.chapterID && (
                <svg className={`w-6 h-6 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons area */}
      <div className="border-t-2 border-[#8B3302]/20 pt-4">
        <div className="flex justify-center space-x-4">
            <button
            onClick={() => handleActionClick("summary")}
            disabled={!selectedChapterId}
            className={`px-6 py-2 ${colors.buttonBg} ${colors.buttonText} rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 ${!selectedChapterId ? colors.disabledButton : ''}`}
            >
            Summary
            </button>
            <button
            onClick={() => handleActionClick("quiz")}
            disabled={!selectedChapterId}
            className={`px-6 py-2 ${colors.buttonBg} ${colors.buttonText} rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 ${!selectedChapterId ? colors.disabledButton : ''}`}
            >
            Quiz
            </button>
        </div>
      </div>
        
      {/* Error message display area */}
      <div className="h-6 mt-4 text-center">
        {error && (
          <p className="text-red-600 font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
}
