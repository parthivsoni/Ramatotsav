"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import { BarChart3 } from "lucide-react";

// --- Helper: Smooth Number Animation ---
function AnimatedCounter({ value }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));
  useEffect(() => { spring.set(value); }, [value, spring]);
  return <motion.span>{display}</motion.span>;
}

export default function LeaderboardPage() {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [poppingIds, setPoppingIds] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const lastLeaderId = useRef(null);
  const prevScores = useRef({});
  const coinAudioRef = useRef(null);
  const scrollRef = useRef(null);

  // Snappy Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [notifications]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  useEffect(() => {
    coinAudioRef.current = new Audio("/coin.aac");
    coinAudioRef.current.preload = "auto";
    coinAudioRef.current.volume = 0.6;
  }, []);

  const playCoinSound = () => {
    if (coinAudioRef.current) {
      const soundClone = coinAudioRef.current.cloneNode();
      soundClone.volume = 0.6;
      soundClone.play().catch(() => {});
    }
  };

  const playSuccessSound = () => {
    const audio = new Audio("/success.mp3");
    audio.volume = 0.6;
    audio.play().catch((err) => console.log("Audio autoplay blocked:", err));
  };

  const speakAnnouncement = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.1;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/balak/all");
      const json = await res.json();

      if (json.success) {
        const newKidsData = json.kids;
        let globalScoreIncreased = false;
        const currentPoppers = [];

        newKidsData.forEach((kid) => {
          const oldScore = prevScores.current[kid._id];

          if (oldScore !== undefined && kid.totalScore > oldScore) {
            globalScoreIncreased = true;
            currentPoppers.push(kid._id);
            const diff = kid.totalScore - oldScore;

            const newNotif = {
              id: `${Date.now()}-${kid._id}`,
              name: kid.firstName,
              img: kid.pictureUrl,
              points: diff,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setNotifications(prev => [...prev, newNotif].slice(-10));

            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
            }, 60000);
          }
          prevScores.current[kid._id] = kid.totalScore;
        });

        if (currentPoppers.length > 0) {
          setPoppingIds((prev) => [...prev, ...currentPoppers]);
          setTimeout(() => setPoppingIds([]), 600);
        }

        if (Object.keys(prevScores.current).length > 0 && globalScoreIncreased) {
          playCoinSound();
        }

        const sortedKids = [...newKidsData].sort((a, b) => {
          if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
          return a.age - b.age;
        });

        setKids(sortedKids);
      }
    } catch (error) {
      console.error("Leaderboard Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kids.length > 0) {
      const currentLeader = kids[0];
      if (lastLeaderId.current === null) {
        lastLeaderId.current = currentLeader._id;
        return;
      }
      if (lastLeaderId.current !== currentLeader._id) {
        speakAnnouncement(`${currentLeader.firstName} is Leading the Game!`);
        lastLeaderId.current = currentLeader._id;
        playSuccessSound();
        triggerConfetti();
      }
    }
  }, [kids]);

  useEffect(() => {
    fetchScores();
    const liveInterval = setInterval(fetchScores, 1200);
    return () => clearInterval(liveInterval);
  }, []);

  const cardVariants = {
    idle: { scale: 1, backgroundColor: "rgba(255, 255, 255, 1)", borderColor: "rgba(241, 245, 249, 1)" },
    pop: { 
      scale: [1, 1.05, 1], 
      backgroundColor: ["rgba(255, 255, 255, 1)", "rgba(254, 249, 195, 1)", "rgba(255, 255, 255, 1)"], 
      borderColor: ["rgba(241, 245, 249, 1)", "rgba(250, 204, 21, 1)", "rgba(241, 245, 249, 1)"], 
      transition: { duration: 0.5, ease: "easeInOut" } 
    }
  };

  const getRankStyles = (index) => {
    switch (index) {
      case 0: return { rankColor: "text-yellow-600", badge: "/Rank1.svg" };
      case 1: return { rankColor: "text-slate-600", badge: "/Rank2.svg" };
      case 2: return { rankColor: "text-orange-600", badge: "/Rank3.svg" };
      default: return { rankColor: "text-slate-300", badge: null };
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFD]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div
      className="font-primary h-screen w-screen overflow-hidden cursor-pointer text-slate-800 font-sans p-4 md:p-8"
      onClick={() => {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        const silent = new Audio();
        silent.play().catch(() => {});
      }}
    >
      <Image src={"/fairbg.png"} alt="bgImage" fill className="object-cover fixed top-0 left-0 -z-10" />

      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 h-[90vh]">
        
        {/* LEFT SIDE: Leaderboard */}
        <div className="flex-[0.7] border-2 border-slate-200 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden relative flex flex-col h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

          <div className="relative z-10 flex justify-between items-center p-6 border-b border-slate-100 bg-white/50 shrink-0">
            <div className="flex items-center gap-3">
              <Image src={"/logo.svg"} height={400} width={400} className="h-14 w-auto cursor-pointer select-none" alt="logo" />
            </div>
            <div className="text-right">
              <span className="block text-3xl md:text-5xl font-black text-slate-800 leading-none"><AnimatedCounter value={kids.length} /></span>
              <span className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">Total Players</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col relative z-10">
            <div className="grid grid-cols-12 gap-4 px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100 shrink-0">
              <div className="col-span-2 md:col-span-1">Rank</div>
              <div className="col-span-7 md:col-span-8">Player</div>
              <div className="col-span-3 text-right">Score</div>
            </div>

            <div className="overflow-y-auto custom-scrollbar p-4 space-y-3 flex-1">
              <AnimatePresence mode="popLayout">
                {kids.map((kid, index) => {
                  const styles = getRankStyles(index);
                  const isPopping = poppingIds.includes(kid._id);
                  return (
                    <motion.div layout key={kid._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 350, damping: 25 }}>
                      <motion.div variants={cardVariants} animate={isPopping ? "pop" : "idle"} className="grid grid-cols-12 gap-4 items-center p-3 md:p-4 rounded-2xl border shadow-sm bg-white">
                        {/* ✅ FIXED: Only show number if player is NOT in top 3 */}
                        <div className={`col-span-2 md:col-span-1 text-xl font-black pl-2 flex items-center ${styles.rankColor}`}>
                          {index > 2 ? index + 1 : ""}
                        </div>
                        <div className="col-span-7 md:col-span-8 flex items-center gap-3 md:gap-4 relative">
                          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-white border-2 border-white/50 shadow-sm flex-shrink-0 z-10">
                            <Image src={kid.pictureUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"} alt={kid.firstName} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 z-10">
                            <h3 className="font-bold text-slate-800 text-sm md:text-base truncate">{kid.firstName} {kid.lastName}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase truncate opacity-80">Age: {kid.age} • {kid.sabha || "Sabha"}</p>
                          </div>
                          {styles.badge && (
                            <div className="absolute left-[-10px] md:left-[-15px] top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 z-20 -ml-12">
                              <Image src={styles.badge} width={40} height={40} alt="Rank Badge" className="drop-shadow-sm" />
                            </div>
                          )}
                        </div>
                        <div className="col-span-3 text-right pr-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-black shadow-sm border bg-white/80 border-slate-200 text-slate-800">
                            <AnimatedCounter value={kid.totalScore} />
                            <span className="ml-1 text-yellow-500">⭐</span>
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: NOTIFICATIONS SIDEBAR */}
        <div className="flex-[0.3] flex flex-col h-full">
          <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-6 border-2 border-white flex flex-col h-full shadow-2xl overflow-hidden relative">
            
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Activity</h2>
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar scroll-smooth">
              <AnimatePresence mode="popLayout">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <motion.div
                      layout
                      key={n.id}
                      initial={{ opacity: 0, x: 60, scale: 0.7, filter: "blur(10px)" }}
                      animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 600, 
                        damping: 35, 
                        mass: 0.8 
                      }}
                      className="bg-white border-b-4 border-pink-100 p-4 rounded-[1.8rem] shadow-[0_15px_35px_rgba(0,0,0,0.05)] flex items-center gap-4 relative overflow-hidden"
                    >
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-50 flex-shrink-0 shadow-inner">
                        <img 
                          src={n.img} 
                          alt={n.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-[22px] font-black text-slate-800 uppercase tracking-tighter truncate">
                          {n.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-medium text-slate-600 tracking-tighter">
                            +{n.points}
                          </span>
                          <div className="px-2 py-0.5 rounded-md bg-pink-50 text-[9px] font-black text-pink-500 uppercase italic">
                            Up
                          </div>
                        </div>
                      </div>

                      <div className="text-2xl drop-shadow-md">⭐</div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center relative">
                       <motion.div 
                         animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }} 
                         transition={{ duration: 2, repeat: Infinity }}
                         className="absolute inset-0 border-2 border-pink-200 rounded-full" 
                       />
                       <div className="w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight">System Online</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-relaxed">
                        Awaiting performance<br/>data from games
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}