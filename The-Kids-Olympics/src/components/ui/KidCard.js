// import Image from "next/image";
// import { Star } from "lucide-react";

// const KidCard = ({ kid }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-md p-4 flex gap-4 hover:scale-[1.02] transition">
//       <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
//         <Image
//           src={kid.pictureUrl}
//           alt={kid.firstName}
//           width={100}
//           height={100}
//           className="object-cover"
//         />
//       </div>

//       <div className="flex-1">
//         <h3 className="text-lg font-bold">
//           {kid.firstName} {kid.lastName}
//         </h3>

//         <p className="text-sm text-muted-foreground">
//           Age: {kid.age} • Sabha: {kid.sabha}
//         </p>

//         <div className="flex items-center gap-2 mt-2">
//           <Star className="text-yellow-500 fill-yellow-500 w-4 h-4" />
//           <span className="font-semibold">{kid.totalScore} Points</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KidCard;
import Image from "next/image";
import { Star } from "lucide-react";

const KidCard = ({ kid }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md p-4 flex gap-5 hover:scale-[1.02] transition-all duration-200 border border-slate-50 mt-4 mr-4">
      
      {/* 1. Cart-Style Score Badge (Halfway above/right of card) */}
      <div className="absolute -top-3 -right-3 flex items-center gap-1.5 bg-pink-400 text-white px-3 py-1.5 rounded-full shadow-lg border-2 border-white animate-in zoom-in-50 duration-500">
        <Star className="w-3.5 h-3.5 fill-white animate-pulse" />
        <span className="text-[13px] font-black tracking-tight leading-none">
          {kid.totalScore}
        </span>
      </div>

      {/* 2. Fixed Left Image */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-100 flex-shrink-0 shadow-sm">
        <Image
          src={kid.pictureUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"}
          alt={kid.firstName}
          fill
          className="object-cover"
        />
      </div>

      {/* 3. Centered Content Portion */}
      <div className="flex flex-col justify-center flex-1 min-w-0 pr-4">
        <h3 className="text-xl font-black text-slate-800 truncate capitalize leading-tight">
          {kid.firstName} {kid.lastName}
        </h3>
        
        <div className="flex flex-col gap-0.5 mt-1">
          <p className="text-[13px] text-slate-500 font-bold uppercase tracking-wide">
            Age: {kid.age}
          </p>
          <p className="text-sm text-slate-400 font-medium truncate">
            {kid.sabha}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KidCard;