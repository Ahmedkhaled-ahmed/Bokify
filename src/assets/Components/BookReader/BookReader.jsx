import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import styles from './BookReader.module.css';

export default function BookReader() {
  const [searchParams] = useSearchParams();
  const bookID = searchParams.get("q");

  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const progressTimeout = useRef(null);
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (!bookID) return;
    axios.get(`https://boookify.runasp.net/api/Books/${bookID}`)
      .then((res) => {
        let fullUrl = res.data.pdfFileUrl;
        if (fullUrl && !fullUrl.startsWith("http")) {
          fullUrl = `https://boookify.runasp.net/${fullUrl.replace(/^\\+/, '')}`;
        }
        setPdfUrl(fullUrl);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading PDF:", err);
        setLoading(false);
      });
  }, [bookID]);

  const updateProgress = (page, total) => {
    const percentage = Math.round((page / total) * 100);
    if (!token || !bookID) return;

    axios.post(
      "https://boookify.runasp.net/api/Progress",
      {
        bookID: parseInt(bookID),
        lastReadPageNumber: page,
        completionPercentage: percentage
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).catch((err) => {
      console.error("Failed to update progress:", err);
    });
  };

  const handlePageChange = (e) => {
    const page = e.currentPage + 1;
    setCurrentPage(page);

    if (progressTimeout.current) {
      clearTimeout(progressTimeout.current);
    }

    progressTimeout.current = setTimeout(() => {
      updateProgress(page, totalPages);
    }, 1000);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(text);
      setSelectionPosition({
        top: rect.top + window.scrollY - 40,
        left: rect.left + window.scrollX,
      });
    } else {
      setSelectedText('');
      setSelectionPosition(null);
    }
  };

  const handleSaveNote = () => {
    if (!selectedText) return;

    axios.post("https://boookify.runasp.net/api/UserNotes", {
      bookID: parseInt(bookID),
      chapterID: currentPage,
      content: selectedText
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      alert("Note saved successfully");
      setSelectedText('');
      setSelectionPosition(null);
      window.getSelection().removeAllRanges();
    }).catch((err) => {
      console.error("Error saving note:", err);
      alert("Failed to save note.");
    });
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
    };
  }, [currentPage]);

  if (loading) return <div className="p-10 text-center text-lg">Loading PDF...</div>;
  if (!pdfUrl) return <div className="p-10 text-center text-red-600">PDF not found!</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.viewerContainer}>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
          <Viewer
            fileUrl={pdfUrl}
            plugins={[defaultLayoutPluginInstance]}
            onDocumentLoad={(e) => setTotalPages(e.doc.numPages)}
            onPageChange={handlePageChange}
          />
        </Worker>
      </div>

      {selectedText && selectionPosition && (
        <div
          style={{
            position: 'absolute',
            top: selectionPosition.top,
            left: selectionPosition.left,
            background: 'white',
            border: '1px solid #ccc',
            padding: '6px 12px',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleSaveNote}
            className="text-sm text-white bg-[#8B3302] px-4 py-1 rounded hover:bg-[#722801]"
          >
            Save to Notes
          </button>
        </div>
      )}
    </div>
  );
}
