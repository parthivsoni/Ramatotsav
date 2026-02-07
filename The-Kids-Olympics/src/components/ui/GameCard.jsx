'use client';

import React, { useState, useEffect } from 'react';

export default function GameCard({ kidId, userName, userImage, sabhaName, gameName, isPlayedInitially, initialStars = 0 }) {
  
  // Initialize state
  const [rating, setRating] = useState(initialStars); 
  const [isCompleted, setIsCompleted] = useState(isPlayedInitially);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- THE FIX: Sync state when props change ---
  useEffect(() => {
    // If it's a replay (Played = false but Score > 0), you might want to:
    // Option A: Show the previous score (keep this line)
    setRating(initialStars);
    
    // Option B: Force stars to 0 for replays so they HAVE to play again? 
    // If so, use: setRating(isPlayedInitially ? initialStars : 0);

    setIsCompleted(isPlayedInitially);
  }, [initialStars, isPlayedInitially, kidId]); 
  // ---------------------------------------------

  const handleStarClick = (index) => {
    if (isCompleted || isLoading) return;
    setRating(prevRating => (prevRating === index ? 0 : index));
  };

  const handleToggleAction = async () => {
    if (rating === 0 || isCompleted || isLoading) return;
    setIsLoading(true);
    
    const finalScore = rating * 1000;

    try {
      const response = await fetch('/api/balak/update-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kidId, gameName, score: finalScore }),
      });

      const result = await response.json();

      if (result.success) {
        setIsCompleted(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("Error saving: " + result.error);
      }
    } catch (error) {
      console.error("Network error saving score");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className={`relative flex items-center p-4 rounded-2xl transition-all duration-500 bg-white border border-pink-100 ${isCompleted ? 'opacity-75 grayscale-[10%]' : 'hover:shadow-md hover:scale-[1.01]'}`}>
        
        {/* LEFT: Image Section */}
        <div className="relative flex-shrink-0 mr-5 self-start sm:self-center">
          <img 
            src={userImage || 'https://via.placeholder.com/150'} 
            alt={userName} 
            className="w-14 h-14 rounded-full object-cover border-2 border-pink-100 shadow-inner" 
          />
          {isCompleted && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white shadow-sm">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* RIGHT: Content Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-1 min-w-0">
          
          <div className="flex flex-col mb-3 sm:mb-0">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-bold text-pink-900 text-base leading-tight break-words">
                {userName}
              </span>
              <span className="text-pink-400 text-[11px] font-bold uppercase tracking-wider">
                ({sabhaName})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">


            
            <div className="flex items-center gap-0.5" role="img">
              {[1, 2, 3].map((star) => (
                <button 
                  key={star} 
                  onClick={() => handleStarClick(star)} 
                  disabled={isCompleted || isLoading}
                  className={`transition-all duration-200 outline-none
                    ${!isCompleted && !isLoading ? 'hover:scale-110 active:scale-90' : 'cursor-default'} 
                    ${star <= rating ? 'text-pink-500' : 'text-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>

            <button 
              onClick={handleToggleAction} 
              disabled={rating === 0 || isCompleted || isLoading}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 outline-none ${isCompleted ? 'bg-pink-500' : rating > 0 ? 'bg-pink-200 cursor-pointer' : 'bg-gray-100 cursor-not-allowed'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 flex items-center justify-center shadow-sm ${(isCompleted || isLoading) ? 'translate-x-5' : 'translate-x-0'}`}>
                {isLoading && <div className="w-2.5 h-2.5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />}
              </div>
            </button>
          </div>
        </div>

        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl animate-in fade-in zoom-in duration-300 z-10">
            <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full border border-pink-100 shadow-sm">
              <span className="text-pink-600 font-bold text-xs uppercase tracking-widest">Score Saved</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 




