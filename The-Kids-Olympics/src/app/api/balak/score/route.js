import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Kid from "@/models/Kid";

export async function GET() {
  try {
    await connectDB();

    const kids = await Kid.find();

    const totalKids = kids.length;

    // Count total games played
    let totalPlays = 0;
    kids.forEach((kid) => {
      kid.games.forEach((g) => {
        if (g.played) totalPlays++;
      });
    });

    // Top 3 kids by score
    const topKids = [...kids]
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 3);

    return NextResponse.json({
      success: true,
      totalKids,
      totalPlays,
      kids,
      topKids,
    });
  } catch (error) {
    console.error("Score API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch score" },
      { status: 500 }
    );
  }
}
