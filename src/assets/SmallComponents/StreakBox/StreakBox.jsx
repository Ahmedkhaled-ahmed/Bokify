import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import fire from "../../Images/streak.gif"




function StreakModal({ streakData, onClose }) {
    if (!streakData) return null;

    const { currentStreak, longestStreak } = streakData;

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose} 
        >
            <div
                onClick={(e) => e.stopPropagation()} 
                className="relative bg-white border border-yellow-300 rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center text-center"
            >
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">&times;</button>
                
                <img src={fire} className='w-40' />
                
                <h2 className="text-2xl font-bold text-[#8B3302]">You're on a Roll!</h2>
                
                <div className="mt-6 flex justify-around w-full">
                    <div className="flex flex-col items-center">
                        <p className="text-4xl font-bold text-orange-600">{currentStreak}</p>
                        <p className="text-sm text-gray-600">Day Streak</p>
                    </div>
                    <div className="border-l border-gray-300"></div>
                    <div className="flex flex-col items-center">
                        <p className="text-4xl font-bold text-gray-700">{longestStreak}</p>
                        <p className="text-sm text-gray-600">Longest Streak</p>
                    </div>
                </div>

                <p className="mt-6 text-gray-700">Keep the flame alive! Come back tomorrow to extend your streak.</p>
            </div>
        </div>
    );
}



export default function StreakBox() {
    const [streakData, setStreakData] = useState(null);
    const [showStreakModal, setShowStreakModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const userToken = localStorage.getItem("userToken");

    useEffect(() => {
        const hasBeenShown = sessionStorage.getItem('streakModalShown');

        if (userToken && !hasBeenShown) {
            axios.get("https://boookify.runasp.net/api/Streak/my", {
                headers: { Authorization: `Bearer ${userToken}` }
            })
            .then(res => {
                const data = res.data;
                if (data && data.currentStreak > 0) {
                    setStreakData(data);
                    setShowStreakModal(true);
                    sessionStorage.setItem('streakModalShown', 'true');
                }
            })
            .catch(err => {
                console.error("Failed to fetch streak data:", err);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [userToken]);

    const handleCloseModal = () => {
        setShowStreakModal(false);
    };
    
    return (
        <>
            {showStreakModal && <StreakModal streakData={streakData} onClose={handleCloseModal} />}
        </>
    );
}
