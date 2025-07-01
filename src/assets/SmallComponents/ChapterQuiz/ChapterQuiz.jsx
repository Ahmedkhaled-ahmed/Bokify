import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import bookimg from "../../Images/bookimg.gif";

export default function ChapterQuiz({ chapterID, onClose }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const prevChapterID = useRef(null); // لحفظ الـ chapterID السابق

  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  useEffect(() => {
    // منع إعادة التحميل إذا نفس الـ chapterID
    if (!chapterID || chapterID === prevChapterID.current) return;

    prevChapterID.current = chapterID;
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setCurrentQuestion(0);

    axios
      .get(`https://boookify.runasp.net/api/chapters/${chapterID}/quiz`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setQuiz(res.data);
      })
      .catch((err) => {
        console.error("Error loading quiz:", err);
      });
  }, [chapterID]);

  const handleAnswerChange = (choice) => {
    setAnswers({ ...answers, [currentQuestion]: choice });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getScore = () => {
    if (!quiz) return 0;
    return quiz.questions.reduce(
      (score, q, idx) => (answers[idx] === q.answer ? score + 1 : score),
      0
    );
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  if (!quiz) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
        <img src={bookimg} alt="loading" />
        <p className="text-white text-xl animate-pulse">Generate Quiz ...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FEFBE9] rounded-xl p-8 w-full max-w-2xl shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-[#8B3302] hover:bg-[#6b2401] px-3 py-1 rounded-md transition duration-200"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold text-[#8B3302] mb-1 text-center">
          {quiz.quizTitle}
        </h2>
        <p className="text-sm text-gray-600 italic mb-6 text-center">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>

        {!submitted ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#E1D9C6] rounded-md p-6 mb-6"
              >
                <p className="text-gray-800 font-semibold mb-4">
                  {quiz.questions[currentQuestion].question}
                </p>
                <div className="space-y-2">
                  {quiz.questions[currentQuestion].choices.map((choice, idx) => (
                    <label key={idx} className="block">
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={choice}
                        checked={answers[currentQuestion] === choice}
                        onChange={() => handleAnswerChange(choice)}
                        className="mr-2"
                      />
                      {choice}
                    </label>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between">
              <button
                disabled={currentQuestion === 0}
                onClick={handlePrev}
                className="px-5 py-2 border-2 border-[#8B3302] text-[#8B3302] rounded-md hover:bg-[#f5eada] disabled:opacity-40 transition duration-200"
              >
                Previous
              </button>

              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 bg-[#8B3302] text-white rounded-md hover:bg-[#6b2401] transition duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-[#8B3302] text-white rounded-md hover:bg-[#6b2401] transition duration-200"
                >
                  Submit
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-[#8B3302] mb-4 text-center">
              ✔️ Quiz Submitted
            </h3>
            <p className="text-md text-center mb-4">
              Your Score: <strong>{getScore()} / {quiz.questions.length}</strong>
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-h-[300px] overflow-y-auto space-y-4"
            >
              {quiz.questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded border transition duration-300 ${
                    answers[idx] === q.answer ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <p className="font-semibold mb-1">{idx + 1}. {q.question}</p>
                  <p>Your Answer: <strong>{answers[idx] || "No answer"}</strong></p>
                  {answers[idx] !== q.answer && (
                    <p className="text-sm text-gray-700">
                      Correct Answer: <strong>{q.answer}</strong>
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
