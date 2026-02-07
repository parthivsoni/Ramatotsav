"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Medal, Star, Crown, Sparkles } from "lucide-react";

export default function FinalWinnersPage() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealStep, setRevealStep] = useState(0);

  // Audio Refs using High Quality CDN links
  const soundReveal = useRef(null);
  const soundVictory = useRef(null);

  useEffect(() => {
    // 1. Reveal sound for 3rd and 2nd place (Magic/Whoosh reveal)
    soundReveal.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    // 2. Victory sound for 1st place (Trumpet/Fanfare)
    soundVictory.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3");
    
    // Pre-load sounds
    soundReveal.current.load();
    soundVictory.current.load();

    const fetchFinalScores = async () => {
      try {
        const res = await fetch("/api/balak/all");
        const json = await res.json();
        if (json.success) {
          const sorted = [...json.kids].sort((a, b) => b.totalScore - a.totalScore);
          const top3 = sorted.slice(0, 3);
          const podiumOrder = [top3[1], top3[0], top3[2]]; // [2nd, 1st, 3rd]
          setWinners(podiumOrder);
        }
      } catch (error) {
        console.error("Error fetching winners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFinalScores();
  }, []);

  const fireConfetti = (xPos, colors, count = 80) => {
    confetti({
      particleCount: count,
      spread: 80,
      origin: { x: xPos, y: 0.6 },
      colors: colors,
      gravity: 1.2,
      scalar: 1.2,
      zIndex: 1000,
    });
  };

  const handleScreenClick = () => {
    if (revealStep < 3) {
      const nextStep = revealStep + 1;
      setRevealStep(nextStep);

      // AUDIO TRIGGER LOGIC
      if (nextStep === 1) {
        // 3rd Place Reveal
        if (soundReveal.current) {
            soundReveal.current.currentTime = 0;
            soundReveal.current.play().catch(e => console.log("Click required for audio"));
        }
        fireConfetti(0.85, ["#fb923c", "#ffffff"]);
      } 
      else if (nextStep === 2) {
        // 2nd Place Reveal
        if (soundReveal.current) {
            soundReveal.current.currentTime = 0;
            soundReveal.current.play().catch(e => console.log("Click required for audio"));
        }
        fireConfetti(0.15, ["#cbd5e1", "#ffffff"]);
      } 
      else if (nextStep === 3) {
        // 1st Place Champion Reveal
        if (soundVictory.current) {
            soundVictory.current.currentTime = 0;
            soundVictory.current.play().catch(e => console.log("Click required for audio"));
        }
        fireConfetti(0.5, ["#facc15", "#ec4899"], 150);
        setTimeout(triggerCelebrationConfetti, 600);
      }
    }
  };

  const triggerCelebrationConfetti = () => {
    const end = Date.now() + 4 * 1000;
    const colors = ["#ec4899", "#facc15", "#3b82f6"];
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFCFD]">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-pink-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div 
      className="h-screen w-screen bg-[#FCF9EA] relative overflow-hidden font-sans text-slate-800 flex flex-col cursor-pointer"
      onClick={handleScreenClick}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/60 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl -z-10" />
      
      <div className="relative z-20 flex flex-col h-full max-w-[1600px] mx-auto w-full px-8 py-4">
        
        {/* --- DYNAMIC HEADER --- */}
        <header className="grid grid-cols-3 items-center shrink-0 w-full border-b-2 border-pink-100/50 pb-4 h-[120px]">
          <div className="flex justify-start items-center h-full gap-8">
            <div className="relative w-28 h-22">
              <Image src="/baps.png" fill alt="Logo" className="object-contain" priority />
            </div>
            <div className="relative w-32 h-24">
              <Image src="/logo-final.png" fill alt="Logo" className="object-contain" priority />
            </div>
          </div>

          <div className="text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-pink-500 text-xs font-black uppercase tracking-[0.4em] mb-1">
              <Sparkles size={14} /> Ramatotsav 2026 <Sparkles size={14} />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              Final Champions
            </h1>
          </div>

          <div className="flex items-center justify-end gap-4 h-full">
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
              <Image src="/msm.png" fill alt="Inspiration" className="object-contain rounded-lg" />
            </div>
            <div className="text-right flex flex-col gap-0.5">
              <p className="text-base md:text-[20px] font-black text-slate-700 leading-tight">
                પ્રેરક - પરમ પૂજ્ય મહંતસ્વામી મહારાજ
              </p>
              <p className="text-[14px] md:text-[16px] font-medium text-slate-500 leading-tight max-w-[350px] ml-auto">
                આયોજક - Raipur Bal Mandal 
              </p>
            </div>
          </div>
        </header>

        {revealStep === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 text-center z-50">
            <motion.p animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-pink-400 font-bold text-lg uppercase tracking-widest bg-white/80 px-8 py-3 rounded-full shadow-xl backdrop-blur-sm border border-pink-100">
              Tap to Reveal Winners
            </motion.p>
          </motion.div>
        )}

        <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden mt-4">
          <div className="flex items-end justify-center gap-4 md:gap-12 w-full h-full max-h-[70vh] pb-6">
            <AnimatePresence>
              {winners.map((kid, idx) => {
                const isFirst = kid.totalScore === Math.max(...winners.map(w => w.totalScore));
                const isThird = kid.totalScore === Math.min(...winners.map(w => w.totalScore));
                const isSecond = !isFirst && !isThird;

                let shouldShow = false;
                if (isThird && revealStep >= 1) shouldShow = true;
                if (isSecond && revealStep >= 2) shouldShow = true;
                if (isFirst && revealStep >= 3) shouldShow = true;

                if (!shouldShow) return null;

                let config = isFirst 
                  ? { h: "h-full", color: "from-yellow-400 to-yellow-600", label: "Champion", icon: <Crown size={40} className="text-yellow-900" />, rank: "01" }
                  : isSecond 
                  ? { h: "h-[85%]", color: "from-slate-300 to-slate-400", label: "Runner Up", icon: <Medal size={34} className="text-slate-700" />, rank: "02" }
                  : { h: "h-[75%]", color: "from-orange-400 to-orange-500", label: "3rd Place", icon: <Medal size={30} className="text-orange-900" />, rank: "03" };

                return (
                  <motion.div
                    key={kid._id}
                    initial={{ opacity: 0, y: 300, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className={`relative flex flex-col items-center justify-end min-w-0 flex-1 ${config.h}`}
                  >
                    <div className={`relative z-30 shrink-0 mb-4 aspect-square shadow-2xl rounded-full ${isFirst ? 'w-[75%] max-w-[200px]' : 'w-[65%] max-w-[150px]'}`}>
                      <div className={`w-full h-full rounded-full bg-gradient-to-tr ${config.color} p-1`}>
                        <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-white bg-white">
                          <Image src={kid.pictureUrl} fill className="object-cover" alt="winner" priority />
                        </div>
                      </div>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-slate-900 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex flex-col items-center justify-center border-2 border-white shadow-xl z-40">
                        <span className="text-sm md:text-lg font-black leading-none">{config.rank}</span>
                      </motion.div>
                    </div>

                    <div className="text-center mb-3 z-30 w-full shrink-0 px-2">
                      <p className="text-pink-600 font-black text-[9px] uppercase tracking-widest mb-0.5">{config.label}</p>
                      <h3 className={`font-black uppercase tracking-tight text-slate-900 leading-none truncate ${isFirst ? 'text-lg md:text-3xl' : 'text-xs md:text-xl'}`}>
                        {kid.firstName} {kid.lastName}
                      </h3>
                      <p className="text-[8px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{kid.sabha}</p>
                    </div>

                    <div className={`w-full flex-[0.7] min-h-[140px] max-h-[260px] bg-gradient-to-b ${config.color} rounded-t-[2rem] shadow-xl flex flex-col items-center justify-center relative overflow-hidden border-t-4 border-white/50`}>
                       <div className="relative z-10 flex flex-col items-center pt-2">
                          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>{config.icon}</motion.div>
                          <div className="mt-2 text-center">
                            <span className={`block font-black text-white leading-none ${isFirst ? 'text-4xl md:text-7xl' : 'text-2xl md:text-5xl'}`}>
                              {kid.totalScore}
                            </span>
                            <span className="text-[8px] md:text-[10px] font-black text-white/80 uppercase mt-1 block">Total Stars</span>
                          </div>
                       </div>
                       <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}