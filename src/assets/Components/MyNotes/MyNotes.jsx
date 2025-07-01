import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyNotes() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Keep for other messages like update/delete success
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState(null);

  const token = localStorage.getItem("userToken"); // Assumed to be available for authenticated requests

  // Helper function to clear messages after a delay
  const clearMessages = () => {
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 3000);
  };

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get("https://boookify.runasp.net/api/UserNotes/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(res.data);
      // Removed: setMessage("Notes fetched successfully.");
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setError("Failed to fetch notes. Please ensure you are logged in.");
    } finally {
      setLoading(false);
      clearMessages();
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (noteID) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.delete(`https://boookify.runasp.net/api/UserNotes/${noteID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Note deleted successfully!");
      fetchNotes(); // Re-fetch notes to update the list
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError("Failed to delete note. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false); // Close confirmation modal
      setNoteToDeleteId(null);
      clearMessages();
    }
  };

  const startEditing = (note) => {
    setEditingNote(note.noteID);
    setEditedContent(note.content);
  };

  const handleEditSave = async (noteID) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
        // The API endpoint for PUT needs bookID and chapterID as well,
        // so we need to get the original note's data.
        const originalNote = notes.find(n => n.noteID === noteID);
        if (!originalNote) {
            throw new Error("Original note not found for update.");
        }

        await axios.put(
            `https://boookify.runasp.net/api/UserNotes/${noteID}`,
            {
                bookID: originalNote.bookID,
                chapterID: originalNote.chapterID,
                content: editedContent
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
      setMessage("Note updated successfully!");
      setEditingNote(null);
      setEditedContent("");
      fetchNotes(); // Re-fetch notes to update the list with new content
    } catch (err) {
      console.error("Failed to update note:", err);
      setError("Failed to update note. Please try again.");
    } finally {
      setLoading(false);
      clearMessages();
    }
  };

  const confirmDelete = (noteID) => {
    setNoteToDeleteId(noteID);
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setNoteToDeleteId(null);
  };

  const handleActualDelete = () => {
    if (noteToDeleteId) {
      handleDelete(noteToDeleteId);
    }
  };


  return (
    <div className="min-h-screen mt-20 bg-[#F6F4DF] p-6 font-inter text-left">
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Google Fonts - Inter */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <header className="bg-[#8B3302] p-6 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-bold">My Notes</h1>
        </header>

        <div className="p-6">
          {/* Messages and Errors */}
          {loading && (
            <div className="flex items-center justify-center p-3 mb-4 bg-gray-100 text-gray-700 rounded-lg shadow-sm">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#8B3302]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-left" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline mr-2">{error}</span>
            </div>
          )}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 text-left" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline mr-2">{message}</span>
            </div>
          )}

          {notes.length === 0 && !loading && !error ? (
            <p className="text-gray-600 text-lg text-center py-8">No notes to display.</p>
          ) : (
            <div className="space-y-6">
              {notes.map((note) => (
                <div key={note.noteID} className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="mb-3 text-sm text-gray-500 flex justify-between items-center flex-wrap">
                    <span className="font-medium">
                      Book: <span className="text-[#8B3302] font-semibold">{note.bookTitle || "N/A"}</span> – Chapter: <span className="text-[#8B3302] font-semibold">{note.chapterTitle || "N/A"}</span>
                    </span>
                    <span className="text-xs text-gray-400">Note ID: {note.noteID}</span>
                  </div>

                  {editingNote === note.noteID ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-md text-base focus:ring-[#8B3302] focus:border-[#8B3302] outline-none transition-all duration-200 resize-y min-h-[80px] text-left"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-800 text-lg leading-relaxed">{note.content}</p>
                  )}

                  <div className="mt-4 flex gap-3 justify-end">
                    {editingNote === note.noteID ? (
                      <>
                        <button
                          onClick={() => handleEditSave(note.noteID)}
                          className="px-5 py-2 bg-[#8B3302] text-white font-medium rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#8B3302] focus:ring-opacity-50 transition-colors duration-200"
                        >
                          Save Edit
                        </button>
                        <button
                          onClick={() => {
                            setEditingNote(null);
                            setEditedContent("");
                          }}
                          className="px-5 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditing(note)}
                        className="px-5 py-2 bg-[#8B3302] text-white font-medium rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#8B3302] focus:ring-opacity-50 transition-colors duration-200"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => confirmDelete(note.noteID)}
                      className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-7 rounded-xl shadow-2xl w-full max-w-sm text-center border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-red-700">Confirm Deletion</h3>
            <p className="mb-6 text-gray-700 text-base leading-relaxed">
              Are you sure you want to delete this note (<span className="font-bold text-[#8B3302]">ID: {noteToDeleteId}</span>)?
              This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleActualDelete}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
