"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Smartphone, Filter, GraduationCap, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ 1. HORIZONTAL BAR CHART COMPONENT
const SabhaDistributionChart = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  // ✅ Dynamic Height: 60px per bar + 50px buffer.
  const chartHeight = data.length * 60 + 50;

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-sm border-2 border-white p-6 flex flex-col mb-8">
      <h3 className="text-pink-600 font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
        <BarChart3 size={14} /> Registration Distribution
      </h3>

      <div className="w-full overflow-hidden">
        <div style={{ height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f0f0f0"
              />

              <XAxis type="number" hide />

              <YAxis
                dataKey="name"
                type="category"
                width={140}
                tick={{ fill: "#334155", fontSize: 11, fontWeight: 800 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ fill: "#FFF5F7" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontWeight: "bold",
                }}
              />

              <Bar
                dataKey="value"
                radius={[0, 10, 10, 0]}
                barSize={28}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="value"
                  position="insideRight"
                  fill="#FFFFFF"
                  fontWeight="900"
                  fontSize={12}
                  offset={10}
                />

                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "New Entry" ? "#4CAF50" : "#F472B6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ✅ 2. MAIN PAGE COMPONENT
const KidsPage = () => {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSabha, setSelectedSabha] = useState("All");

  const fetchKids = useCallback(async () => {
    try {
      const res = await fetch(`/api/balak/all?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        const sortedKids = data.kids.sort(
          (a, b) => b.totalScore - a.totalScore
        );
        setKids(sortedKids);
      }
    } catch (error) {
      console.error("Live update error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKids();
    const liveInterval = setInterval(fetchKids, 1500);
    return () => clearInterval(liveInterval);
  }, [fetchKids]);

  const graphData = useMemo(() => {
    const counts = kids.reduce((acc, kid) => {
      acc[kid.sabha] = (acc[kid.sabha] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts)
      .map((sabha) => ({
        name: sabha,
        value: counts[sabha],
      }))
      .sort((a, b) => {
        // ✅ CUSTOM SORT LOGIC:
        // 1. If 'a' is "New Entry", move it to the end (return 1)
        if (a.name === "New Entry") return 1;
        // 2. If 'b' is "New Entry", keep 'b' at the end (return -1)
        if (b.name === "New Entry") return -1;
        // 3. Otherwise, sort by value (highest first)
        return b.value - a.value;
      });
  }, [kids]);

  const filteredKids = useMemo(() => {
    if (selectedSabha === "All") return kids;
    return kids.filter((k) => k.sabha === selectedSabha);
  }, [kids, selectedSabha]);

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-[#FFF5F7] min-h-screen font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black text-pink-600 uppercase tracking-widest leading-none">
            Live Leaderboard 🎉
          </h1>
          <Link href="/">
            <Button className="flex items-center justify-center gap-1 bg-pink-600 hover:bg-pink-700 rounded-xl px-6 font-bold shadow-lg shadow-pink-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#FFFFFF"
              >
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
              </svg>
              BACK HOME
            </Button>
          </Link>
        </header>

        {/* ✅ HORIZONTAL CHART */}
        <SabhaDistributionChart data={graphData} />

        <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border-2 border-white mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-pink-50 p-2 rounded-xl text-pink-600">
              <Filter size={18} />
            </div>
            <p className="text-xs font-black text-pink-900 uppercase tracking-widest">
              Filter By Sabha
            </p>
          </div>

          <div className="w-48">
            <Select onValueChange={setSelectedSabha} defaultValue="All">
              <SelectTrigger className="bg-pink-50 border-none rounded-2xl font-black text-pink-600 h-10 ring-pink-100">
                <SelectValue placeholder="All Sabhas" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-pink-100 font-bold">
                {[
                  "Sarangpur",
                  "Raipur Sanskardham",
                  "Raipur Sanskardham Shishu",
                  "Raipur 2",
                  "New Entry",
                ].map((sabha) => (
                  <SelectItem
                    key={sabha}
                    value={sabha}
                    className="focus:bg-pink-50 focus:text-pink-600 rounded-xl"
                  >
                    {sabha.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKids.map((kid) => (
            <div
              key={kid._id}
              className="bg-white rounded-[2rem] border-2 border-white shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-5 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-pink-50 flex-shrink-0 shadow-inner">
                  <Image
                    src={
                      kid.pictureUrl ||
                      "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"
                    }
                    alt={kid.firstName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-black text-slate-900 capitalize truncate leading-tight">
                    {kid.firstName} {kid.lastName}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5 text-pink-500 font-bold text-sm">
                    <Smartphone size={14} />
                    {kid.mobile ? (
                      <a
                        href={`tel:${kid.mobile}`}
                        className="hover:text-pink-700 hover:underline transition-colors"
                      >
                        {kid.mobile}
                      </a>
                    ) : (
                      <span className="text-gray-400">No Number</span>
                    )}
                  </div>
                  <div className="text-[14px] font-black text-pink-600 mt-1">
                    {kid.address && kid.address.trim() !== "" ? (
                      <span className="capitalize">📍 {kid.address}</span>
                    ) : (
                      <span>Score: {kid.totalScore} 🏆</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 flex flex-wrap gap-2">
                <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {kid.sabha}
                </span>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                  <GraduationCap size={12} /> Std: {kid.std}
                </span>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                  Age: {kid.age}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredKids.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-pink-100">
            <p className="text-pink-300 font-black text-xl italic tracking-tighter">
              No participants found for this selection...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsPage;
