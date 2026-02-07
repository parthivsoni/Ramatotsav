"use client";
import { Button } from "@/components/ui/button";
import KidButton from "@/components/ui/KidButton";
import Image from "next/image";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const RootPage = () => {
  const [playingCount, setPlayingCount] = useState(0);

  useEffect(() => {
    const fetchCount = () => {
      fetch("/api/balak/count")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPlayingCount(data.totalKids);
          }
        });
    };
    fetchCount();
  }, []);

  return (
    <div className="min-h-screen px-8 py-6 font-primary">
      <header className="w-full flex items-center justify-between">
        <Image
          src={"/logo.svg"}
          height={400}
          width={400}
          className="h-14 w-auto cursor-pointer select-none"
          alt="logo"
        />
        <Link href={"/live-score"} className="">
          <KidButton label="Live Score" color="#41A67E" />
        </Link>
      </header>

      <div className="flex items-center justify-center flex-col py-10">
        <p className="text-sm font-bold text-gray-700">
          Raipur Bal Mandal Presents
        </p>
        <h1 className="text-5xl uppercase md:text-7xl font-black text-primary">
          Ramatotsav 2026
        </h1>

        <p className="text-lg mt-1">
          Currently <span className="text-green-800">{playingCount}</span> Kids
          are Playing!
        </p>

        <div className="flex items-center mt-3 justify-center scale-90 gap-2">
          <Link href={"/registration"} className="w-full">
            <KidButton label="Registration" color="#1FA7E1" />
          </Link>
          <Link href={"/games-dashboard"} className="w-full">
            <KidButton label="Dashboards" color="#FB96BB" />
          </Link>
        </div>
      </div>

      <div className="w-full rounded-2xl from-[#FFFCFB] to-[#FFF1EC] p-6 flex flex-col gap-2 border-1 border-[#FF5555]">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800">
          All Games Completed?
        </h1>

        <p className="text-sm md:text-base text-gray-600 text-center max-w-sm">
          Want to relive the excitement and let the kids play again?
        </p>

        <Link href="/replay">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <KidButton label="Replay the Fun" color="#FF5555" />
          </div>
        </Link>
      </div>

      <div className="full rounded-2xl from-[#FFFCFB] to-[#FFF1EC] p-6 flex flex-col gap-2 border-1 border-[#FAA533] mt-10">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800">
          All Players
        </h1>

        <p className="text-sm md:text-base text-gray-600 max-w-sm">
          View the all participating kids in the Olympics.
        </p>

        <Link href="/players">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <KidButton label="View All Players" color="#FAA533" />
          </div>
        </Link>
      </div>

      {/* <KidButton label="Slate Blue" color="#7274ED" />
      <KidButton label="Summer Sky" color="#1FA7E1" />
      <KidButton label="Downy" color="#6ED1CF" />
      <KidButton label="Pastel Green" color="#75D06A" />
      <KidButton label="Texas Rose" color="#FFB356" />
      <KidButton label="Mona Lisa" color="#FF8B8B" />
      <KidButton label="Illusion" color="#FB96BB" /> */}

      {/*       
      <h1 className="themefont text-4xl font-black">The Kids Olympics</h1>
      <div className="grid grid-cols-2 gap-2 px-10">
        <Link href={"/registration"} className="w-full">
          <Button className="w-full font-bold" size="lg">
            Go to Registration
          </Button>
        </Link>
        <Link href={"/live-score"} className="w-full">
          <Button className="w-full font-bold bg-green-500" size="lg">
            View Live Score
          </Button>
        </Link>
        <Link href={"/games-dashboard"} className="w-full">
          <Button className="w-full font-bold bg-blue-600" size="lg">
            Games Dashboard
          </Button>
        </Link>
        <Link href={"/players"} className="w-full">
          <Button className="w-full font-bold bg-orange-400" size="lg">
            View All Players
          </Button>
        </Link>
        <Link href={"/replay"} className="w-full">
          <Button className="w-full font-bold bg-red-400" size="lg">
            Replay
          </Button>
        </Link>
      </div> */}
    </div>
  );
};

export default RootPage;
