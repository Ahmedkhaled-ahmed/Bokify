import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const quotes = [
  "Patience is not the ability to wait, but how you act while you're waiting.",
  "The two most powerful warriors are patience and time. – Tolstoy",
  "He that can have patience can have what he will.",
  "Patience is bitter, but its fruit is sweet.",
  "Rivers know this: there is no hurry. We shall get there someday."
];

export default function LoadingScreen() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[random]);
    }, 3000);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 text-white p-4">
      {/* كتاب صغير بيقلب تلقائي */}
      <div className="mb-6">
        <HTMLFlipBook
          width={120}
          height={150}
          maxShadowOpacity={0.5}
          showCover={false}
          flippingTime={800}
          className="rounded shadow-md"
        >
          <div className="flex items-center justify-center bg-[#8B3302] text-white font-bold text-sm p-4">
            📖 Loading...
          </div>
          <div className="bg-white text-[#8B3302] p-3 text-sm">Page 1</div>
          <div className="bg-white text-[#8B3302] p-3 text-sm">Page 2</div>
          <div className="bg-white text-[#8B3302] p-3 text-sm">Page 3</div>
          <div className="bg-white text-[#8B3302] p-3 text-sm">Page 4</div>
        </HTMLFlipBook>
      </div>

      {/* حكمه */}
      <p className="text-center max-w-xs mb-4 italic text-sm animate-pulse">{quote}</p>

      {/* نقاط تحميل */}
      <div className="flex space-x-2">
        <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-400"></span>
      </div>
    </div>
  );
}
