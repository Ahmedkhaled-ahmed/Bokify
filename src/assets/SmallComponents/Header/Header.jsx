import React, { useState, useEffect } from "react";

import head1 from "../../Images/head1.png";
import head2 from "../../Images/head2.png";



export default function Header() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return <>
    
    <header className="bg-[#F6F4DF] min-h-[85vh] relative pt-20 pb-20">
      <div className="container mx-auto flex items-center justify-center p-5 h-full">
        <div className="w-full max-w-6xl relative">
          
          {/* Slides wrapper with overflow-hidden */}
          <div className="overflow-hidden">
            <div
              className="flex w-[200%] transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 50}%)` }}
            >
              {/* Slide 1 */}
              <div className="w-1/2 grid grid-cols-1 lg:grid-cols-3 items-center gap-4 px-4">
                <h1 className="text-center text-3xl md:text-5xl font-[Mali]">
                  Quiz For Each Chapter
                </h1>
                <img src={head1} alt="Quiz illustration" className="mx-auto w-full max-w-xs sm:max-w-sm" />
                <h1 className="text-center text-3xl md:text-5xl font-[Mali]">
                  Final Exam FOR All Books
                </h1>
              </div>

              {/* Slide 2 */}
              <div className="w-1/2 grid grid-cols-1 lg:grid-cols-3 items-center gap-4 px-4">
                <h1 className="text-center text-3xl md:text-5xl font-[Mali]">
                  Summaries for Every Chapter
                </h1>
                <img src={head2} alt="Summary illustration" className="mx-auto w-full max-w-xs sm:max-w-sm" />
                <h1 className="text-center text-3xl md:text-5xl font-[Mali]">
                  Insights for Every Book!
                </h1>
              </div>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
            {[0, 1].map((i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2.5 w-16 rounded-xl transition-all duration-300 ${
                  currentSlide === i ? "bg-[#8B3302]" : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>

        </div>
      </div>
    </header>
  </>;
}
